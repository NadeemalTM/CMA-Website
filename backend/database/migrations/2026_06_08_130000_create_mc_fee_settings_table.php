<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mc_fee_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tax1_name')->default('NBT');
            $table->decimal('tax1_rate', 5, 2)->default(2.00);
            $table->string('tax2_name')->default('VAT');
            $table->decimal('tax2_rate', 5, 2)->default(12.00);
            $table->timestamps();
        });

        // Insert default configurations
        DB::table('mc_fee_settings')->insert([
            'tax1_name' => 'NBT',
            'tax1_rate' => 2.00,
            'tax2_name' => 'VAT',
            'tax2_rate' => 12.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('mc_fee_settings');
    }
};
