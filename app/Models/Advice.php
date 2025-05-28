<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advice extends Model
{
    protected $table = "advices";

    protected $fillable = [
        'first_name', 'last_name', 'email', 'subject',
        'category', 'priority', 'message', 'consent'
    ];

}
