<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->whereIn('role', ['admin', 'staff', 'super_admin'])
            ->orderByRaw("CASE WHEN LOWER(email) = ? THEN 0 ELSE 1 END", [User::SUPER_ADMIN_EMAIL])
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->formatUser($user));

        return response()->json([
            'data' => $users,
            'permissions' => $this->permissionOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'role' => 'staff',
            'admin_permissions' => $this->validatedPermissions($data['permissions'] ?? []),
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Administrator account created successfully.',
            'data' => $this->formatUser($user),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $this->ensureEditable($request, $user);

        $data = $request->validate($this->rules($user));
        $updates = [
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'admin_permissions' => $this->validatedPermissions($data['permissions'] ?? []),
            'is_active' => $data['is_active'] ?? true,
        ];

        if (! empty($data['password'])) {
            $updates['password'] = Hash::make($data['password']);
        }

        $user->update($updates);

        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'Administrator access updated successfully.',
            'data' => $this->formatUser($user->fresh()),
        ]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $this->ensureEditable($request, $user);

        $data = $request->validate(['is_active' => 'required|boolean']);
        $user->update(['is_active' => $data['is_active']]);

        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_active
                ? 'Administrator access restored.'
                : 'Administrator access revoked.',
            'data' => $this->formatUser($user),
        ]);
    }

    private function rules(?User $user = null): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (strtolower((string) $value) === User::SUPER_ADMIN_EMAIL) {
                        $fail('The primary super administrator email address is reserved.');
                    }
                },
            ],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:8', 'confirmed'],
            'permissions' => 'present|array',
            'permissions.*' => ['string', Rule::in(array_keys(config('admin_permissions', [])))],
            'is_active' => 'required|boolean',
        ];
    }

    private function validatedPermissions(array $permissions): array
    {
        return array_values(array_intersect(
            array_keys(config('admin_permissions', [])),
            array_unique($permissions),
        ));
    }

    private function permissionOptions(): array
    {
        return collect(config('admin_permissions', []))
            ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
            ->values()
            ->all();
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->isSuperAdmin() ? 'super_admin' : $user->role,
            'permissions' => $user->isSuperAdmin()
                ? array_keys(config('admin_permissions', []))
                : ($user->admin_permissions ?? []),
            'is_active' => (bool) $user->is_active,
            'is_super_admin' => $user->isSuperAdmin(),
            'created_at' => $user->created_at,
        ];
    }

    private function ensureEditable(Request $request, User $user): void
    {
        abort_if($user->role === 'citizen', 404);
        abort_if($user->isSuperAdmin(), 422, 'The primary super administrator account cannot be modified here.');
        abort_if($request->user()->is($user), 422, 'You cannot revoke or modify your own access.');
    }
}
