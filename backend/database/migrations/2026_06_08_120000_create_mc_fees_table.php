<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mc_fees', function (Blueprint $table) {
            $table->id();
            $table->string('description_en');
            $table->string('description_si')->nullable();
            $table->string('description_ta')->nullable();
            $table->string('category'); // e.g. 'application', 'registration'
            $table->decimal('fee', 10, 2)->default(0);
            $table->decimal('nbt', 10, 2)->default(0);
            $table->decimal('vat', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mc_fees');
    }
};
