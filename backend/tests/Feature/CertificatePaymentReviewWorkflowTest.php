<?php

namespace Tests\Feature;

use App\Models\CertificateDocument;
use App\Models\CertificatePayment;
use App\Models\CertificateType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CertificatePaymentReviewWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_certificate_type_has_its_own_meaningful_reference_sequence(): void
    {
        $citizen = User::factory()->create(['role' => 'citizen']);
        Sanctum::actingAs($citizen);

        foreach ([
            'ppc' => 'PPC00001',
            'provisional' => 'PRO00001',
            'semi' => 'SEM00001',
            'final' => 'FIN00001',
        ] as $code => $expectedReference) {
            $type = $this->createType($code);

            $this->postJson("/api/v1/certificates/{$type->id}/initiate-payment", $this->applicationData())
                ->assertOk()
                ->assertJsonPath('data.reference_no', $expectedReference)
                ->assertJsonPath('data.status', 'pending');
        }
    }

    public function test_only_admin_can_release_a_private_document_after_payment_review(): void
    {
        Storage::fake('local');
        Storage::fake('public');

        $type = $this->createType('ppc');
        $document = CertificateDocument::create([
            'certificate_type_id' => $type->id,
            'title_en' => 'PPC Application Form',
            'file_path' => 'certificate-documents/ppc-form.pdf',
            'file_name' => 'ppc-form.pdf',
            'file_type' => 'pdf',
            'order' => 1,
            'is_active' => true,
        ]);
        Storage::disk('local')->put($document->file_path, 'private document contents');

        $citizen = User::factory()->create(['role' => 'citizen']);
        Sanctum::actingAs($citizen);
        $reference = $this->postJson("/api/v1/certificates/{$type->id}/initiate-payment", $this->applicationData())
            ->assertOk()
            ->json('data.reference_no');

        $this->postJson("/api/v1/certificates/payments/{$reference}/complete")
            ->assertForbidden();
        $this->get("/api/v1/certificates/payments/{$reference}/documents/{$document->id}/download")
            ->assertNotFound();
        $this->getJson("/api/v1/certificates/{$type->id}")
            ->assertOk()
            ->assertJsonMissingPath('data.documents.0.url');

        $admin = User::factory()->create([
            'role' => 'staff',
            'admin_permissions' => ['certificates'],
            'is_active' => true,
        ]);
        Sanctum::actingAs($admin);
        $payment = CertificatePayment::where('reference_no', $reference)->firstOrFail();
        $this->patchJson("/api/v1/admin/certificate-payments/{$payment->id}/status", [
            'status' => 'paid',
        ])->assertOk();

        Sanctum::actingAs($citizen);
        $this->get("/api/v1/certificates/payments/{$reference}/documents/{$document->id}/download")
            ->assertOk()
            ->assertDownload('ppc-form.pdf');
    }

    private function createType(string $code): CertificateType
    {
        return CertificateType::create([
            'code' => $code,
            'title_en' => strtoupper($code).' Certificate',
            'document_fee' => 2500,
            'order' => CertificateType::count() + 1,
            'is_active' => true,
        ]);
    }

    private function applicationData(): array
    {
        return [
            'applicant_name' => 'Registered Citizen',
            'nic_or_passport' => '199012345678',
            'phone' => '0771234567',
            'email' => 'citizen@example.com',
            'address' => 'Colombo, Sri Lanka',
            'organization' => 'Example Developments',
            'notes' => 'Certificate document request',
        ];
    }
}
