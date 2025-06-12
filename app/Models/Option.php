<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $fillable = [
        'option_text',
        'option_score'
    ];

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'question_option');
    }
}