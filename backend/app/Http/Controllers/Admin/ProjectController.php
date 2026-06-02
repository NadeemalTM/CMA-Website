<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index() { return response()->json(['data' => Project::orderByDesc('created_at')->get()]); }
    public function store(Request $request) { return response()->json(['data' => Project::create($request->all())], 201); }
    public function show($id) { return response()->json(['data' => Project::findOrFail($id)]); }
    public function update(Request $request, $id) { $p = Project::findOrFail($id); $p->update($request->all()); return response()->json(['data' => $p]); }
    public function destroy($id) { Project::findOrFail($id)->delete(); return response()->json(null, 204); }
}
