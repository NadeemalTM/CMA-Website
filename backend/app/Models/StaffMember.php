<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title_en',
        'title_si',
        'title_ta',
        'phone',
        'email',
        'department_en',
        'department_si',
        'department_ta',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
