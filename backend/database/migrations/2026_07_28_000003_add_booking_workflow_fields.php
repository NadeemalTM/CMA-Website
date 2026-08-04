<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('reference_no', 10)->nullable()->unique()->after('id');
            $table->string('payment_status')->default('Pending')->after('status');
            $table->timestamp('approved_at')->nullable()->after('payment_status');
            $table->unsignedBigInteger('approved_by')->nullable()->index()->after('approved_at');
        });

        DB::table('bookings')
            ->select('id')
            ->orderBy('id')
            ->chunkById(500, function ($bookings): void {
                foreach ($bookings as $booking) {
                    DB::table('bookings')
                        ->where('id', $booking->id)
                        ->update(['reference_no' => 'KTGB'.str_pad((string) $booking->id, 6, '0', STR_PAD_LEFT)]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['approved_by']);
            $table->dropUnique(['reference_no']);
            $table->dropColumn(['reference_no', 'payment_status', 'approved_at', 'approved_by']);
        });
    }
};
