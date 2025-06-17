<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FollowUpQuestion extends Model
{
    protected $fillable = ['option_id', 'follow_up_question_id'];

    public function option()
    {
        return $this->belongsTo(Option::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'follow_up_question_id');
    }
}
