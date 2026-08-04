<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\BungalowRoom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class KataragamaBookingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_a_pending_request_with_a_meaningful_reference(): void
    {
        $this->createRoom();

        $response = $this->postJson('/api/v1/bookings', $this->bookingPayload());

        $response
            ->assertCreated()
            ->assertJsonPath('data.status', 'Pending')
            ->assertJsonPath('data.payment_status', 'Pending');

        $this->assertMatchesRegularExpression(
            '/^KTGB\d{6}$/',
            $response->json('data.reference_no'),
        );
    }

    public function test_only_approved_booking_blocks_calendar_and_conflicting_approval_is_rejected(): void
    {
        $this->createRoom();
        $first = $this->postJson('/api/v1/bookings', $this->bookingPayload())->assertCreated()->json('data');
        $second = $this->postJson('/api/v1/bookings', [
            ...$this->bookingPayload(),
            'email' => 'second@example.com',
            'phone' => '0772222222',
            'nic' => '199222222222',
        ])->assertCreated()->json('data');

        $date = now()->addDays(10)->toDateString();
        $this->getJson('/api/v1/bookings/availability')
            ->assertOk()
            ->assertJsonPath("data.{$date}", 'available');

        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['bookings'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/bookings/{$first['id']}/status", [
            'status' => 'Confirmed',
        ])->assertOk();

        $this->getJson('/api/v1/bookings/availability')
            ->assertOk()
            ->assertJsonPath("data.{$date}", 'booked');

        $this->patchJson("/api/v1/admin/bookings/{$second['id']}/status", [
            'status' => 'Confirmed',
        ])->assertConflict();
    }

    public function test_guest_can_track_approval_without_exposing_booking_by_reference_alone(): void
    {
        $booking = Booking::create([
            ...$this->bookingPayload(),
            'status' => 'Confirmed',
            'payment_status' => 'Pending',
        ]);

        $this->postJson('/api/v1/bookings/status', [
            'reference_no' => $booking->reference_no,
            'phone' => 'wrong-phone',
        ])->assertNotFound();

        $this->postJson('/api/v1/bookings/status', [
            'reference_no' => strtolower($booking->reference_no),
            'phone' => $booking->phone,
        ])
            ->assertOk()
            ->assertJsonPath('data.booking_status', 'Confirmed')
            ->assertJsonPath('data.message', 'Booking successful. Your reservation has been approved.');
    }

    public function test_multi_room_request_uses_one_reference_and_calculates_tax_on_server(): void
    {
        $roomA = $this->createRoom();
        $roomB = $this->createRoom('Room B – Standard', 3000, 2000);

        $response = $this->postJson('/api/v1/bookings', [
            ...$this->bookingPayload(),
            'room_ids' => [$roomA->id, $roomB->id],
            'unit_number' => null,
            'amount' => 1,
        ])->assertCreated();

        $response
            ->assertJsonCount(2, 'data.room_ids')
            ->assertJsonPath('data.subtotal', '16000.00')
            ->assertJsonPath('data.tax_rate', '18.00')
            ->assertJsonPath('data.tax_amount', '2880.00')
            ->assertJsonPath('data.amount', '18880.00');

        $this->assertDatabaseCount('bookings', 1);
        $this->assertSame('Room A – Deluxe, Room B – Standard', $response->json('data.unit_number'));
    }

    public function test_confirmed_room_does_not_block_an_empty_room_for_the_same_dates(): void
    {
        $roomA = $this->createRoom();
        $roomB = $this->createRoom('Room B – Standard', 3000, 2000);

        $first = $this->postJson('/api/v1/bookings', [
            ...$this->bookingPayload(),
            'room_ids' => [$roomA->id],
            'unit_number' => null,
        ])->assertCreated()->json('data');
        $second = $this->postJson('/api/v1/bookings', [
            ...$this->bookingPayload(),
            'email' => 'room-b@example.com',
            'phone' => '0773333333',
            'nic' => '199333333333',
            'room_ids' => [$roomB->id],
            'unit_number' => null,
        ])->assertCreated()->json('data');

        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['bookings'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/bookings/{$first['id']}/status", ['status' => 'Confirmed'])->assertOk();

        $date = now()->addDays(10)->toDateString();
        $this->getJson('/api/v1/bookings/availability')
            ->assertOk()
            ->assertJsonPath("data.{$date}", 'partial')
            ->assertJsonPath("rooms.{$roomA->id}.{$date}", 'booked')
            ->assertJsonPath("rooms.{$roomB->id}.{$date}", 'available');

        $this->patchJson("/api/v1/admin/bookings/{$second['id']}/status", ['status' => 'Confirmed'])->assertOk();

        $this->getJson('/api/v1/bookings/availability')
            ->assertOk()
            ->assertJsonPath("data.{$date}", 'booked');
    }

    public function test_booking_admin_can_publish_tax_and_reference_banner_settings(): void
    {
        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['bookings'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);

        $this->putJson('/api/v1/admin/bookings/settings', [
            'tax_rate' => 12.5,
            'reference_banner' => 'uploads/kataragama-banner.webp',
            'reference_banner_alt' => 'Kataragama booking payment instructions',
        ])->assertOk()->assertJsonPath('data.tax_rate', '12.50');

        $this->getJson('/api/v1/bookings/settings')
            ->assertOk()
            ->assertJsonPath('data.tax_rate', 12.5)
            ->assertJsonPath('data.reference_banner_alt', 'Kataragama booking payment instructions');
    }

    private function createRoom(string $name = 'Room A – Deluxe', float $price = 5000, float $employeePrice = 3500): BungalowRoom
    {
        return BungalowRoom::create([
            'name' => $name,
            'beds' => '1 double bed',
            'capacity' => '2 adults',
            'ac' => true,
            'view' => 'Garden',
            'emoji' => '🏠',
            'price' => $price,
            'emp_price' => $employeePrice,
        ]);
    }

    private function bookingPayload(): array
    {
        return [
            'guest_name' => 'Test Guest',
            'email' => 'guest@example.com',
            'phone' => '0771111111',
            'nic' => '199111111111',
            'employee_id' => null,
            'unit_number' => 'Room A – Deluxe',
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(12)->toDateString(),
            'adults' => 2,
            'children' => 0,
            'amount' => 1,
            'notes' => null,
            'permanent_address' => 'Colombo, Sri Lanka',
            'occupation' => 'Engineer',
            'gov_letter' => null,
            'is_cma_employee' => false,
            'family_count' => 0,
            'family_members' => [],
        ];
    }
}
