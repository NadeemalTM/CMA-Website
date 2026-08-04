<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActivityHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_admin_login_is_recorded(): void
    {
        $admin = User::factory()->create([
            'email' => 'history-admin@example.com',
            'password' => 'SecurePass123!',
            'role' => 'staff',
            'admin_permissions' => ['history'],
            'is_active' => true,
        ]);

        $this->postJson('/api/v1/admin/login', [
            'email' => $admin->email,
            'password' => 'SecurePass123!',
        ])->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'actor_type' => 'admin',
            'action' => 'login',
            'module' => 'authentication',
            'status_code' => 200,
        ]);
    }

    public function test_audited_admin_action_never_stores_password_values(): void
    {
        $superAdmin = User::factory()->create([
            'email' => User::SUPER_ADMIN_EMAIL,
            'role' => 'super_admin',
            'is_active' => true,
        ]);
        Sanctum::actingAs($superAdmin);

        $this->postJson('/api/v1/admin/admin-users', [
            'name' => 'History Officer',
            'email' => 'history-officer@example.com',
            'password' => 'DoNotStoreThis123!',
            'password_confirmation' => 'DoNotStoreThis123!',
            'permissions' => ['history'],
            'is_active' => true,
        ])->assertCreated();

        $log = ActivityLog::where('module', 'admin_users')->latest('id')->firstOrFail();
        $encodedMetadata = json_encode($log->metadata);

        $this->assertSame('created', $log->action);
        $this->assertStringNotContainsString('DoNotStoreThis123!', $encodedMetadata);
        $this->assertNotContains('password', $log->metadata['changed_fields']);
        $this->assertNotContains('password_confirmation', $log->metadata['changed_fields']);
    }

    public function test_history_endpoint_supports_filters_and_pagination(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['history'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        ActivityLog::create([
            'user_id' => $admin->id,
            'actor_type' => 'admin',
            'actor_name' => $admin->name,
            'actor_email' => $admin->email,
            'action' => 'status_updated',
            'module' => 'bookings',
            'description' => 'Booking was approved.',
            'method' => 'PATCH',
            'path' => 'api/v1/admin/bookings/10/status',
            'subject_id' => '10',
            'status_code' => 200,
            'ip_address' => '127.0.0.1',
            'created_at' => now(),
        ]);

        ActivityLog::create([
            'actor_type' => 'guest',
            'action' => 'submitted',
            'module' => 'complaints',
            'description' => 'Guest submitted complaints.',
            'method' => 'POST',
            'path' => 'api/v1/complaints',
            'status_code' => 422,
            'created_at' => now(),
        ]);

        $this->getJson('/api/v1/admin/history?module=bookings&result=success&search=approved')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.module', 'bookings')
            ->assertJsonPath('data.0.subject_id', '10')
            ->assertJsonStructure(['filters' => ['modules', 'actions', 'actor_types', 'actors']]);
    }

    public function test_history_endpoint_requires_history_permission(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['dashboard'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/history')
            ->assertForbidden()
            ->assertJsonPath('code', 'permission_denied');
    }
}
