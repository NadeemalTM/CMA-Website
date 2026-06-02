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
        'image',
    ];

    protected $casts = [
        'ac' => 'boolean',
        'price' => 'decimal:2',
        'emp_price' => 'decimal:2',
    ];
}
