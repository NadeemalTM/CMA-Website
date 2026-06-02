<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Announcement extends Model
{
    use HasFactory;
    protected $fillable = ['text_en','text_si','text_ta','link','is_active','expires_at','order'];
    protected $casts = ['is_active' => 'boolean', 'expires_at' => 'datetime'];
}
