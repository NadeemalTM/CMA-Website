<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Leader extends Model
{
    use HasFactory;
    protected $fillable = [
        'section_type',
        'name_en','name_si','name_ta',
        'position_en','position_si','position_ta',
        'bio_en','bio_si','bio_ta',
        'photo','email','phone','order','is_active',
    ];
    protected $casts = ['is_active' => 'boolean'];
}
