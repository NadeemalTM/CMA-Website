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
        Schema::table('application_tariffs', function (Blueprint $table) {
            if (!Schema::hasColumn('application_tariffs', 'item_no')) {
                $table->string('item_no')->nullable()->after('id');
            }
            if (!Schema::hasColumn('application_tariffs', 'scale')) {
                $table->string('scale')->nullable()->after('description_ta');
            }
            if (!Schema::hasColumn('application_tariffs', 'fee_display')) {
                $table->string('fee_display')->nullable()->after('fee');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_tariffs', function (Blueprint $table) {
            if (Schema::hasColumn('application_tariffs', 'item_no')) {
                $table->dropColumn('item_no');
            }
            if (Schema::hasColumn('application_tariffs', 'scale')) {
                $table->dropColumn('scale');
            }
            if (Schema::hasColumn('application_tariffs', 'fee_display')) {
                $table->dropColumn('fee_display');
            }
        });
    }
};
