<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'permissions' => 'nullable|array',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'staff',
            'admin_permissions' => array_values(array_intersect(
                array_keys(config('admin_permissions', [])),
                $request->input('permissions', []),
            )),
            'is_active' => true,
        ]);

        $token = $user->createToken('cma-admin')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role === 'citizen') {
            throw ValidationException::withMessages([
                'email' => ['Access denied. This portal is for administrative staff only.'],
            ]);
        }

        if (! $user->isAdminAccountActive()) {
            throw ValidationException::withMessages([
                'email' => ['This administrator account has been disabled.'],
            ]);
        }

        $token = $user->createToken('cma-admin')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json(['data' => $this->userPayload($request->user())]);
    }

    public function citizenRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'nic' => 'required|string|max:20',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nic' => $request->nic,
            'password' => Hash::make($request->password),
            'role' => 'citizen',
        ]);

        $token = $user->createToken('cma-citizen')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function citizenLogin(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->where('role', 'citizen')->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('cma-citizen')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|file|max:10240', // 10MB max
        ]);

        $user = $request->user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $file = $request->file('profile_picture');
        $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
        $file->move(storage_path('app/public/profile-pictures'), $filename);
        $path = 'profile-pictures/' . $filename;
        
        $user->profile_picture = $path;
        $user->save();

        $userData = $user->toArray();
        $userData['profile_picture_url'] = asset('storage/' . $path);

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'data' => $userData
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'nic' => $user->nic,
            'role' => $user->isSuperAdmin() ? 'super_admin' : $user->role,
            'permissions' => $user->isSuperAdmin()
                ? array_keys(config('admin_permissions', []))
                : ($user->admin_permissions ?? []),
            'is_active' => $user->isAdminAccountActive(),
            'is_super_admin' => $user->isSuperAdmin(),
            'profile_picture_url' => $user->profile_picture
                ? asset('storage/' . $user->profile_picture)
                : null,
        ];
    }
}
