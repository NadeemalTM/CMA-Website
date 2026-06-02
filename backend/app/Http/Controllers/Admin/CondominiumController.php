<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Condominium;
use Illuminate\Http\Request;

class CondominiumController extends Controller
{
    public function index(Request $request) {
        $query = Condominium::query();
        if ($request->search) $query->where('name','like',"%{$request->search}%")->orWhere('registration_no','like',"%{$request->search}%");
        return response()->json($query->orderBy('name')->paginate(20));
    }
    public function store(Request $request) { return response()->json(['data' => Condominium::create($request->all())], 201); }
    public function show($id) { return response()->json(['data' => Condominium::findOrFail($id)]); }
    public function update(Request $request, $id) { $c = Condominium::findOrFail($id); $c->update($request->all()); return response()->json(['data' => $c]); }
    public function destroy($id) { Condominium::findOrFail($id)->delete(); return response()->json(null, 204); }
}
