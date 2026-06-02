<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index() { return response()->json(['data' => Document::orderByDesc('year')->get()]); }
    public function store(Request $request) { return response()->json(['data' => Document::create($request->all())], 201); }
    public function show($id) { return response()->json(['data' => Document::findOrFail($id)]); }
    public function update(Request $request, $id) { $d = Document::findOrFail($id); $d->update($request->all()); return response()->json(['data' => $d]); }
    public function destroy($id) { Document::findOrFail($id)->delete(); return response()->json(null, 204); }
}
