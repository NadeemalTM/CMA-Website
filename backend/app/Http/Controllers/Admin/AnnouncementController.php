<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index() { return response()->json(['data' => Announcement::orderBy('order')->get()]); }
    public function store(Request $request) { return response()->json(['data' => Announcement::create($request->all())], 201); }
    public function show($id) { return response()->json(['data' => Announcement::findOrFail($id)]); }
    public function update(Request $request, $id) { $a = Announcement::findOrFail($id); $a->update($request->all()); return response()->json(['data' => $a]); }
    public function destroy($id) { Announcement::findOrFail($id)->delete(); return response()->json(null, 204); }
}
