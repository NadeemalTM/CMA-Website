<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use Illuminate\Http\Request;

class ApplicationFormController extends Controller
{
    public function index()
    {
        return response()->json(['data' => ApplicationForm::orderBy('order')->orderByDesc('id')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_si' => 'nullable|string|max:255',
            'title_ta' => 'nullable|string|max:255',
            'file_path' => 'required|string',
            'file_type' => 'nullable|string',
            'file_size' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $form = ApplicationForm::create($validated);
        return response()->json(['data' => $form], 201);
    }

    public function update(Request $request, $id)
    {
        $form = ApplicationForm::findOrFail($id);
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_si' => 'nullable|string|max:255',
            'title_ta' => 'nullable|string|max:255',
            'file_path' => 'required|string',
            'file_type' => 'nullable|string',
            'file_size' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $form->update($validated);
        return response()->json(['data' => $form]);
    }

    public function destroy($id)
    {
        ApplicationForm::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
