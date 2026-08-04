<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationTariff;
use Illuminate\Http\Request;

class ApplicationTariffController extends Controller
{
    public function index()
    {
        $tariffs = ApplicationTariff::orderBy('order')->orderBy('id')->get();
        return response()->json(['data' => $tariffs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255',
            'description_en' => 'required|string|max:255',
            'item_no' => 'nullable|string|max:255',
            'scale' => 'nullable|string|max:255',
            'fee' => 'nullable|numeric|min:0',
            'fee_display' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        $data = $request->all();
        if (!isset($data['fee']) || $data['fee'] === '') {
            $data['fee'] = 0.00;
        }

        $tariff = ApplicationTariff::create($data);
        return response()->json(['data' => $tariff, 'message' => 'Tariff created successfully.'], 201);
    }

    public function show(ApplicationTariff $applicationTariff)
    {
        return response()->json(['data' => $applicationTariff]);
    }

    public function update(Request $request, ApplicationTariff $applicationTariff)
    {
        $request->validate([
            'category' => 'sometimes|string|max:255',
            'description_en' => 'sometimes|string|max:255',
            'item_no' => 'nullable|string|max:255',
            'scale' => 'nullable|string|max:255',
            'fee' => 'nullable|numeric|min:0',
            'fee_display' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        $data = $request->all();
        if (array_key_exists('fee', $data) && ($data['fee'] === null || $data['fee'] === '')) {
            $data['fee'] = 0.00;
        }

        $applicationTariff->update($data);
        return response()->json(['data' => $applicationTariff, 'message' => 'Tariff updated successfully.']);
    }

    public function destroy(ApplicationTariff $applicationTariff)
    {
        $applicationTariff->delete();
        return response()->json(['message' => 'Tariff deleted successfully.']);
    }
}
