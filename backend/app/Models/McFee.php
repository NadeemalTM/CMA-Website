<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class McFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'description_en',
        'description_si',
        'description_ta',
        'category',
        'fee',
        'nbt',
        'vat',
        'total',
        'order',
        'is_active',
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'nbt' => 'decimal:2',
        'vat' => 'decimal:2',
        'total' => 'decimal:2',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}
