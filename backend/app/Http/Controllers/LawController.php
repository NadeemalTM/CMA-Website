<?php

namespace App\Http\Controllers;

use App\Models\Law;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LawController extends Controller
{
    // GET: Fetch all active laws (or all if admin)
    public function index(Request $request)
    {
        $query = Law::query();

        if ($request->boolean('public')) {
            $query->where('is_active', true);
        }

        $laws = $query->orderBy('order', 'asc')->orderBy('id', 'asc')->get();
        return response()->json($laws);
    }

    // POST: Create a new law
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);
        
        $law = new Law();
        $law->title = $validated['title'];
        $law->description = $validated['description'] ?? null;
        $law->order = $validated['order'] ?? 0;
        $law->is_active = $validated['is_active'] ?? true;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
            $file->move(storage_path('app/public/laws'), $filename);
            $law->file_path = 'laws/' . $filename;
        }

        $law->save();
        return response()->json(['message' => 'Law added successfully', 'law' => $law], 201);
    }

    public function update(Request $request, $id)
    {
        $law = Law::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $law->title = $validated['title'];
        $law->description = $validated['description'] ?? null;
        $law->order = $validated['order'] ?? 0;
        
        if (isset($validated['is_active'])) {
            $law->is_active = $validated['is_active'];
        }

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($law->file_path && Storage::disk('public')->exists($law->file_path)) {
                Storage::disk('public')->delete($law->file_path);
            }
            $file = $request->file('file');
            $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
            $file->move(storage_path('app/public/laws'), $filename);
            $path = 'laws/' . $filename;
            $law->file_path = $path;
        }

        $law->save();

        return response()->json(['message' => 'Law updated successfully', 'law' => $law]);
    }

    // DELETE: Remove a law
    public function destroy($id)
    {
        $law = Law::findOrFail($id);

        if ($law->file_path && Storage::disk('public')->exists($law->file_path)) {
            Storage::disk('public')->delete($law->file_path);
        }

        $law->delete();

        return response()->json(['message' => 'Law deleted successfully']);
    }
}
