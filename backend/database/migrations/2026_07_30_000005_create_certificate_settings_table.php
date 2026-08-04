<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_settings');
    }
};
