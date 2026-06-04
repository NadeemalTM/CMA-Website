<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use App\Models\CertificatePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /** GET /api/v1/certificates — list all active types */
    public function index(Request $request)
    {
        $lang = $request->get('lang', 'en');
        $types = CertificateType::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn($t) => $this->formatType($t, $lang, false));

        return response()->json(['data' => $types]);
    }

    /** GET /api/v1/certificates/{id} — single type with documents */
    public function show(Request $request, $id)
    {
        $lang = $request->get('lang', 'en');
        $type = CertificateType::with(['documents' => fn($q) => $q->where('is_active', true)])
            ->where('is_active', true)
            ->findOrFail($id);

        return response()->json(['data' => $this->formatType($type, $lang, true)]);
    }

    /** POST /api/v1/certificates/{id}/initiate-payment — citizen initiates payment */
    public function initiatePayment(Request $request, $id)
    {
        $type   = CertificateType::where('is_active', true)->findOrFail($id);
        $citizen = $request->user();

        $ref = 'CERT-' . strtoupper(Str::random(8)) . '-' . now()->format('ymd');

        $payment = CertificatePayment::create([
            'reference_no'        => $ref,
            'certificate_type_id' => $type->id,
            'citizen_id'          => $citizen->id,
            'amount'              => $type->document_fee,
            'status'              => 'pending',
        ]);

        return response()->json([
            'data' => [
                'reference_no'   => $ref,
                'amount'         => $type->document_fee,
                'certificate_id' => $type->id,
                'payment_id'     => $payment->id,
            ]
        ]);
    }

    /** POST /api/v1/certificates/payments/{ref}/complete — simulate payment completion */
    public function completePayment(Request $request, $ref)
    {
        $payment = CertificatePayment::where('reference_no', $ref)
            ->where('citizen_id', $request->user()->id)
            ->firstOrFail();

        $payment->update([
            'status'         => 'completed',
            'payment_method' => $request->get('payment_method', 'card'),
            'paid_at'        => now(),
        ]);

        return response()->json(['data' => ['status' => 'completed', 'reference_no' => $ref]]);
    }

    /** GET /api/v1/certificates/payments/{ref}/status */
    public function paymentStatus(Request $request, $ref)
    {
        $payment = CertificatePayment::where('reference_no', $ref)
            ->where('citizen_id', $request->user()->id)
            ->with('certificateType.documents')
            ->firstOrFail();

        $lang = $request->get('lang', 'en');
        $docs = [];
        if ($payment->status === 'completed' && $payment->certificateType) {
            $docs = $payment->certificateType->documents
                ->where('is_active', true)
                ->map(fn($d) => [
                    'id'        => $d->id,
                    'title'     => $d->{"title_{$lang}"} ?? $d->title_en,
                    'file_name' => $d->file_name,
                    'file_type' => $d->file_type,
                    'url'       => "/storage/{$d->file_path}",
                ])->values();
        }

        return response()->json([
            'data' => [
                'status'       => $payment->status,
                'reference_no' => $ref,
                'amount'       => $payment->amount,
                'paid_at'      => $payment->paid_at,
                'documents'    => $docs,
            ]
        ]);
    }

    /** GET /api/v1/certificates/my-payments — citizen's payment history */
    public function myPayments(Request $request)
    {
        $lang = $request->get('lang', 'en');
        $payments = CertificatePayment::where('citizen_id', $request->user()->id)
            ->with('certificateType')
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'                  => $p->id,
                'reference_no'        => $p->reference_no,
                'certificate_type_id' => $p->certificate_type_id,
                'certificate'         => $p->certificateType ? ($p->certificateType->{"title_{$lang}"} ?? $p->certificateType->title_en) : 'N/A',
                'amount'              => $p->amount,
                'status'              => $p->status,
                'paid_at'             => $p->paid_at,
                'created_at'          => $p->created_at,
            ]);

        return response()->json(['data' => $payments]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function formatType($type, $lang, $withDocs = false): array
    {
        $data = [
            'id'           => $type->id,
            'code'         => $type->code,
            'title'        => $type->{"title_{$lang}"} ?? $type->title_en,
            'instructions' => $type->{"instructions_{$lang}"} ?? $type->instructions_en,
            'document_fee' => $type->document_fee,
            'order'        => $type->order,
        ];

        if ($withDocs && isset($type->documents)) {
            $data['documents'] = $type->documents
                ->where('is_active', true)
                ->map(fn($d) => [
                    'id'        => $d->id,
                    'title'     => $d->{"title_{$lang}"} ?? $d->title_en,
                    'file_name' => $d->file_name,
                    'file_type' => $d->file_type,
                    'url'       => "/storage/{$d->file_path}",
                ])->values();
        }

        return $data;
    }
}
