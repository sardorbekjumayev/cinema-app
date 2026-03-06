<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'description',
        'genres',
        'country',
        'year',
        'language',
        'duration',
        'age_limit',
        'poster',
        'video_path',
        'versions',
        'status',
        'is_premium',
        'price',
    ];

    protected $casts = [
        'versions' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('stars') ?: 0;
    }
}
