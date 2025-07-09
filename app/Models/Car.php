<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'price',
        'description',
        'specifications',
        'images',
        'fuel_type',
        'transmission',
        'year',
        'is_active',
    ];

    protected $casts = [
        'specifications' => 'array',
        'images' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFormattedPriceAttribute()
    {
        return '₹' . number_format($this->price, 0);
    }
}
