<?php

namespace Tests\Feature;

use App\Models\BungalowHeroImage;
use App\Models\Leader;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WebsiteContentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_bungalow_hero_images_are_returned_by_slot(): void
    {
        $this->getJson('/api/v1/bungalow-hero-images')
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(4, 'data')
            ->assertJsonFragment(['slot' => 'background']);
    }

    public function test_bungalow_room_admin_can_update_a_hero_image(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['bungalow_rooms'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->putJson('/api/v1/admin/bungalow-hero-images/gallery_2', [
            'image' => 'uploads/kataragama-living-room.jpg',
            'alt_text' => 'New living room',
            'is_active' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.slot', 'gallery_2')
            ->assertJsonPath('data.image', 'uploads/kataragama-living-room.jpg');

        $this->assertDatabaseHas('bungalow_hero_images', [
            'slot' => 'gallery_2',
            'image' => 'uploads/kataragama-living-room.jpg',
        ]);
    }

    public function test_leadership_admin_can_create_a_board_member(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['leadership'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/v1/admin/leaders', [
            'name' => 'Test Board Member',
            'section_type' => 'board',
            'position_en' => 'Board Member',
            'order' => 1,
            'is_active' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.section_type', 'board');

        $this->getJson('/api/v1/leaders')
            ->assertOk()
            ->assertJsonFragment([
                'name' => 'Test Board Member',
                'section_type' => 'board',
            ]);
    }

    public function test_hero_image_routes_enforce_bungalow_room_permission(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['leadership'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/bungalow-hero-images')
            ->assertForbidden()
            ->assertJsonPath('code', 'permission_denied');
    }
}
