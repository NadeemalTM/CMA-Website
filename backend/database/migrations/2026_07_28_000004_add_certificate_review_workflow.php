<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificate_payments', function (Blueprint $table) {
            $table->unsignedInteger('sequence_number')->nullable()->after('reference_no');
            $table->json('application_data')->nullable()->after('citizen_id');
            $table->unsignedBigInteger('reviewed_by')->nullable()->index()->after('remarks');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->unique(
                ['certificate_type_id', 'sequence_number'],
                'cert_payment_type_sequence_unique',
            );
        });

        $prefixes = [
            'ppc' => 'PPC',
            'provisional' => 'PRO',
            'semi' => 'SEM',
            'final' => 'FIN',
        ];

        // Use temporary unique values before assigning the type sequences.
        DB::table('certificate_payments')->orderBy('id')->get()->each(function ($payment): void {
            DB::table('certificate_payments')->where('id', $payment->id)->update([
                'reference_no' => 'LEGACY-'.$payment->id,
            ]);
        });

        $types = DB::table('certificate_types')->pluck('code', 'id');
        foreach ($types as $typeId => $code) {
            $sequence = 0;
            $prefix = $prefixes[strtolower($code)] ?? strtoupper(substr($code, 0, 3));
            DB::table('certificate_payments')
                ->where('certificate_type_id', $typeId)
                ->orderBy('id')
                ->get()
                ->each(function ($payment) use (&$sequence, $prefix): void {
                    $sequence++;
                    DB::table('certificate_payments')->where('id', $payment->id)->update([
                        'sequence_number' => $sequence,
                        'reference_no' => $prefix.str_pad((string) $sequence, 5, '0', STR_PAD_LEFT),
                    ]);
                });
        }

        // Certificate files are paid assets. Move existing files out of the
        // public storage symlink so they can only be served by the paid route.
        DB::table('certificate_documents')->orderBy('id')->get()->each(function ($document): void {
            if (! Storage::disk('public')->exists($document->file_path)) {
                return;
            }

            $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);
            $privatePath = 'certificate-documents/'.$document->id.($extension ? '.'.$extension : '');
            Storage::disk('local')->put($privatePath, Storage::disk('public')->get($document->file_path));

            if (Storage::disk('local')->exists($privatePath)) {
                Storage::disk('public')->delete($document->file_path);
                DB::table('certificate_documents')->where('id', $document->id)->update([
                    'file_path' => $privatePath,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('certificate_payments', function (Blueprint $table) {
            $table->dropUnique('cert_payment_type_sequence_unique');
            $table->dropIndex(['reviewed_by']);
            $table->dropColumn(['sequence_number', 'application_data', 'reviewed_by', 'reviewed_at']);
        });
    }
};
