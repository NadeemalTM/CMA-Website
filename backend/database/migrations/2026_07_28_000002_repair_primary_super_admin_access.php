<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->whereRaw('LOWER(email) = ?', [User::SUPER_ADMIN_EMAIL])
            ->update([
                'role' => 'super_admin',
                'is_active' => true,
            ]);
    }

    public function down(): void
    {
        // The primary recovery account must remain active.
    }
};
