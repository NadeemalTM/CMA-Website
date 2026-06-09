<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobApplication extends Model
{
    use HasFactory;
    
    protected $fillable = ['vacancy_id', 'name', 'email', 'phone', 'message', 'cv_path'];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }
}
