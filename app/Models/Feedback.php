<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'rating',
        'feedback',
        'consent',
    ];

}
