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
            $table->json('room_ids')->nullable()->after('unit_number');
            $table->json('room_details')->nullable()->after('room_ids');
            $table->decimal('subtotal', 12, 2)->default(0)->after('amount');
            $table->decimal('tax_rate', 5, 2)->default(0)->after('subtotal');
            $table->decimal('tax_amount', 12, 2)->default(0)->after('tax_rate');
        });

        Schema::create('bungalow_booking_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('tax_rate', 5, 2)->default(18);
            $table->text('reference_banner')->nullable();
            $table->string('reference_banner_alt')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });

        DB::table('bungalow_booking_settings')->insert([
            'id' => 1,
            'tax_rate' => 18,
            'reference_banner' => null,
            'reference_banner_alt' => 'Kataragama booking information',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $roomsByName = DB::table('bungalow_rooms')->pluck('id', 'name');
        DB::table('bookings')->orderBy('id')->chunkById(250, function ($bookings) use ($roomsByName): void {
            foreach ($bookings as $booking) {
                $roomId = $roomsByName[$booking->unit_number] ?? null;
                DB::table('bookings')->where('id', $booking->id)->update([
                    'room_ids' => $roomId ? json_encode([(int) $roomId]) : null,
                    'subtotal' => $booking->amount,
                    'tax_rate' => 0,
                    'tax_amount' => 0,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bungalow_booking_settings');

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['room_ids', 'room_details', 'subtotal', 'tax_rate', 'tax_amount']);
        });
    }
};
