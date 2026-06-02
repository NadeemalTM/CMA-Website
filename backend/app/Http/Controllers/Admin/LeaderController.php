<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Leader;
use Illuminate\Http\Request;

class LeaderController extends Controller
{
    public function index() { return response()->json(['data' => Leader::orderBy('order')->get()]); }
    public function store(Request $request) {
        $leader = Leader::create($request->validate([
            'name'=>'required|string','position_en'=>'required|string','position_si'=>'nullable|string','position_ta'=>'nullable|string',
            'bio_en'=>'nullable|string','bio_si'=>'nullable|string','bio_ta'=>'nullable|string',
            'photo'=>'nullable|string','email'=>'nullable|email','phone'=>'nullable|string',
            'order'=>'integer','is_active'=>'boolean',
        ]));
        return response()->json(['data' => $leader], 201);
    }
    public function show($id) { return response()->json(['data' => Leader::findOrFail($id)]); }
    public function update(Request $request, $id) { $l = Leader::findOrFail($id); $l->update($request->all()); return response()->json(['data' => $l]); }
    public function destroy($id) { Leader::findOrFail($id)->delete(); return response()->json(null, 204); }
}
