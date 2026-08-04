<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no',
        'user_id',
        'guest_name',
        'email',
        'phone',
        'nic',
        'employee_id',
        'unit_number',
        'room_ids',
        'room_details',
        'check_in',
        'check_out',
        'adults',
        'children',
        'status',
        'payment_status',
        'approved_at',
        'approved_by',
        'amount',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'notes',
        'permanent_address',
        'occupation',
        'gov_letter',
        'is_cma_employee',
        'family_count',
        'family_members',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'room_ids' => 'array',
        'room_details' => 'array',
        'is_cma_employee' => 'boolean',
        'family_count' => 'integer',
        'family_members' => 'array',
        'approved_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(function (Booking $booking): void {
            if (! $booking->reference_no) {
                $booking->forceFill([
                    'reference_no' => self::referenceForId($booking->id),
                ])->saveQuietly();
            }
        });
    }

    public static function referenceForId(int $id): string
    {
        return 'KTGB'.str_pad((string) $id, 6, '0', STR_PAD_LEFT);
    }

    public static function hasConfirmedDateConflict(
        string $checkIn,
        string $checkOut,
        array $roomIds = [],
        ?int $ignoreId = null,
    ): bool
    {
        $newStart = Carbon::parse($checkIn)->startOfDay();
        $newEnd = Carbon::parse($checkOut)->startOfDay();
        $newLastOccupied = $newStart->equalTo($newEnd) ? $newStart : $newEnd->copy()->subDay();

        return self::query()
            ->where('status', 'Confirmed')
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->get(['id', 'unit_number', 'room_ids', 'check_in', 'check_out'])
            ->contains(function (Booking $booking) use ($newStart, $newLastOccupied, $roomIds): bool {
                $existingStart = Carbon::parse($booking->check_in)->startOfDay();
                $existingEnd = Carbon::parse($booking->check_out)->startOfDay();
                $existingLastOccupied = $existingStart->equalTo($existingEnd)
                    ? $existingStart
                    : $existingEnd->copy()->subDay();

                $datesOverlap = $newStart->lessThanOrEqualTo($existingLastOccupied)
                    && $existingStart->lessThanOrEqualTo($newLastOccupied);
                if (! $datesOverlap) return false;

                $existingRoomIds = $booking->reservedRoomIds();
                if ($roomIds === [] || $existingRoomIds === []) return true;

                return count(array_intersect(array_map('intval', $roomIds), $existingRoomIds)) > 0;
            });
    }

    public function reservedRoomIds(): array
    {
        if (is_array($this->room_ids) && $this->room_ids !== []) {
            return array_values(array_unique(array_map('intval', $this->room_ids)));
        }

        $roomId = BungalowRoom::where('name', $this->unit_number)->value('id');
        return $roomId ? [(int) $roomId] : [];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
