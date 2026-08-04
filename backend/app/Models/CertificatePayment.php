<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificatePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no', 'sequence_number', 'certificate_type_id', 'citizen_id',
        'application_data', 'amount', 'status', 'payment_method', 'remarks',
        'reviewed_by', 'reviewed_at', 'paid_at',
    ];

    protected $casts = [
        'amount'  => 'float',
        'paid_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'application_data' => 'array',
    ];

    public function certificateType()
    {
        return $this->belongsTo(CertificateType::class);
    }

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }
}
