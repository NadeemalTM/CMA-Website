<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BungalowBookingSetting extends Model
{
    protected $fillable = [
        'tax_rate',
        'reference_banner',
        'reference_banner_alt',
        'payment_guideline_pdf',
        'payment_guideline_title',
        'updated_by',
    ];

    protected function casts(): array
    {
        return ['tax_rate' => 'decimal:2'];
    }

    public static function current(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            ['tax_rate' => 18, 'reference_banner_alt' => 'Kataragama booking information'],
        );
    }
}
