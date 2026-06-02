<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HeroSlide extends Model
{
    use HasFactory;
    protected $fillable = [
        'title_en','title_si','title_ta',
        'subtitle_en','subtitle_si','subtitle_ta',
        'description_en','description_si','description_ta',
        'image','button_text_en','button_text_si','button_text_ta',
        'button_link','order','is_active',
    ];
    protected $casts = ['is_active' => 'boolean'];
}
