<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('citizen_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('service_type'); // property, parking_renew, dev_fee, renovation, parking_apply, fine_payment
            $table->string('reference_no')->unique();
            $table->string('status')->default('pending'); // pending, processing, approved, rejected, paid
            $table->string('payment_status')->default('pending'); // pending, paid, na
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->json('form_data')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizen_submissions');
    }
};
