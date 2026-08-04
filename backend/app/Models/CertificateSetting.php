<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificateSetting extends Model
{
    protected $table = 'certificate_settings';

    protected $fillable = [
        'reference_banner',
        'reference_banner_alt',
        'payment_guideline_pdf',
        'payment_guideline_title',
        'updated_by',
    ];

    public static function current(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'reference_banner_alt' => 'Certificate Application Information',
                'payment_guideline_title' => 'Payment Guidelines & Bank Instructions',
            ]
        );
    }
}
