<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BungalowRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'beds',
        'capacity',
        'ac',
        'view',
        'emoji',
        'price',
        'emp_price',
        'additional_charge',
        'additional_charge_label',
        'sst_rate',
        'vat_rate',
        'image',
    ];

    protected $casts = [
        'ac' => 'boolean',
        'price' => 'decimal:2',
        'emp_price' => 'decimal:2',
        'additional_charge' => 'decimal:2',
        'sst_rate' => 'decimal:2',
        'vat_rate' => 'decimal:2',
    ];
}
