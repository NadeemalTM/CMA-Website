<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    public function index() { return response()->json(['data' => HeroSlide::orderBy('order')->get()]); }
    public function store(Request $request) {
        $slide = HeroSlide::create($request->validate([
            'title_en'=>'required|string','title_si'=>'nullable|string','title_ta'=>'nullable|string',
            'subtitle_en'=>'nullable|string','subtitle_si'=>'nullable|string','subtitle_ta'=>'nullable|string',
            'description_en'=>'nullable|string','description_si'=>'nullable|string','description_ta'=>'nullable|string',
            'image'=>'nullable|string','button_text_en'=>'nullable|string','button_text_si'=>'nullable|string','button_text_ta'=>'nullable|string',
            'button_link'=>'nullable|string','order'=>'integer','is_active'=>'boolean',
        ]));
        return response()->json(['data' => $slide], 201);
    }
    public function show($id) { return response()->json(['data' => HeroSlide::findOrFail($id)]); }
    public function update(Request $request, $id) {
        $slide = HeroSlide::findOrFail($id);
        $slide->update($request->all());
        return response()->json(['data' => $slide]);
    }
    public function destroy($id) { HeroSlide::findOrFail($id)->delete(); return response()->json(null, 204); }
}
