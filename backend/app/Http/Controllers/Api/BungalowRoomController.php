<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BungalowRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BungalowRoomController extends Controller
{
    /**
     * Public list of bungalow rooms (seeds default rooms if database is empty)
     */
    public function index()
    {
        if (BungalowRoom::count() === 0) {
            $this->seedDefaultRooms();
        }

        $rooms = BungalowRoom::orderBy('price')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'name' => $r->name,
                'beds' => $r->beds,
                'capacity' => $r->capacity,
                'ac' => (bool)$r->ac,
                'view' => $r->view,
                'emoji' => $r->emoji,
                'price' => (float)$r->price,
                'empPrice' => (float)$r->emp_price,
                'image' => $r->image ? asset('storage/' . $r->image) : null,
                'image_path' => $r->image
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $rooms
        ]);
    }

    /**
     * Admin list (returns original values)
     */
    public function adminIndex()
    {
        if (BungalowRoom::count() === 0) {
            $this->seedDefaultRooms();
        }

        return response()->json([
            'status' => 'success',
            'data' => BungalowRoom::orderBy('price')->get()
        ]);
    }

    /**
     * Create a new room
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'capacity' => 'required|string|max:255',
            'ac' => 'required|boolean',
            'view' => 'required|string|max:255',
            'emoji' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'emp_price' => 'required|numeric|min:0',
            'image' => 'nullable|string'
        ]);

        $room = BungalowRoom::create($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $room,
            'message' => 'Bungalow room created successfully.'
        ], 201);
    }

    /**
     * Update room details
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'capacity' => 'required|string|max:255',
            'ac' => 'required|boolean',
            'view' => 'required|string|max:255',
            'emoji' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'emp_price' => 'required|numeric|min:0',
            'image' => 'nullable|string'
        ]);

        $room = BungalowRoom::findOrFail($id);
        $room->update($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $room,
            'message' => 'Bungalow room details updated successfully.'
        ]);
    }

    /**
     * Delete a room
     */
    public function destroy($id)
    {
        $room = BungalowRoom::findOrFail($id);
        if ($room->image) {
            Storage::disk('public')->delete($room->image);
        }
        $room->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Bungalow room deleted successfully.'
        ]);
    }

    /**
     * Seed initial default rooms
     */
    private function seedDefaultRooms()
    {
        BungalowRoom::create([
            'name' => 'Room A – Deluxe',
            'beds' => '1 King Bed',
            'capacity' => '2 Adults',
            'ac' => true,
            'view' => 'Garden View',
            'emoji' => '🛏️',
            'price' => 6000,
            'emp_price' => 4800,
            'image' => null
        ]);

        BungalowRoom::create([
            'name' => 'Room B – Standard',
            'beds' => '1 Queen Bed',
            'capacity' => '2 Adults',
            'ac' => true,
            'view' => 'Courtyard View',
            'emoji' => '🛏️',
            'price' => 5000,
            'emp_price' => 4000,
            'image' => null
        ]);

        BungalowRoom::create([
            'name' => 'Room C – Suite',
            'beds' => '1 King Bed + 1 Sofa Bed',
            'capacity' => '3 Adults',
            'ac' => true,
            'view' => 'Panoramic View',
            'emoji' => '🛋️',
            'price' => 7500,
            'emp_price' => 6000,
            'image' => null
        ]);

        BungalowRoom::create([
            'name' => 'Room D – Budget',
            'beds' => '2 Single Beds',
            'capacity' => '2 Adults',
            'ac' => false,
            'view' => 'No View',
            'emoji' => '🛏️',
            'price' => 4500,
            'emp_price' => 3600,
            'image' => null
        ]);
    }
}
