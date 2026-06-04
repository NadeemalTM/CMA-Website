<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('certificate_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_type_id')->constrained()->onDelete('cascade');
            $table->string('title_en');
            $table->string('title_si')->nullable();
            $table->string('title_ta')->nullable();
            $table->string('file_path');       // stored file path
            $table->string('file_name');       // original file name
            $table->string('file_type')->nullable(); // pdf, docx, etc.
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('certificate_documents');
    }
};
