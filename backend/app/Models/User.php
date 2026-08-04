<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public const SUPER_ADMIN_EMAIL = 'admin@condominium.lk';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'nic',
        'profile_picture',
        'password',
        'role',
        'admin_permissions',
        'is_active',
    ];
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'admin_permissions' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin'
            || strtolower($this->email) === self::SUPER_ADMIN_EMAIL;
    }

    public function isAdminUser(): bool
    {
        return $this->isSuperAdmin() || in_array($this->role, ['admin', 'staff'], true);
    }

    public function isAdminAccountActive(): bool
    {
        // The reserved primary account is the recovery authority for every other
        // administrator, so it must never be lockable through the access flag.
        return $this->isSuperAdmin() || (bool) $this->is_active;
    }

    public function hasAdminPermission(string $permission): bool
    {
        return $this->isSuperAdmin()
            || in_array($permission, $this->admin_permissions ?? [], true);
    }
}
