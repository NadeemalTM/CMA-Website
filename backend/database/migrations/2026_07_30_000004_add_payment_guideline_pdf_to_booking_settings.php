<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('bungalow_booking_settings')) {
            Schema::table('bungalow_booking_settings', function (Blueprint $table) {
                if (!Schema::hasColumn('bungalow_booking_settings', 'payment_guideline_pdf')) {
                    $table->string('payment_guideline_pdf')->nullable()->after('reference_banner_alt');
                }
                if (!Schema::hasColumn('bungalow_booking_settings', 'payment_guideline_title')) {
                    $table->string('payment_guideline_title')->nullable()->after('payment_guideline_pdf');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('bungalow_booking_settings')) {
            Schema::table('bungalow_booking_settings', function (Blueprint $table) {
                $table->dropColumn(['payment_guideline_pdf', 'payment_guideline_title']);
            });
        }
    }
};
