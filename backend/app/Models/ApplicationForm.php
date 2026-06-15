<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_en', 'title_si', 'title_ta',
        'file_path', 'file_type', 'file_size',
        'is_active', 'order'
    ];
}
