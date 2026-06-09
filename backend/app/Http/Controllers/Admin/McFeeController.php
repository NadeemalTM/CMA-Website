<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\McFee;
use App\Models\McFeeSetting;
use Illuminate\Http\Request;

class McFeeController extends Controller
{
    /**
     * Get active fees listing and current tax settings for public site
     */
    public function index()
    {
        $fees = McFee::where('is_active', true)
            ->orderBy('order')
            ->get();

        $settings = McFeeSetting::first();

        return response()->json([
            'status' => 'success',
            'data' => $fees,
            'settings' => $settings
        ]);
    }

    /**
     * Get active tax configurations (Admin)
     */
    public function getSettings()
    {
        $settings = McFeeSetting::first();

        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    /**
     * Update tax configurations & recalculate all values for existing fees (Admin)
     */
    public function updateSettings(Request $request)
    {
        $v = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'tax1_name' => 'required|string|max:255',
            'tax1_rate' => 'required|numeric|min:0',
            'tax2_name' => 'required|string|max:255',
            'tax2_rate' => 'required|numeric|min:0',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $settings = McFeeSetting::first();
        if (!$settings) {
            $settings = new McFeeSetting();
        }

        $settings->fill([
            'tax1_name' => $request->tax1_name,
            'tax1_rate' => $request->tax1_rate,
            'tax2_name' => $request->tax2_name,
            'tax2_rate' => $request->tax2_rate,
        ])->save();

        // Recalculate ALL values for all fee records
        $fees = McFee::all();
        foreach ($fees as $fee) {
            $nbt = round(floatval($fee->fee) * (floatval($settings->tax1_rate) / 100), 2);
            $vat = round(floatval($fee->fee) * (floatval($settings->tax2_rate) / 100), 2);
            $total = floatval($fee->fee) + $nbt + $vat;

            $fee->update([
                'nbt' => $nbt,
                'vat' => $vat,
                'total' => $total,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'settings' => $settings,
            'message' => 'Tax settings updated and all fee values recalculated successfully.'
        ]);
    }

    /**
     * Store a new fee (Admin)
     */
    public function store(Request $request)
    {
        $v = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'description_en' => 'required|string|max:255',
            'description_si' => 'nullable|string|max:255',
            'description_ta' => 'nullable|string|max:255',
            'category' => 'required|string|in:application,registration',
            'fee' => 'required|numeric|min:0',
            'nbt' => 'nullable|numeric|min:0',
            'vat' => 'nullable|numeric|min:0',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $settings = McFeeSetting::first();
        $feeVal = floatval($request->fee);

        // Calculate values based on current settings unless overridden
        $nbt = $request->filled('nbt') ? floatval($request->nbt) : round($feeVal * (floatval($settings->tax1_rate) / 100), 2);
        $vat = $request->filled('vat') ? floatval($request->vat) : round($feeVal * (floatval($settings->tax2_rate) / 100), 2);
        $total = $feeVal + $nbt + $vat;

        $fee = McFee::create([
            'description_en' => $request->description_en,
            'description_si' => $request->description_si,
            'description_ta' => $request->description_ta,
            'category' => $request->category,
            'fee' => $request->fee,
            'nbt' => $nbt,
            'vat' => $vat,
            'total' => $total,
            'order' => $request->order ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $fee,
            'message' => 'Fee created successfully.'
        ], 201);
    }

    /**
     * Update an existing fee (Admin)
     */
    public function update(Request $request, $id)
    {
        $v = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'description_en' => 'required|string|max:255',
            'description_si' => 'nullable|string|max:255',
            'description_ta' => 'nullable|string|max:255',
            'category' => 'required|string|in:application,registration',
            'fee' => 'required|numeric|min:0',
            'nbt' => 'nullable|numeric|min:0',
            'vat' => 'nullable|numeric|min:0',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $feeObj = McFee::findOrFail($id);
        $settings = McFeeSetting::first();
        $feeVal = floatval($request->fee);

        // Calculate values based on current settings unless overridden
        $nbt = $request->filled('nbt') ? floatval($request->nbt) : round($feeVal * (floatval($settings->tax1_rate) / 100), 2);
        $vat = $request->filled('vat') ? floatval($request->vat) : round($feeVal * (floatval($settings->tax2_rate) / 100), 2);
        $total = $feeVal + $nbt + $vat;

        $feeObj->update([
            'description_en' => $request->description_en,
            'description_si' => $request->description_si,
            'description_ta' => $request->description_ta,
            'category' => $request->category,
            'fee' => $request->fee,
            'nbt' => $nbt,
            'vat' => $vat,
            'total' => $total,
            'order' => $request->order ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $feeObj,
            'message' => 'Fee updated successfully.'
        ]);
    }

    /**
     * Delete a fee (Admin)
     */
    public function destroy($id)
    {
        $feeObj = McFee::findOrFail($id);
        $feeObj->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Fee deleted successfully.'
        ]);
    }
}
