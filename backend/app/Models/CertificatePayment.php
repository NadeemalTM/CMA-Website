<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificatePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no', 'certificate_type_id', 'citizen_id',
        'amount', 'status', 'payment_method', 'remarks', 'paid_at',
    ];

    protected $casts = [
        'amount'  => 'float',
        'paid_at' => 'datetime',
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
