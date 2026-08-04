<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leaders', function (Blueprint $table) {
            $table->string('section_type', 20)->default('leadership')->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('leaders', function (Blueprint $table) {
            $table->dropColumn('section_type');
        });
    }
};
