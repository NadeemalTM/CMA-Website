<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Complaint extends Model
{
    use HasFactory;
    protected $fillable = ['name','email','phone','subject','message','status','reply','replied_at'];
    protected $casts = ['replied_at' => 'datetime'];
}
