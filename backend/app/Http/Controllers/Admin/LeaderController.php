<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Leader;
use Illuminate\Http\Request;

class LeaderController extends Controller
{
    public function index() { 
        $data = Leader::orderBy('order')->get()->map(function($l) {
            $l->name = $l->name_en;
            return $l;
        });
        return response()->json(['data' => $data]); 
    }
    public function store(Request $request) {
        $data = $request->all();
        if (isset($data['name'])) {
            $data['name_en'] = $data['name'];
        }
        $validated = validator($data, [
            'name_en'=>'required|string','name_si'=>'nullable|string','name_ta'=>'nullable|string',
            'position_en'=>'nullable|string','position_si'=>'nullable|string','position_ta'=>'nullable|string',
            'bio_en'=>'nullable|string','bio_si'=>'nullable|string','bio_ta'=>'nullable|string',
            'photo'=>'nullable|string','email'=>'nullable|email','phone'=>'nullable|string',
            'section_type'=>'required|in:leadership,board',
            'order'=>'integer','is_active'=>'boolean',
        ])->validate();
        
        $leader = Leader::create($validated);
        $leader->name = $leader->name_en;
        return response()->json(['data' => $leader], 201);
    }
    public function show($id) { 
        $l = Leader::findOrFail($id); 
        $l->name = $l->name_en; 
        return response()->json(['data' => $l]); 
    }
    public function update(Request $request, $id) { 
        $l = Leader::findOrFail($id); 
        $data = $request->all();
        if (isset($data['name'])) {
            $data['name_en'] = $data['name'];
        }
        $validated = validator($data, [
            'name_en'=>'required|string','name_si'=>'nullable|string','name_ta'=>'nullable|string',
            'position_en'=>'nullable|string','position_si'=>'nullable|string','position_ta'=>'nullable|string',
            'bio_en'=>'nullable|string','bio_si'=>'nullable|string','bio_ta'=>'nullable|string',
            'photo'=>'nullable|string','email'=>'nullable|email','phone'=>'nullable|string',
            'section_type'=>'required|in:leadership,board',
            'order'=>'integer','is_active'=>'boolean',
        ])->validate();
        $l->update($validated); 
        $l->name = $l->name_en;
        return response()->json(['data' => $l]); 
    }
    public function destroy($id) { Leader::findOrFail($id)->delete(); return response()->json(null, 204); }
}
