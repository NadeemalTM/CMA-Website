<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CitizenSubmission extends Model
{
    use HasFactory;

    protected $table = 'citizen_submissions';

    protected $fillable = [
        'user_id',
        'service_type',
        'reference_no',
        'status',
        'payment_status',
        'amount',
        'form_data',
        'remarks',
    ];

    protected $casts = [
        'form_data' => 'array',
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
