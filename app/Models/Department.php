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

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
    
    public function users()
    {
        return $this->hasMany(User::class);
    }

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
