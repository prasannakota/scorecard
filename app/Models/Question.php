<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'revenue_range',
        'question_text',
        'question_type',
        'sequence_number',
        'next_question_id',
        'condition_type',
        'condition_value',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'option_e',
        'score_a',
        'score_b',
        'score_c',
        'score_d',
        'score_e',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sequence_number' => 'integer',
        'next_question_id' => 'integer'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function conditions()
    {
        return $this->hasMany(QuestionCondition::class);
    }

    public function nextQuestion()
    {
        return $this->belongsTo(Question::class, 'next_question_id');
    }
}
