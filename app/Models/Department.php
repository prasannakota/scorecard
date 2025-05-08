<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Department extends Model
{
    protected $table = 'departments';
    
    protected $fillable = [
        'name',
        'description',
        'slug',
        'is_active'
    ];

    public $timestamps = true;

    protected static function boot()
    {
        parent::boot();

        // Automatically generate slug before saving
        static::creating(function ($department) {
            $department->slug = Str::of($department->name)->slug();
        });
    }
}
