<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_primary_super_administrator_can_login_even_if_legacy_active_flag_is_false(): void
    {
        $user = User::factory()->create([
            'email' => User::SUPER_ADMIN_EMAIL,
            'password' => 'correct-password',
            'role' => 'admin',
            'is_active' => false,
        ]);

        $this->postJson('/api/v1/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ])
            ->assertOk()
            ->assertJsonPath('user.role', 'super_admin')
            ->assertJsonPath('user.is_active', true)
            ->assertJsonPath('user.is_super_admin', true);
    }

    public function test_cross_subdomain_admin_login_does_not_require_a_csrf_cookie(): void
    {
        User::factory()->create([
            'email' => User::SUPER_ADMIN_EMAIL,
            'password' => 'correct-password',
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        $this->withHeader('Origin', 'https://condominium.lk')
            ->postJson('/api/v1/admin/login', [
                'email' => User::SUPER_ADMIN_EMAIL,
                'password' => 'correct-password',
            ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_super_administrator_can_create_an_admin_with_selected_permissions(): void
    {
        $superAdmin = User::factory()->create([
            'email' => User::SUPER_ADMIN_EMAIL,
            'role' => 'super_admin',
            'is_active' => true,
        ]);
        Sanctum::actingAs($superAdmin);

        $response = $this->postJson('/api/v1/admin/admin-users', [
            'name' => 'Content Officer',
            'email' => 'content@condominium.lk',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'permissions' => ['news', 'announcements'],
            'is_active' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.role', 'staff')
            ->assertJsonPath('data.permissions.0', 'news')
            ->assertJsonPath('data.permissions.1', 'announcements');

        $this->assertDatabaseHas('users', [
            'email' => 'content@condominium.lk',
            'role' => 'staff',
            'is_active' => true,
        ]);
    }

    public function test_regular_admin_cannot_manage_admin_accounts(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['dashboard'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/admin-users')
            ->assertForbidden()
            ->assertJsonPath('code', 'super_admin_required');
    }

    public function test_admin_module_routes_enforce_assigned_permissions(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['news'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/news')->assertOk();
        $this->getJson('/api/v1/admin/documents')
            ->assertForbidden()
            ->assertJsonPath('code', 'permission_denied');
    }

    public function test_revoked_admin_account_cannot_use_admin_routes(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['dashboard'],
            'is_active' => false,
        ]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/dashboard')
            ->assertForbidden()
            ->assertJsonPath('code', 'account_disabled');
    }

    public function test_primary_super_administrator_cannot_be_modified(): void
    {
        $superAdmin = User::factory()->create([
            'email' => User::SUPER_ADMIN_EMAIL,
            'role' => 'super_admin',
            'is_active' => true,
        ]);
        Sanctum::actingAs($superAdmin);

        $this->patchJson("/api/v1/admin/admin-users/{$superAdmin->id}/status", [
            'is_active' => false,
        ])->assertUnprocessable();
    }

    public function test_cpanel_alternate_authorization_header_is_supported(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['dashboard'],
            'is_active' => true,
        ]);
        $token = $admin->createToken('test-admin')->plainTextToken;

        $this->withHeader('X-Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk();
    }
}
