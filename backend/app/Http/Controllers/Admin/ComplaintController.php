<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index() { return response()->json(Complaint::orderByDesc('created_at')->paginate(20)); }
    public function show($id) { return response()->json(['data' => Complaint::findOrFail($id)]); }
    public function reply(Request $request, $id) {
        $c = Complaint::findOrFail($id);
        $c->update([
            'reply' => $request->reply,
            'status' => $request->status ?? 'resolved',
            'replied_at' => now()
        ]);
        return response()->json(['data' => $c]);
    }

    public function destroy($id)
    {
        $c = Complaint::findOrFail($id);
        $c->update(['status' => 'removed']);
        return response()->json(['message' => 'Complaint marked as removed.']);
    }
}
