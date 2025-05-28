<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invite extends Model
{
    protected $fillable = ['email', 'token', 'expires_at', 'used'];
    public $casts = [
        'expires_at' => 'datetime',
    ];

}
