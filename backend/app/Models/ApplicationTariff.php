<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationTariff extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'description_en',
        'description_si',
        'description_ta',
        'fee',
        'remarks',
        'order',
        'is_active',
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}
