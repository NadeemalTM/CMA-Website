<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitizenSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CitizenSubmissionController extends Controller
{
    // Citizen side: List active user's submissions
    public function index(Request $request)
    {
        $submissions = CitizenSubmission::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['data' => $submissions]);
    }

    // Citizen side: Create new submission
    public function store(Request $request)
    {
        $request->validate([
            'service_type' => 'required|string',
            'amount' => 'nullable|numeric',
            'form_data' => 'required|array',
        ]);

        $refNo = 'CMA-' . strtoupper(Str::random(3)) . '-' . rand(1000, 9999);

        // For direct payments like fine or fee renewal, auto-mark payment as pending
        $paymentStatus = 'na';
        if (in_array($request->service_type, ['parking_renew', 'dev_fee', 'fine_payment', 'parking_apply'])) {
            $paymentStatus = 'pending';
        }

        $submission = CitizenSubmission::create([
            'user_id' => $request->user()->id,
            'service_type' => $request->service_type,
            'reference_no' => $refNo,
            'status' => 'pending',
            'payment_status' => $paymentStatus,
            'amount' => $request->amount ?? 0.00,
            'form_data' => $request->form_data,
        ]);

        return response()->json(['data' => $submission], 201);
    }

    // Citizen side: Pay fine or fee (Mock payment)
    public function pay(Request $request, $id)
    {
        $submission = CitizenSubmission::where('user_id', $request->user()->id)->findOrFail($id);
        
        $submission->update([
            'payment_status' => 'paid',
            'status' => 'paid',
        ]);

        return response()->json([
            'message' => 'Payment successful.',
            'data' => $submission,
        ]);
    }

    // Admin side: List all submissions
    public function adminIndex(Request $request)
    {
        $submissions = CitizenSubmission::with('user')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['data' => $submissions]);
    }

    // Admin side: Review/Update submission
    public function adminUpdate(Request $request, $id)
    {
        $submission = CitizenSubmission::findOrFail($id);
        
        $request->validate([
            'status' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        if ($request->has('status')) {
            $submission->status = $request->status;
        }
        if ($request->has('remarks')) {
            $submission->remarks = $request->remarks;
        }
        
        $submission->save();

        return response()->json(['data' => $submission]);
    }
}
