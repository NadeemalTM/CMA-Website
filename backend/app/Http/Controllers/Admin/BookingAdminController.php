<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BungalowBookingSetting;
use App\Models\BungalowRoom;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class BookingAdminController extends Controller
{
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

    public function index(Request $request)
    {
        $query = Booking::orderByDesc('created_at');

        if ($request->status && $request->status !== 'All Status') {
            $query->where('status', $request->status);
        }
        if ($request->room && $request->room !== 'All Rooms') {
            $query->where('unit_number', 'like', '%' . $request->room . '%');
        }

        $allBookings = Booking::all();

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
            'stats' => [
                'total' => $allBookings->count(),
                'confirmed' => $allBookings->where('status', 'Confirmed')->count(),
                'pending' => $allBookings->where('status', 'Pending')->count(),
                'done' => $allBookings->where('status', 'Done')->count(),
                'cancelled' => $allBookings->where('status', 'Cancelled')->count(),
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:Pending,Confirmed,Done,Cancelled']);
        $booking = Booking::findOrFail($id);

        if ($request->status === 'Confirmed'
            && Booking::hasConfirmedDateConflict(
                $booking->check_in->toDateString(),
                $booking->check_out->toDateString(),
                $booking->reservedRoomIds(),
                $booking->id,
            )) {
            return response()->json([
                'message' => 'One or more rooms in this request are already occupied by another approved booking.',
            ], 409);
        }

        $booking->status = $request->status;
        $booking->approved_at = $request->status === 'Confirmed' ? now() : null;
        $booking->approved_by = $request->status === 'Confirmed' ? $request->user()->id : null;
        $booking->save();

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Booking status has been updated successfully.',
        ]);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $data = $request->validate(['payment_status' => 'required|in:Pending,Paid,Waived,Refunded']);
        $booking = Booking::findOrFail($id);
        $booking->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Payment status has been updated successfully.',
        ]);
    }

    public function settings()
    {
        $this->ensureSettingsSchema();
        return response()->json(['status' => 'success', 'data' => BungalowBookingSetting::current()]);
    }

    public function updateSettings(Request $request)
    {
        $this->ensureSettingsSchema();

        $data = $request->validate([
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'reference_banner' => 'nullable|string|max:2048',
            'reference_banner_alt' => 'nullable|string|max:255',
            'payment_guideline_pdf' => 'nullable|string|max:2048',
            'payment_guideline_title' => 'nullable|string|max:255',
        ]);
        $data['updated_by'] = $request->user()->id;
        $settings = BungalowBookingSetting::current();
        $settings->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $settings->fresh(),
            'message' => 'Booking settings and payment guidelines updated successfully.',
        ]);
    }

    /** Create a manual reservation or room-specific maintenance block. */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guest_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'nic' => 'required|string|max:50',
            'employee_id' => 'nullable|string|max:50',
            'room_ids' => 'nullable|array|min:1',
            'room_ids.*' => 'integer|distinct|exists:bungalow_rooms,id',
            'unit_number' => 'nullable|string|max:255',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after_or_equal:check_in',
            'adults' => 'required|integer|min:0|max:50',
            'children' => 'required|integer|min:0|max:50',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'permanent_address' => 'required|string|max:500',
            'occupation' => 'required|string|max:255',
            'is_cma_employee' => 'required|boolean',
            'status' => 'required|in:Pending,Confirmed,Done,Cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => $validator->errors()->first()], 422);
        }

        $checkIn = Carbon::parse($request->check_in)->toDateTimeString();
        $checkOut = Carbon::parse($request->check_out)->toDateTimeString();
        $selectedRoomIds = collect($request->input('room_ids', []))->map(fn ($id) => (int) $id)->unique()->values();

        if ($selectedRoomIds->isEmpty() && $request->unit_number) {
            $legacyRoom = BungalowRoom::where('name', $request->unit_number)->first();
            if ($legacyRoom) $selectedRoomIds = collect([(int) $legacyRoom->id]);
        }

        $selectedRooms = BungalowRoom::whereIn('id', $selectedRoomIds)->orderBy('id')->get();
        if ($selectedRooms->isEmpty() || $selectedRooms->count() !== $selectedRoomIds->count()) {
            return response()->json(['message' => 'Select at least one valid room.'], 422);
        }

        if ($request->status === 'Confirmed'
            && Booking::hasConfirmedDateConflict($checkIn, $checkOut, $selectedRoomIds->all())) {
            return response()->json(['message' => 'One or more selected rooms are already occupied for these dates.'], 409);
        }

        $subtotal = round((float) $request->amount, 2);
        $taxAmount = round((float) $selectedRooms->sum(function (BungalowRoom $room) use ($subtotal) {
            $sst = $subtotal * (($room->sst_rate ?? 2.25) / 100);
            $vat = ($subtotal + $sst) * (($room->vat_rate ?? 18.00) / 100);
            return $sst + $vat;
        }), 2);
        $additionalChargesTotal = round((float) $selectedRooms->sum('additional_charge'), 2);

        $booking = Booking::create([
            'user_id' => null,
            'guest_name' => $request->guest_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nic' => $request->nic,
            'employee_id' => $request->employee_id,
            'unit_number' => $selectedRooms->pluck('name')->join(', '),
            'room_ids' => $selectedRoomIds->all(),
            'room_details' => $selectedRooms->map(fn (BungalowRoom $room) => [
                'id' => $room->id,
                'name' => $room->name,
                'sst_rate' => (float) ($room->sst_rate ?? 2.25),
                'vat_rate' => (float) ($room->vat_rate ?? 18.00),
                'additional_charge' => (float) ($room->additional_charge ?? 0),
                'additional_charge_label' => $room->additional_charge_label,
            ])->all(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'adults' => $request->adults,
            'children' => $request->children,
            'subtotal' => $subtotal,
            'tax_rate' => 0,
            'tax_amount' => $taxAmount,
            'amount' => round($subtotal + $taxAmount + $additionalChargesTotal, 2),
            'notes' => $request->notes,
            'status' => $request->status,
            'payment_status' => $request->status === 'Confirmed' ? 'Waived' : 'Pending',
            'approved_at' => $request->status === 'Confirmed' ? now() : null,
            'approved_by' => $request->status === 'Confirmed' ? $request->user()->id : null,
            'permanent_address' => $request->permanent_address,
            'occupation' => $request->occupation,
            'gov_letter' => null,
            'is_cma_employee' => $request->boolean('is_cma_employee'),
            'family_count' => 0,
            'family_members' => [],
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Booking created or dates blocked successfully.',
        ], 201);
    }
}
