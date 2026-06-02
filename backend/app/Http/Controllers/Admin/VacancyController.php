<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index() { return response()->json(['data' => Vacancy::orderByDesc('created_at')->get()]); }
    public function store(Request $request) { return response()->json(['data' => Vacancy::create($request->all())], 201); }
    public function show($id) { return response()->json(['data' => Vacancy::findOrFail($id)]); }
    public function update(Request $request, $id) { $v = Vacancy::findOrFail($id); $v->update($request->all()); return response()->json(['data' => $v]); }
    public function destroy($id) { Vacancy::findOrFail($id)->delete(); return response()->json(null, 204); }
}
