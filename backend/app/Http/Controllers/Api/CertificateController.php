<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use App\Models\CertificatePayment;
use App\Models\CertificateDocument;
use App\Models\CertificateSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class CertificateController extends Controller
{
    private function ensureCertificateSettingsSchema(): void
    {
        try {
            if (!Schema::hasTable('certificate_settings')) {
                Schema::create('certificate_settings', function (Blueprint $table) {
                    $table->id();
                    $table->string('reference_banner')->nullable();
                    $table->string('reference_banner_alt')->nullable();
                    $table->string('payment_guideline_pdf')->nullable();
                    $table->string('payment_guideline_title')->nullable();
                    $table->unsignedBigInteger('updated_by')->nullable();
                    $table->timestamps();
                });
            }
        } catch (\Throwable $e) {}
    }

    public function settings()
    {
        $this->ensureCertificateSettingsSchema();
        $settings = CertificateSetting::current();
        return response()->json([
            'status' => 'success',
            'data' => [
                'reference_banner' => $settings->reference_banner
                    ? (str_starts_with($settings->reference_banner, 'http')
                        ? $settings->reference_banner
                        : asset('storage/' . $settings->reference_banner))
                    : null,
                'reference_banner_path' => $settings->reference_banner,
                'reference_banner_alt' => $settings->reference_banner_alt,
                'payment_guideline_pdf' => $settings->payment_guideline_pdf
                    ? (str_starts_with($settings->payment_guideline_pdf, 'http')
                        ? $settings->payment_guideline_pdf
                        : asset('storage/' . $settings->payment_guideline_pdf))
                    : null,
                'payment_guideline_pdf_path' => $settings->payment_guideline_pdf,
                'payment_guideline_title' => $settings->payment_guideline_title ?: 'Payment Guidelines & Bank Instructions',
            ],
        ]);
    }

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

        $application = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'nic_or_passport' => 'required|string|max:50',
            'phone' => 'required|string|max:30',
            'email' => 'required|email|max:255',
            'address' => 'required|string|max:500',
            'organization' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
        ]);

        $payment = retry(5, function () use ($type, $citizen, $application) {
            return DB::transaction(function () use ($type, $citizen, $application) {
                $sequence = ((int) CertificatePayment::where('certificate_type_id', $type->id)
                    ->lockForUpdate()
                    ->max('sequence_number')) + 1;

                return CertificatePayment::create([
                    'reference_no' => $type->referencePrefix().str_pad((string) $sequence, 5, '0', STR_PAD_LEFT),
                    'sequence_number' => $sequence,
                    'certificate_type_id' => $type->id,
                    'citizen_id' => $citizen->id,
                    'application_data' => $application,
                    'amount' => $type->document_fee,
                    'status' => 'pending',
                ]);
            });
        }, 20);

        return response()->json([
            'data' => [
                'reference_no'   => $payment->reference_no,
                'amount'         => $type->document_fee,
                'certificate_id' => $type->id,
                'payment_id'     => $payment->id,
                'status'         => 'pending',
                'message'        => 'Your payment request is pending administrator review.',
            ]
        ]);
    }

    /** Citizens cannot approve their own payment. */
    public function completePayment(Request $request, $ref)
    {
        return response()->json([
            'message' => 'Payment completion requires administrator review.',
        ], 403);
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

    /** Download a paid document after rechecking citizen ownership and status. */
    public function download(Request $request, $ref, $documentId)
    {
        $payment = CertificatePayment::where('reference_no', strtoupper($ref))
            ->where('citizen_id', $request->user()->id)
            ->where('status', 'completed')
            ->firstOrFail();

        $document = CertificateDocument::whereKey($documentId)
            ->where('certificate_type_id', $payment->certificate_type_id)
            ->where('is_active', true)
            ->firstOrFail();

        $disk = Storage::disk('local')->exists($document->file_path) ? 'local' : 'public';
        abort_unless(Storage::disk($disk)->exists($document->file_path), 404, 'Document file not found.');

        return Storage::disk($disk)->download($document->file_path, $document->file_name);
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
                'application_data'    => $p->application_data,
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
                ])->values();
        }

        return $data;
    }
}
