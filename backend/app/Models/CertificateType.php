<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificateType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'title_en', 'title_si', 'title_ta',
        'instructions_en', 'instructions_si', 'instructions_ta',
        'document_fee', 'order', 'is_active',
    ];

    protected $casts = [
        'is_active'    => 'boolean',
        'document_fee' => 'float',
    ];

    public function documents()
    {
        return $this->hasMany(CertificateDocument::class)->orderBy('order');
    }
}
