<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('General'); // e.g., 'General', 'Renewal Certificate', 'Transferring Certificate'
            $table->string('description_en');
            $table->string('description_si')->nullable();
            $table->string('description_ta')->nullable();
            $table->decimal('fee', 10, 2);
            $table->string('remarks')->nullable(); // e.g., '+ Rs. 500 per additional unit'
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_tariffs');
    }
};
