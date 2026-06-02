<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bungalow_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('beds');
            $table->string('capacity');
            $table->boolean('ac')->default(true);
            $table->string('view');
            $table->string('emoji');
            $table->decimal('price', 10, 2);
            $table->decimal('emp_price', 10, 2);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bungalow_rooms');
    }
};
