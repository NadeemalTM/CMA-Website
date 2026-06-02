<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class NewsEvent extends Model
{
    use HasFactory;
    protected $table = 'news_events';
    protected $fillable = [
        'title_en','title_si','title_ta',
        'body_en','body_si','body_ta',
        'excerpt_en','excerpt_si','excerpt_ta',
        'image','category','slug','is_published','published_at',
    ];
    protected $casts = ['is_published' => 'boolean', 'published_at' => 'datetime'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title_en) . '-' . time();
            }
        });
    }
}
