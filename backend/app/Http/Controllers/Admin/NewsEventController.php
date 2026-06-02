<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsEventController extends Controller
{
    public function index() { return response()->json(['data' => NewsEvent::orderByDesc('created_at')->get()]); }
    public function store(Request $request) {
        $data = $request->all();
        if (empty($data['slug'])) $data['slug'] = Str::slug($data['title_en'] ?? '') . '-' . time();
        return response()->json(['data' => NewsEvent::create($data)], 201);
    }
    public function show($id) { return response()->json(['data' => NewsEvent::findOrFail($id)]); }
    public function update(Request $request, $id) { $n = NewsEvent::findOrFail($id); $n->update($request->all()); return response()->json(['data' => $n]); }
    public function destroy($id) { NewsEvent::findOrFail($id)->delete(); return response()->json(null, 204); }
}
