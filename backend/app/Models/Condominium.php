<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Condominium extends Model
{
    use HasFactory;
    protected $table = 'condominiums';
    protected $fillable = ['name','registration_no','address','district','city','unit_count','developer_name','mc_name','mc_registration_no','status','registered_at'];
    protected $casts = ['registered_at' => 'date'];
}
