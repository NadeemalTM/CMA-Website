<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BungalowRoom;
use App\Models\BungalowHeroImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class BungalowRoomController extends Controller
{
    private const HERO_SLOTS = ['background', 'gallery_1', 'gallery_2', 'gallery_3'];

    private function ensureRoomSchema(): void
    {
        try {
            if (!Schema::hasColumn('bungalow_rooms', 'additional_charge')) {
                Schema::table('bungalow_rooms', function (Blueprint $table) {
                    $table->decimal('additional_charge', 10, 2)->default(0)->after('emp_price');
                    $table->string('additional_charge_label')->nullable()->after('additional_charge');
                });
            }
            if (!Schema::hasColumn('bungalow_rooms', 'sst_rate')) {
                Schema::table('bungalow_rooms', function (Blueprint $table) {
                    $table->decimal('sst_rate', 5, 2)->default(2.25)->after('additional_charge_label');
                    $table->decimal('vat_rate', 5, 2)->default(18.00)->after('sst_rate');
                });
            }
        } catch (\Throwable $e) {
            // Ignore if schema already updated or DDL is constrained
        }
    }

    private function filterPayload(array $data): array
    {
        try {
            $columns = Schema::getColumnListing('bungalow_rooms');
            if (!empty($columns)) {
                return array_intersect_key($data, array_flip($columns));
            }
        } catch (\Throwable $e) {}
        return $data;
    }

    public function heroImages()
    {
        $images = BungalowHeroImage::where('is_active', true)
            ->whereIn('slot', self::HERO_SLOTS)
            ->get()
            ->map(fn ($image) => [
                'slot' => $image->slot,
                'image' => str_starts_with($image->image, 'http')
                    ? $image->image
                    : asset('storage/' . $image->image),
                'alt_text' => $image->alt_text,
            ]);

        return response()->json(['status' => 'success', 'data' => $images]);
    }

    public function adminHeroImages()
    {
        return response()->json([
            'status' => 'success',
            'data' => BungalowHeroImage::whereIn('slot', self::HERO_SLOTS)->get(),
        ]);
    }

    public function updateHeroImage(Request $request, string $slot)
    {
        abort_unless(in_array($slot, self::HERO_SLOTS, true), 404);

        $validated = $request->validate([
            'image' => 'required|string|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $image = BungalowHeroImage::updateOrCreate(['slot' => $slot], $validated);

        return response()->json([
            'status' => 'success',
            'data' => $image,
            'message' => 'Hero image updated successfully.',
        ]);
    }

    /**
     * Public list of bungalow rooms (seeds default rooms if database is empty)
     */
    public function index()
    {
        $this->ensureRoomSchema();

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
                'additional_charge' => (float)($r->additional_charge ?? 0),
                'additional_charge_label' => $r->additional_charge_label,
                'sst_rate' => (float)($r->sst_rate ?? 2.25),
                'vat_rate' => (float)($r->vat_rate ?? 18.00),
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
        $this->ensureRoomSchema();

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
                'emp_price' => (float)$r->emp_price,
                'additional_charge' => (float)($r->additional_charge ?? 0),
                'additional_charge_label' => $r->additional_charge_label,
                'sst_rate' => (float)($r->sst_rate ?? 2.25),
                'vat_rate' => (float)($r->vat_rate ?? 18.00),
                'image' => $r->image,
                'created_at' => $r->created_at,
                'updated_at' => $r->updated_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $rooms
        ]);
    }

    /**
     * Create a new room
     */
    public function store(Request $request)
    {
        $this->ensureRoomSchema();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'capacity' => 'required|string|max:255',
            'ac' => 'required|boolean',
            'view' => 'required|string|max:255',
            'emoji' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'emp_price' => 'required|numeric|min:0',
            'additional_charge' => 'nullable|numeric|min:0',
            'additional_charge_label' => 'nullable|string|max:255',
            'sst_rate' => 'nullable|numeric|min:0|max:100',
            'vat_rate' => 'nullable|numeric|min:0|max:100',
            'image' => 'nullable|string'
        ]);

        if (!isset($validated['sst_rate']) || $validated['sst_rate'] === null) $validated['sst_rate'] = 2.25;
        if (!isset($validated['vat_rate']) || $validated['vat_rate'] === null) $validated['vat_rate'] = 18.00;

        $room = BungalowRoom::create($this->filterPayload($validated));

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
        $this->ensureRoomSchema();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'beds' => 'required|string|max:255',
            'capacity' => 'required|string|max:255',
            'ac' => 'required|boolean',
            'view' => 'required|string|max:255',
            'emoji' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'emp_price' => 'required|numeric|min:0',
            'additional_charge' => 'nullable|numeric|min:0',
            'additional_charge_label' => 'nullable|string|max:255',
            'sst_rate' => 'nullable|numeric|min:0|max:100',
            'vat_rate' => 'nullable|numeric|min:0|max:100',
            'image' => 'nullable|string'
        ]);

        if (!isset($validated['sst_rate']) || $validated['sst_rate'] === null) $validated['sst_rate'] = 2.25;
        if (!isset($validated['vat_rate']) || $validated['vat_rate'] === null) $validated['vat_rate'] = 18.00;

        $room = BungalowRoom::findOrFail($id);
        $room->update($this->filterPayload($validated));

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
