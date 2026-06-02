<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_name',
        'email',
        'phone',
        'nic',
        'employee_id',
        'unit_number',
        'check_in',
        'check_out',
        'adults',
        'children',
        'status',
        'amount',
        'notes',
        'permanent_address',
        'occupation',
        'gov_letter',
        'is_cma_employee',
        'family_count',
        'family_members',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'amount' => 'decimal:2',
        'is_cma_employee' => 'boolean',
        'family_count' => 'integer',
        'family_members' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
