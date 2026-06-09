<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingAdminController extends Controller
{
    /**
     * Get bookings listing and aggregations for admin
     */
    public function index(Request $request)
    {
        $query = Booking::orderByDesc('created_at');

        // Apply room and status filters if provided
        if ($request->status && $request->status !== 'All Status') {
            $query->where('status', $request->status);
        }
        if ($request->room && $request->room !== 'All Rooms') {
            $query->where('unit_number', $request->room);
        }

        $bookings = $query->get();

        // Calculate count metrics
        $allBookings = Booking::all();
        $stats = [
            'total' => $allBookings->count(),
            'confirmed' => $allBookings->where('status', 'Confirmed')->count(),
            'pending' => $allBookings->where('status', 'Pending')->count(),
            'done' => $allBookings->where('status', 'Done')->count(),
            'cancelled' => $allBookings->where('status', 'Cancelled')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
            'stats' => $stats
        ]);
    }

    /**
     * Update booking status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Done,Cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->status = $request->status;
        $booking->save();

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Booking status has been updated successfully.'
        ]);
    }

    /**
     * Store a new manual booking / block by admin
     */
    public function store(Request $request)
    {
        $v = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'guest_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'nic' => 'required|string|max:50',
            'employee_id' => 'nullable|string|max:50',
            'unit_number' => 'required|string|max:100',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after_or_equal:check_in',
            'adults' => 'required|integer|min:0|max:20',
            'children' => 'required|integer|min:0|max:20',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'permanent_address' => 'required|string|max:500',
            'occupation' => 'required|string|max:255',
            'is_cma_employee' => 'required|boolean',
            'status' => 'required|in:Pending,Confirmed,Done,Cancelled',
        ]);

        if ($v->fails()) {
            \Illuminate\Support\Facades\Log::error('Manual booking validation failed: ' . json_encode($v->errors()->toArray()));
            return response()->json(['errors' => $v->errors()], 422);
        }

        $checkIn = \Carbon\Carbon::parse($request->check_in)->toDateTimeString();
        $checkOut = \Carbon\Carbon::parse($request->check_out)->toDateTimeString();
        $room = $request->unit_number;

        // Double check conflict: does this specific room have an active overlapping booking?
        $bookings = Booking::where('unit_number', $room)
            ->where('status', '!=', 'Cancelled')
            ->get();

        $newIn = \Carbon\Carbon::parse($checkIn);
        $newOut = \Carbon\Carbon::parse($checkOut);

        $conflict = false;
        foreach ($bookings as $b) {
            $bIn = \Carbon\Carbon::parse($b->check_in);
            $bOut = \Carbon\Carbon::parse($b->check_out);

            // Time interval overlap: start1 < end2 && start2 < end1
            if ($newIn->lessThan($bOut) && $bIn->lessThan($newOut)) {
                $conflict = true;
                break;
            }
        }

        if ($conflict) {
            return response()->json([
                'message' => 'The selected room is already reserved for the chosen dates. Please select different dates or rooms.'
            ], 409);
        }

        $booking = Booking::create([
            'user_id' => null,
            'guest_name' => $request->guest_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'nic' => $request->nic,
            'employee_id' => $request->employee_id,
            'unit_number' => $room,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'adults' => $request->adults,
            'children' => $request->children,
            'amount' => $request->amount,
            'notes' => $request->notes,
            'status' => $request->status,
            'permanent_address' => $request->permanent_address,
            'occupation' => $request->occupation,
            'gov_letter' => null,
            'is_cma_employee' => $request->is_cma_employee,
            'family_count' => 0,
            'family_members' => [],
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Booking created/blocked successfully.'
        ], 201);
    }
}

