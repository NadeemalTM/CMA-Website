<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('bungalow_rooms', 'sst_rate')) {
            Schema::table('bungalow_rooms', function (Blueprint $table) {
                $table->decimal('sst_rate', 5, 2)->default(2.25)->after('additional_charge_label');
                $table->decimal('vat_rate', 5, 2)->default(18.00)->after('sst_rate');
            });
        }

        \Illuminate\Support\Facades\DB::table('bungalow_rooms')
            ->whereNull('sst_rate')
            ->orWhere('sst_rate', 0)
            ->update(['sst_rate' => 2.25, 'vat_rate' => 18.00]);
    }

    public function down(): void
    {
        Schema::table('bungalow_rooms', function (Blueprint $table) {
            $table->dropColumn(['sst_rate', 'vat_rate']);
        });
    }
};
