<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('admin_permissions')->nullable()->after('role');
            $table->boolean('is_active')->default(true)->after('admin_permissions');
        });

        DB::table('users')
            ->whereIn('role', ['admin', 'staff'])
            ->update([
                'admin_permissions' => json_encode(array_keys(config('admin_permissions', []))),
                'is_active' => true,
            ]);

        DB::table('users')
            ->whereRaw('LOWER(email) = ?', [User::SUPER_ADMIN_EMAIL])
            ->update([
                'role' => 'super_admin',
                'is_active' => true,
            ]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['admin_permissions', 'is_active']);
        });
    }
};
