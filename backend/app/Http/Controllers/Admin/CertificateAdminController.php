<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use App\Models\CertificateDocument;
use App\Models\CertificatePayment;
use Illuminate\Http\Request;

class CertificateAdminController extends Controller
{
    // --- Certificate Types ---
    public function typesIndex()
    {
        return response()->json(['data' => CertificateType::orderBy('order')->get()]);
    }

    public function typesStore(Request $request)
    {
        $data = $request->validate([
            'code'             => 'required|unique:certificate_types,code',
            'title_en'         => 'required|string',
            'title_si'         => 'nullable|string',
            'title_ta'         => 'nullable|string',
            'instructions_en'  => 'nullable|string',
            'instructions_si'  => 'nullable|string',
            'instructions_ta'  => 'nullable|string',
            'document_fee'     => 'required|numeric|min:0',
            'order'            => 'nullable|integer',
            'is_active'        => 'nullable|boolean',
        ]);

        $type = CertificateType::create($data);
        return response()->json(['data' => $type], 201);
    }

    public function typesShow($id)
    {
        $type = CertificateType::with('documents')->findOrFail($id);
        return response()->json(['data' => $type]);
    }

    public function typesUpdate(Request $request, $id)
    {
        $type = CertificateType::findOrFail($id);
        $data = $request->validate([
            'code'             => 'required|unique:certificate_types,code,' . $id,
            'title_en'         => 'required|string',
            'title_si'         => 'nullable|string',
            'title_ta'         => 'nullable|string',
            'instructions_en'  => 'nullable|string',
            'instructions_si'  => 'nullable|string',
            'instructions_ta'  => 'nullable|string',
            'document_fee'     => 'required|numeric|min:0',
            'order'            => 'nullable|integer',
            'is_active'        => 'nullable|boolean',
        ]);

        $type->update($data);
        return response()->json(['data' => $type]);
    }

    public function typesDestroy($id)
    {
        CertificateType::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    // --- Certificate Documents ---
    public function docsIndex(Request $request)
    {
        $query = CertificateDocument::query();
        if ($request->has('certificate_type_id')) {
            $query->where('certificate_type_id', $request->certificate_type_id);
        }
        return response()->json(['data' => $query->orderBy('order')->get()]);
    }

    public function docsStore(Request $request)
    {
        $data = $request->validate([
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'title_en'            => 'required|string',
            'title_si'            => 'nullable|string',
            'title_ta'            => 'nullable|string',
            'file_path'           => 'required|string',
            'file_name'           => 'required|string',
            'file_type'           => 'nullable|string',
            'order'               => 'nullable|integer',
            'is_active'           => 'nullable|boolean',
        ]);

        $doc = CertificateDocument::create($data);
        return response()->json(['data' => $doc], 201);
    }

    public function docsShow($id)
    {
        $doc = CertificateDocument::findOrFail($id);
        return response()->json(['data' => $doc]);
    }

    public function docsUpdate(Request $request, $id)
    {
        $doc = CertificateDocument::findOrFail($id);
        $data = $request->validate([
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'title_en'            => 'required|string',
            'title_si'            => 'nullable|string',
            'title_ta'            => 'nullable|string',
            'file_path'           => 'required|string',
            'file_name'           => 'required|string',
            'file_type'           => 'nullable|string',
            'order'               => 'nullable|integer',
            'is_active'           => 'nullable|boolean',
        ]);

        $doc->update($data);
        return response()->json(['data' => $doc]);
    }

    public function docsDestroy($id)
    {
        CertificateDocument::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    // --- Payments List ---
    public function paymentsIndex()
    {
        $payments = CertificatePayment::with(['certificateType', 'citizen'])
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'reference_no'  => $p->reference_no,
                'certificate'   => $p->certificateType ? $p->certificateType->title_en : 'N/A',
                'citizen_name'  => $p->citizen ? $p->citizen->name : 'N/A',
                'citizen_email' => $p->citizen ? $p->citizen->email : 'N/A',
                'amount'        => $p->amount,
                'status'        => $p->status,
                'paid_at'       => $p->paid_at,
                'created_at'    => $p->created_at,
            ]);

        return response()->json(['data' => $payments]);
    }
}
