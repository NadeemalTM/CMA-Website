<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vacancy extends Model
{
    use HasFactory;
    protected $fillable = ['title_en','title_si','title_ta','description_en','description_si','description_ta','deadline','is_active', 'document_path'];
    protected $casts = ['is_active' => 'boolean', 'deadline' => 'date'];

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
