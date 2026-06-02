<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use Illuminate\Http\Request;

class StaffMemberController extends Controller
{
    public function index()
    {
        return response()->json(['data' => StaffMember::orderBy('order')->get()]);
    }

    public function store(Request $request)
    {
        $staff = StaffMember::create($request->validate([
            'name' => 'required|string',
            'title_en' => 'required|string',
            'title_si' => 'nullable|string',
            'title_ta' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'department_en' => 'required|string',
            'department_si' => 'nullable|string',
            'department_ta' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]));
        return response()->json(['data' => $staff], 201);
    }

    public function show($id)
    {
        return response()->json(['data' => StaffMember::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $staff = StaffMember::findOrFail($id);
        $staff->update($request->validate([
            'name' => 'required|string',
            'title_en' => 'required|string',
            'title_si' => 'nullable|string',
            'title_ta' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'department_en' => 'required|string',
            'department_si' => 'nullable|string',
            'department_ta' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]));
        return response()->json(['data' => $staff]);
    }

    public function destroy($id)
    {
        StaffMember::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
