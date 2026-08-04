<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Complaint extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'reply', 'replied_at'];
    protected $casts = ['replied_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
