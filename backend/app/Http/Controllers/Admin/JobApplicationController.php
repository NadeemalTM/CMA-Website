<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    // Admin index
    public function index()
    {
        return response()->json([
            'data' => JobApplication::with('vacancy:id,title_en')->orderByDesc('created_at')->get()
        ]);
    }

    // Public store
    public function store(Request $request, $vacancyId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'cv' => 'required|file|max:30720',
        ]);

        $file = $request->file('cv');
        $filename = \Illuminate\Support\Str::random(40) . '.' . ($file->getClientOriginalExtension() ?: 'bin');
        $file->move(storage_path('app/public/cvs'), $filename);
        $cvPath = 'cvs/' . $filename;

        $app = JobApplication::create([
            'vacancy_id' => $vacancyId,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'cv_path' => $cvPath,
        ]);

        return response()->json(['message' => 'Application submitted successfully!', 'data' => $app], 201);
    }

    // Admin destroy
    public function destroy($id)
    {
        JobApplication::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
