<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('permanent_address')->nullable();
            $table->string('occupation')->nullable();
            $table->string('gov_letter')->nullable();
            $table->boolean('is_cma_employee')->default(false);
            $table->integer('family_count')->default(0);
            $table->text('family_members')->nullable(); // Stored as serialized JSON
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'permanent_address',
                'occupation',
                'gov_letter',
                'is_cma_employee',
                'family_count',
                'family_members'
            ]);
        });
    }
};
