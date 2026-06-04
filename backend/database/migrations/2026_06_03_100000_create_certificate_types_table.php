<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('certificate_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // ppc, provisional, semi, final
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->longText('instructions_en')->nullable();
            $table->longText('instructions_si')->nullable();
            $table->longText('instructions_ta')->nullable();
            $table->decimal('document_fee', 10, 2)->default(0);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('certificate_types');
    }
};
