<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index() { return response()->json(['data' => Vacancy::orderByDesc('created_at')->get()]); }
    
    public function store(Request $request) { 
        $data = $request->except('document');
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
            $file->move(storage_path('app/public/vacancies'), $filename);
            $data['document_path'] = 'vacancies/' . $filename;
        }
        // Handle boolean fields properly since FormData sends strings
        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }
        return response()->json(['data' => Vacancy::create($data)], 201); 
    }
    
    public function show($id) { return response()->json(['data' => Vacancy::findOrFail($id)]); }
    
    public function update(Request $request, $id) { 
        $v = Vacancy::findOrFail($id); 
        $data = $request->except('document');
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
            $file->move(storage_path('app/public/vacancies'), $filename);
            $data['document_path'] = 'vacancies/' . $filename;
        }
        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }
        $v->update($data); 
        return response()->json(['data' => $v]); 
    }
    
    public function destroy($id) { Vacancy::findOrFail($id)->delete(); return response()->json(null, 204); }
}
