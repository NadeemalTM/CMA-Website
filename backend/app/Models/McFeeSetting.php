<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class McFeeSetting extends Model
{
    use HasFactory;

    protected $table = 'mc_fee_settings';

    protected $fillable = [
        'tax1_name',
        'tax1_rate',
        'tax2_name',
        'tax2_rate',
    ];

    protected $casts = [
        'tax1_rate' => 'decimal:2',
        'tax2_rate' => 'decimal:2',
    ];
}
