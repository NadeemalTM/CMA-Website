<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdminUser()) {
            return response()->json([
                'message' => 'Administrative access is required.',
                'code' => 'admin_access_required',
            ], 403);
        }

        if (! $user->isAdminAccountActive()) {
            return response()->json([
                'message' => 'Your administrator account has been disabled.',
                'code' => 'account_disabled',
            ], 403);
        }

        if (! $user->hasAdminPermission($permission)) {
            return response()->json([
                'message' => 'You do not have permission to access this admin module.',
                'code' => 'permission_denied',
            ], 403);
        }

        return $next($request);
    }
}
