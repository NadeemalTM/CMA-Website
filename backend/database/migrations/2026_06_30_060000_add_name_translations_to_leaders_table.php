<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leaders', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('id');
            $table->string('name_si')->nullable()->after('name_en');
            $table->string('name_ta')->nullable()->after('name_si');
        });

        // Copy existing names to name_en
        DB::table('leaders')->update([
            'name_en' => DB::raw('name'),
            'name_si' => DB::raw('name'),
            'name_ta' => DB::raw('name'),
        ]);

        Schema::table('leaders', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaders', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });

        DB::table('leaders')->update([
            'name' => DB::raw('name_en')
        ]);

        Schema::table('leaders', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'name_si', 'name_ta']);
        });
    }
};
