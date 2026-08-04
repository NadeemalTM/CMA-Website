<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index() { return response()->json(['data' => Project::orderByDesc('created_at')->get()]); }
    public function store(Request $request) { 
        $data = $request->all();
        if (isset($data['start_date']) && empty($data['start_date'])) $data['start_date'] = null;
        if (isset($data['end_date']) && empty($data['end_date'])) $data['end_date'] = null;
        return response()->json(['data' => Project::create($data)], 201); 
    }
    public function show($id) { return response()->json(['data' => Project::findOrFail($id)]); }
    public function update(Request $request, $id) { 
        $p = Project::findOrFail($id); 
        $data = $request->all();
        if (isset($data['start_date']) && empty($data['start_date'])) $data['start_date'] = null;
        if (isset($data['end_date']) && empty($data['end_date'])) $data['end_date'] = null;
        $p->update($data); 
        return response()->json(['data' => $p]); 
    }
    public function destroy($id) { Project::findOrFail($id)->delete(); return response()->json(null, 204); }
}
