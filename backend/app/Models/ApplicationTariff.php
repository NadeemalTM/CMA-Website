<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationTariff extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_no',
        'category',
        'description_en',
        'description_si',
        'description_ta',
        'scale',
        'fee',
        'fee_display',
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
