<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use App\Models\CertificateDocument;
use App\Models\CertificatePayment;
use App\Models\CertificateSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;

class CertificateAdminController extends Controller
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

    public function getSettings()
    {
        $this->ensureCertificateSettingsSchema();
        return response()->json(['status' => 'success', 'data' => CertificateSetting::current()]);
    }

    public function updateSettings(Request $request)
    {
        $this->ensureCertificateSettingsSchema();
        $data = $request->validate([
            'reference_banner' => 'nullable|string|max:2048',
            'reference_banner_alt' => 'nullable|string|max:255',
            'payment_guideline_pdf' => 'nullable|string|max:2048',
            'payment_guideline_title' => 'nullable|string|max:255',
        ]);
        $data['updated_by'] = $request->user()->id;
        $settings = CertificateSetting::current();
        $settings->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $settings->fresh(),
            'message' => 'Certificate settings updated successfully.',
        ]);
    }

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

        $data['file_path'] = $this->secureDocumentPath($data['file_path']);
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

        if ($data['file_path'] !== $doc->file_path) {
            $data['file_path'] = $this->secureDocumentPath($data['file_path']);
            if (Storage::disk('local')->exists($doc->file_path)) {
                Storage::disk('local')->delete($doc->file_path);
            }
        }
        $doc->update($data);
        return response()->json(['data' => $doc]);
    }

    public function docsDestroy($id)
    {
        $document = CertificateDocument::findOrFail($id);
        if (Storage::disk('local')->exists($document->file_path)) {
            Storage::disk('local')->delete($document->file_path);
        }
        $document->delete();
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
                'application_data' => $p->application_data,
                'amount'        => $p->amount,
                'status'        => $p->status,
                'paid_at'       => $p->paid_at,
                'created_at'    => $p->created_at,
            ]);

        return response()->json(['data' => $payments]);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,paid,rejected',
            'remarks' => 'nullable|string|max:2000',
        ]);

        $payment = CertificatePayment::findOrFail($id);
        $storedStatus = match ($data['status']) {
            'paid' => 'completed',
            'rejected' => 'failed',
            default => 'pending',
        };

        $payment->update([
            'status' => $storedStatus,
            'remarks' => $data['remarks'] ?? $payment->remarks,
            'payment_method' => $storedStatus === 'completed' ? 'admin_review' : null,
            'paid_at' => $storedStatus === 'completed' ? now() : null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'data' => $payment->fresh(['certificateType', 'citizen']),
            'message' => $storedStatus === 'completed'
                ? 'Payment marked as paid. Document access is now available to the citizen.'
                : 'Payment review status updated.',
        ]);
    }

    private function secureDocumentPath(string $path): string
    {
        if (Storage::disk('local')->exists($path)) {
            return $path;
        }

        abort_unless(Storage::disk('public')->exists($path), 422, 'Uploaded document file was not found.');
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $privatePath = 'certificate-documents/'.Str::uuid().($extension ? '.'.$extension : '');
        Storage::disk('local')->put($privatePath, Storage::disk('public')->get($path));
        abort_unless(Storage::disk('local')->exists($privatePath), 500, 'Unable to secure the uploaded document.');
        Storage::disk('public')->delete($path);

        return $privatePath;
    }
}
