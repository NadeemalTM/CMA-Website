<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificateDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_type_id',
        'title_en', 'title_si', 'title_ta',
        'file_path', 'file_name', 'file_type',
        'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function certificateType()
    {
        return $this->belongsTo(CertificateType::class);
    }
}
