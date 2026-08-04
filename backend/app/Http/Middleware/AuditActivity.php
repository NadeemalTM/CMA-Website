<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuditActivity
{
    private const EXCLUDED_PATHS = [
        'api/v1/translate',
        'api/v1/bookings/status',
    ];

    private const SENSITIVE_FIELDS = [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
        'token',
        'access_token',
        'authorization',
        'card_number',
        'card_name',
        'card_expiry',
        'card_cvv',
        'cvv',
        'otp',
        'otp_code',
        'secret',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldAudit($request)) {
            return $next($request);
        }

        try {
            $response = $next($request);
            $this->record($request, $response->getStatusCode(), $response);

            return $response;
        } catch (Throwable $exception) {
            $status = $exception instanceof ValidationException
                ? $exception->status
                : (method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500);

            $this->record($request, (int) $status, null, Str::afterLast($exception::class, '\\'));
            throw $exception;
        }
    }

    private function shouldAudit(Request $request): bool
    {
        return (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)
                || str_ends_with($request->path(), '/download'))
            && ! in_array($request->path(), self::EXCLUDED_PATHS, true);
    }

    private function record(
        Request $request,
        int $statusCode,
        ?Response $response = null,
        ?string $exceptionType = null,
    ): void {
        try {
            $context = $this->context($request, $response);
            $action = $this->action($request);
            $module = $this->module($request);
            $subjectId = $this->subjectId($request, $response);
            $successful = $statusCode < 400;
            $description = sprintf(
                '%s %s %s%s%s.',
                $context['actor_name'] ?: ucfirst($context['actor_type']),
                str_replace('_', ' ', $action),
                str_replace('_', ' ', $module),
                $subjectId ? ' #' . $subjectId : '',
                $successful ? '' : ' (failed)',
            );

            $metadata = $this->metadata($request, $response, $exceptionType);

            ActivityLog::create([
                'user_id' => $context['user_id'],
                'actor_type' => $context['actor_type'],
                'actor_name' => $context['actor_name'],
                'actor_email' => $context['actor_email'],
                'action' => $action,
                'module' => $module,
                'description' => Str::limit($description, 500, ''),
                'method' => $request->method(),
                'path' => Str::limit($request->path(), 500, ''),
                'subject_type' => $module,
                'subject_id' => $subjectId,
                'status_code' => $statusCode,
                'ip_address' => $request->ip(),
                'user_agent' => Str::limit((string) $request->userAgent(), 2000, ''),
                'metadata' => $metadata ?: null,
                'created_at' => now(),
            ]);
        } catch (Throwable) {
            // Auditing must never interrupt the action being recorded.
        }
    }

    private function context(Request $request, ?Response $response): array
    {
        $user = $request->user();
        $responseUser = $this->responseData($response)['user'] ?? null;

        if (! $user && is_array($responseUser) && isset($responseUser['id'])) {
            $user = User::find($responseUser['id']);
        }

        $path = $request->path();
        $actorType = $user
            ? ($user->isAdminUser() ? 'admin' : 'citizen')
            : (str_contains($path, '/admin/') ? 'admin' : (str_contains($path, '/citizen/') ? 'citizen' : 'guest'));

        return [
            'user_id' => $user?->id,
            'actor_type' => $actorType,
            'actor_name' => $user?->name,
            'actor_email' => $user?->email ?? $request->input('email'),
        ];
    }

    private function action(Request $request): string
    {
        $path = $request->path();

        return match (true) {
            str_ends_with($path, '/login') => 'login',
            str_ends_with($path, '/logout') => 'logout',
            str_ends_with($path, '/register') => 'registered',
            str_ends_with($path, '/download') => 'downloaded',
            str_contains($path, 'payment-status') => 'payment_status_updated',
            str_ends_with($path, '/status') => 'status_updated',
            str_ends_with($path, '/pay') || str_contains($path, 'initiate-payment') || str_ends_with($path, '/complete') => 'payment_submitted',
            str_ends_with($path, '/apply') => 'application_submitted',
            str_contains($path, '/upload') || str_contains($path, 'profile-picture') => 'uploaded',
            $request->isMethod('delete') => 'deleted',
            $request->isMethod('put') || $request->isMethod('patch') => 'updated',
            str_contains($path, '/admin/') => 'created',
            default => 'submitted',
        };
    }

    private function module(Request $request): string
    {
        $segments = explode('/', preg_replace('#^api/v1/#', '', $request->path()));

        if (($segments[0] ?? null) === 'admin') {
            $resource = $segments[1] ?? 'administration';
            return in_array($resource, ['login', 'logout', 'register'], true)
                ? 'authentication'
                : str_replace('-', '_', $resource);
        }

        if (($segments[0] ?? null) === 'citizen') {
            $resource = $segments[1] ?? 'citizen';
            return in_array($resource, ['login', 'register'], true)
                ? 'authentication'
                : 'citizen_' . str_replace('-', '_', $resource);
        }

        if (($segments[0] ?? null) === 'vacancies' && in_array('apply', $segments, true)) {
            return 'job_applications';
        }

        return str_replace('-', '_', $segments[0] ?? 'website');
    }

    private function subjectId(Request $request, ?Response $response): ?string
    {
        foreach (['id', 'user', 'ref', 'slot', 'documentId'] as $key) {
            $value = $request->route($key);
            if ($value instanceof User) $value = $value->id;
            if (is_scalar($value) && $value !== '') return Str::limit((string) $value, 100, '');
        }

        $data = $this->responseData($response);
        $id = data_get($data, 'data.id') ?? data_get($data, 'data.payment.id') ?? data_get($data, 'user.id');

        return is_scalar($id) ? Str::limit((string) $id, 100, '') : null;
    }

    private function metadata(Request $request, ?Response $response, ?string $exceptionType): array
    {
        $fields = collect(array_keys($request->all()))
            ->reject(fn (string $field) => $this->isSensitive($field))
            ->values()
            ->all();

        $metadata = ['changed_fields' => $fields];
        foreach (['status', 'payment_status', 'booking_status', 'is_active', 'role', 'reference_no'] as $field) {
            if ($request->has($field)) $metadata[$field] = $request->input($field);
        }
        if ($request->has('permissions')) $metadata['permissions'] = $request->input('permissions');
        if ($request->has('email') && str_contains($request->path(), 'admin-users')) {
            $metadata['target_email'] = $request->input('email');
        }

        $responseMessage = data_get($this->responseData($response), 'message');
        if (is_string($responseMessage)) $metadata['response_message'] = Str::limit($responseMessage, 500, '');
        if ($exceptionType) $metadata['error_type'] = $exceptionType;

        return $metadata;
    }

    private function isSensitive(string $field): bool
    {
        $field = strtolower($field);
        return in_array($field, self::SENSITIVE_FIELDS, true)
            || str_contains($field, 'password')
            || str_contains($field, 'token')
            || str_contains($field, 'card')
            || str_contains($field, 'cvv')
            || str_contains($field, 'otp')
            || str_contains($field, 'secret');
    }

    private function responseData(?Response $response): array
    {
        if (! $response || ! method_exists($response, 'getContent')) return [];
        $decoded = json_decode((string) $response->getContent(), true);
        return is_array($decoded) ? $decoded : [];
    }
}
