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
}
