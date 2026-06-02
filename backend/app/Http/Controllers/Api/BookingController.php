<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class BookingController extends Controller
{
    /**
     * Get availability states for each date in a range
     */
    public function getAvailability(Request $request)
    {
        // Default to a 6-month window from the start of the current month
        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->addMonths(6)->endOfMonth();

        // Get all active (not cancelled) bookings that overlap with this range
        $bookings = Booking::where('status', '!=', 'Cancelled')
            ->where('check_in', '<=', $end->toDateString())
            ->where('check_out', '>=', $start->toDateString())
            ->get();

        $availability = [];
        $totalRooms = 4;

        // Generate date periods
        $period = CarbonPeriod::create($start, $end);
        foreach ($period as $date) {
            $dateString = $date->toDateString();
            $bookedCount = 0;

            foreach ($bookings as $b) {
                $checkIn = Carbon::parse($b->check_in);
                $checkOut = Carbon::parse($b->check_out);

                // A date is occupied if it lies within [check_in, check_out - 1]
                if ($date->greaterThanOrEqualTo($checkIn) && $date->lessThan($checkOut)) {
                    $bookedCount++;
                }
            }

            if ($bookedCount >= $totalRooms) {
                $availability[$dateString] = 'booked';
            } elseif ($bookedCount > 0) {
                $availability[$dateString] = 'partial';
            } else {
                $availability[$dateString] = 'available';
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $availability
        ]);
    }

    /**
     * Store a new booking submission
     */
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'guest_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'nic' => 'required|string|max:50',
            'employee_id' => 'nullable|string|max:50',
            'unit_number' => 'required|string|max:100',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'adults' => 'required|integer|min:1|max:4',
            'children' => 'required|integer|min:0|max:3',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'permanent_address' => 'required|string|max:500',
            'occupation' => 'required|string|max:255',
            'gov_letter' => 'nullable|string|max:255',
            'is_cma_employee' => 'required|boolean',
            'family_count' => 'required|integer|min:0',
            'family_members' => 'nullable|array',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $checkIn = Carbon::parse($request->check_in)->toDateString();
        $checkOut = Carbon::parse($request->check_out)->toDateString();
        $room = $request->unit_number;

        // Double check conflict: does this specific room have an active overlapping booking?
        $conflict = Booking::where('unit_number', $room)
            ->where('status', '!=', 'Cancelled')
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->where(function ($sub) use ($checkIn, $checkOut) {
                    $sub->where('check_in', '<', $checkOut)
                        ->where('check_out', '>', $checkIn);
                });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'The selected room is already reserved for the chosen dates. Please select different dates or rooms.'
            ], 409);
        }

        // Save the booking
        $booking = Booking::create([
            'user_id' => $request->user()?->id,
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
            'status' => 'Pending',
            'permanent_address' => $request->permanent_address,
            'occupation' => $request->occupation,
            'gov_letter' => $request->gov_letter,
            'is_cma_employee' => $request->is_cma_employee,
            'family_count' => $request->family_count,
            'family_members' => $request->family_members,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
            'message' => 'Your booking reservation has been submitted successfully.'
        ], 201);
    }

    /**
     * Get reservation history for the logged-in citizen
     */
    public function history(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $bookings
        ]);
    }
}
