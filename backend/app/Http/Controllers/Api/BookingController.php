<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BungalowBookingSetting;
use App\Models\BungalowRoom;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /** Return aggregate and per-room availability for the next six months. */
    public function getAvailability(Request $request)
    {
        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->addMonths(6)->endOfMonth();
        $rooms = BungalowRoom::orderBy('id')->get(['id', 'name']);
        $roomIds = $rooms->pluck('id')->map(fn ($id) => (int) $id)->all();

        $bookings = Booking::where('status', 'Confirmed')
            ->where('check_in', '<=', $end->toDateString())
            ->where('check_out', '>=', $start->toDateString())
            ->get();

        $availability = [];
        $roomAvailability = [];
        foreach ($roomIds as $roomId) $roomAvailability[$roomId] = [];

        foreach (CarbonPeriod::create($start, $end) as $date) {
            $dateString = $date->toDateString();
            $bookedRoomIds = [];

            foreach ($bookings as $booking) {
                $checkIn = Carbon::parse($booking->check_in)->startOfDay();
                $checkOut = Carbon::parse($booking->check_out)->startOfDay();
                $lastOccupied = $checkIn->equalTo($checkOut) ? $checkIn : $checkOut->copy()->subDay();

                if ($date->greaterThanOrEqualTo($checkIn) && $date->lessThanOrEqualTo($lastOccupied)) {
                    $bookedRoomIds = array_merge($bookedRoomIds, $booking->reservedRoomIds());
                }
            }

            $bookedRoomIds = array_values(array_unique(array_map('intval', $bookedRoomIds)));
            $bookedCount = count(array_intersect($roomIds, $bookedRoomIds));
            $availability[$dateString] = match (true) {
                $bookedCount === 0 => 'available',
                $bookedCount >= count($roomIds) && count($roomIds) > 0 => 'booked',
                default => 'partial',
            };

            foreach ($roomIds as $roomId) {
                $roomAvailability[$roomId][$dateString] = in_array($roomId, $bookedRoomIds, true)
                    ? 'booked'
                    : 'available';
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $availability,
            'rooms' => $roomAvailability,
            'room_names' => $rooms->pluck('name', 'id'),
            'total_rooms' => count($roomIds),
        ]);
    }

    private function ensureSettingsSchema(): void
    {
        try {
            if (Schema::hasTable('bungalow_booking_settings')) {
                if (!Schema::hasColumn('bungalow_booking_settings', 'payment_guideline_pdf')) {
                    Schema::table('bungalow_booking_settings', function (Blueprint $table) {
                        $table->string('payment_guideline_pdf')->nullable()->after('reference_banner_alt');
                    });
                }
                if (!Schema::hasColumn('bungalow_booking_settings', 'payment_guideline_title')) {
                    Schema::table('bungalow_booking_settings', function (Blueprint $table) {
                        $table->string('payment_guideline_title')->nullable()->after('payment_guideline_pdf');
                    });
                }
            }
        } catch (\Throwable $e) {}
    }

    public function settings()
    {
        $this->ensureSettingsSchema();
        $settings = BungalowBookingSetting::current();

        return response()->json([
            'status' => 'success',
            'data' => [
                'tax_rate' => (float) $settings->tax_rate,
                'reference_banner' => $settings->reference_banner
                    ? (str_starts_with($settings->reference_banner, 'http')
                        ? $settings->reference_banner
                        : asset('storage/' . $settings->reference_banner))
                    : null,
                'reference_banner_path' => $settings->reference_banner,
                'reference_banner_alt' => $settings->reference_banner_alt,
                'payment_guideline_pdf' => $settings->payment_guideline_pdf
                    ? (str_starts_with($settings->payment_guideline_pdf, 'http')
                        ? $settings->payment_guideline_pdf
                        : asset('storage/' . $settings->payment_guideline_pdf))
                    : null,
                'payment_guideline_pdf_path' => $settings->payment_guideline_pdf,
                'payment_guideline_title' => $settings->payment_guideline_title ?: 'Payment Guidelines & Bank Instructions',
            ],
        ]);
    }

    /** Allow guest applicants to attach an employment letter without signing in. */
    public function uploadSupportingDocument(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ]);

        $file = $request->file('file');
        $filename = Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
        $destination = storage_path('app/public/booking-documents');
        if (! is_dir($destination)) mkdir($destination, 0755, true);
        $file->move($destination, $filename);
        $path = 'booking-documents/' . $filename;

        return response()->json(['path' => $path, 'url' => asset('storage/' . $path)]);
    }

    /** Create one pending booking containing one or more rooms. */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guest_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'nic' => 'required|string|max:50',
            'employee_id' => 'nullable|string|max:50',
            'room_ids' => 'required_without:unit_number|array|min:1|max:20',
            'room_ids.*' => 'integer|distinct|exists:bungalow_rooms,id',
            'unit_number' => 'nullable|required_without:room_ids|string|max:255',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after_or_equal:check_in',
            'adults' => 'required|integer|min:1|max:50',
            'children' => 'required|integer|min:0|max:50',
            'notes' => 'nullable|string|max:2000',
            'permanent_address' => 'required|string|max:500',
            'occupation' => 'required|string|max:255',
            'gov_letter' => 'nullable|string|max:255',
            'is_cma_employee' => 'required|boolean',
            'family_count' => 'required|integer|min:0|max:50',
            'family_members' => 'nullable|array|max:50',
        ]);

        $validator->after(function ($validator) use ($request): void {
            if ($request->boolean('is_cma_employee') && ! $request->filled('employee_id')) {
                $validator->errors()->add('employee_id', 'The employee ID is required for the staff rate.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => $validator->errors()->first()], 422);
        }

        $checkIn = Carbon::parse($request->check_in)->toDateTimeString();
        $checkOut = Carbon::parse($request->check_out)->toDateTimeString();
        $newIn = Carbon::parse($checkIn);
        $newOut = Carbon::parse($checkOut);

        $selectedRoomIds = collect($request->input('room_ids', []))->map(fn ($id) => (int) $id)->unique()->values();
        if ($selectedRoomIds->isEmpty() && $request->unit_number) {
            $legacyRoom = BungalowRoom::where('name', $request->unit_number)->first();
            if ($legacyRoom) $selectedRoomIds = collect([(int) $legacyRoom->id]);
        }

        $selectedRooms = BungalowRoom::whereIn('id', $selectedRoomIds)->orderBy('id')->get();
        if ($selectedRooms->isEmpty() || $selectedRooms->count() !== $selectedRoomIds->count()) {
            return response()->json(['message' => 'One or more selected rooms are no longer available.'], 422);
        }

        if (Booking::hasConfirmedDateConflict($checkIn, $checkOut, $selectedRoomIds->all())) {
            return response()->json([
                'message' => 'One or more selected rooms are already booked for these dates. Please review each room calendar.',
            ], 409);
        }

        $nights = max(1, (int) $newIn->copy()->startOfDay()->diffInDays($newOut->copy()->startOfDay()));
        $roomDetails = $selectedRooms->map(function (BungalowRoom $room) use ($request, $nights): array {
            $rate = (float) ($request->boolean('is_cma_employee') ? $room->emp_price : $room->price);
            $additionalCharge = (float) ($room->additional_charge ?? 0);
            $sstRate = (float) ($room->sst_rate ?? 2.25);
            $vatRate = (float) ($room->vat_rate ?? 18.00);

            $roomSubtotal = round($rate * $nights, 2);
            $sstAmount = round($roomSubtotal * ($sstRate / 100), 2);
            $vatAmount = round(($roomSubtotal + $sstAmount) * ($vatRate / 100), 2);
            $roomTax = round($sstAmount + $vatAmount, 2);

            return [
                'id' => $room->id,
                'name' => $room->name,
                'rate' => $rate,
                'nights' => $nights,
                'subtotal' => $roomSubtotal,
                'sst_rate' => $sstRate,
                'sst_amount' => $sstAmount,
                'vat_rate' => $vatRate,
                'vat_amount' => $vatAmount,
                'tax_amount' => $roomTax,
                'additional_charge' => $additionalCharge,
                'additional_charge_label' => $room->additional_charge_label,
                'additional_charge_total' => round($additionalCharge, 2),
            ];
        })->values();
        $subtotal = round((float) $roomDetails->sum('subtotal'), 2);
        $taxAmount = round((float) $roomDetails->sum('tax_amount'), 2);
        $additionalChargesTotal = round((float) $roomDetails->sum('additional_charge_total'), 2);
        $amount = round($subtotal + $taxAmount + $additionalChargesTotal, 2);

        $booking = Booking::create([
            'user_id' => $request->user()?->id,
            'guest_name' => $request->guest_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nic' => $request->nic,
            'employee_id' => $request->employee_id,
            'unit_number' => $selectedRooms->pluck('name')->join(', '),
            'room_ids' => $selectedRoomIds->all(),
            'room_details' => $roomDetails->all(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'adults' => $request->adults,
            'children' => $request->children,
            'subtotal' => $subtotal,
            'tax_rate' => 0,
            'tax_amount' => $taxAmount,
            'amount' => $amount,
            'notes' => $request->notes,
            'status' => 'Pending',
            'payment_status' => 'Pending',
            'permanent_address' => $request->permanent_address,
            'occupation' => $request->occupation,
            'gov_letter' => $request->gov_letter,
            'is_cma_employee' => $request->boolean('is_cma_employee'),
            'family_count' => $request->family_count,
            'family_members' => $request->family_members,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Your multi-room booking request is pending payment and administrator approval.',
        ], 201);
    }

    /** Check a booking without exposing private guest information. */
    public function status(Request $request)
    {
        $data = $request->validate([
            'reference_no' => ['required', 'string', 'regex:/^KTGB\d{6}$/i'],
            'phone' => 'required|string|max:20',
        ]);

        $booking = Booking::where('reference_no', strtoupper($data['reference_no']))
            ->where('phone', $data['phone'])
            ->first();

        if (! $booking) {
            return response()->json(['message' => 'No booking was found for that reference number and phone number.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'reference_no' => $booking->reference_no,
                'booking_status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'unit_number' => $booking->unit_number,
                'room_ids' => $booking->reservedRoomIds(),
                'room_details' => $booking->room_details,
                'check_in' => $booking->check_in->toDateString(),
                'check_out' => $booking->check_out->toDateString(),
                'subtotal' => $booking->subtotal,
                'tax_rate' => $booking->tax_rate,
                'tax_amount' => $booking->tax_amount,
                'amount' => $booking->amount,
                'message' => match ($booking->status) {
                    'Confirmed' => 'Booking successful. Your reservation has been approved.',
                    'Cancelled' => 'This booking request was not approved. Please contact CMA for assistance.',
                    'Done' => 'This approved stay has been completed.',
                    default => 'Payment and administrator approval are pending.',
                },
            ],
        ]);
    }

    public function history(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => Booking::where('user_id', $request->user()->id)->orderByDesc('created_at')->get(),
        ]);
    }
}
