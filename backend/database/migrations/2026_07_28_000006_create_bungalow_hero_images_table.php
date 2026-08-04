<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bungalow_hero_images', function (Blueprint $table) {
            $table->id();
            $table->string('slot', 30)->unique();
            $table->text('image');
            $table->string('alt_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $now = now();
        DB::table('bungalow_hero_images')->insert([
            [
                'slot' => 'background',
                'image' => 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1400&auto=format&fit=crop&q=70',
                'alt_text' => 'Kataragama natural landscape',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slot' => 'gallery_1',
                'image' => 'https://media-cdn.tripadvisor.com/media/photo-s/02/e0/70/a5/gem-river-edge-eco-home.jpg',
                'alt_text' => 'Kataragama bungalow surroundings',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slot' => 'gallery_2',
                'image' => 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=900&auto=format&fit=crop&q=75',
                'alt_text' => 'Bungalow living room',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slot' => 'gallery_3',
                'image' => 'https://st5.depositphotos.com/19085394/64942/i/450/depositphotos_649426038-stock-photo-kirivehara-kiri-vehera-shrine-kataragama.jpg',
                'alt_text' => 'Kataragama Kiri Vehera Temple',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('bungalow_hero_images');
    }
};
