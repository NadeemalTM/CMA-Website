<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bungalow_rooms', function (Blueprint $table) {
            $table->decimal('additional_charge', 10, 2)->default(0)->after('emp_price');
            $table->string('additional_charge_label')->nullable()->after('additional_charge');
        });
    }

    public function down(): void
    {
        Schema::table('bungalow_rooms', function (Blueprint $table) {
            $table->dropColumn(['additional_charge', 'additional_charge_label']);
        });
    }
};
