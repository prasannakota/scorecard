<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionCondition extends Model
{
    protected $fillable = [
        'question_id',
        'sequence_number',
        'option',
        'next_question_id',
        'condition_type',
        'condition_value'
    ];

    protected $casts = [
        'sequence_number' => 'integer',
        'next_question_id' => 'integer'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function nextQuestion()
    {
        return $this->belongsTo(Question::class, 'next_question_id');
    }
}
