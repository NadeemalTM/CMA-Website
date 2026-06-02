<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index() { return response()->json(Application::orderByDesc('created_at')->paginate(20)); }
    public function show($id) { return response()->json(['data' => Application::findOrFail($id)]); }
    public function updateStatus(Request $request, $id) {
        $app = Application::findOrFail($id);
        $app->update(['status' => $request->status, 'remarks' => $request->remarks]);
        return response()->json(['data' => $app]);
    }
}
