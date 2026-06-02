<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;
    protected $fillable = ['reference_no','applicant_name','email','phone','type','form_data','status','remarks'];
    protected $casts = ['form_data' => 'array'];
}
