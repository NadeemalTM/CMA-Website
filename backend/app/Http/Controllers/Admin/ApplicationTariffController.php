<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationTariff;
use Illuminate\Http\Request;

class ApplicationTariffController extends Controller
{
    public function index()
    {
        $tariffs = ApplicationTariff::orderBy('category')->orderBy('order')->orderBy('id')->get();
        return response()->json(['data' => $tariffs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255',
            'description_en' => 'required|string|max:255',
            'fee' => 'required|numeric|min:0',
        ]);

        $tariff = ApplicationTariff::create($request->all());
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
            'fee' => 'sometimes|numeric|min:0',
        ]);

        $applicationTariff->update($request->all());
        return response()->json(['data' => $applicationTariff, 'message' => 'Tariff updated successfully.']);
    }

    public function destroy(ApplicationTariff $applicationTariff)
    {
        $applicationTariff->delete();
        return response()->json(['message' => 'Tariff deleted successfully.']);
    }
}
