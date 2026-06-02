<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;
    protected $fillable = ['title_en','title_si','title_ta','type','category','file_path','language','year','is_active'];
    protected $casts = ['is_active' => 'boolean'];
}
