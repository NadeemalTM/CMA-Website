<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BungalowHeroImage extends Model
{
    use HasFactory;

    protected $fillable = ['slot', 'image', 'alt_text', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
