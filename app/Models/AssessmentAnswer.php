<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['assessment_id', 'question_id', 'selected_option', 'score','department_id','user_id'];

}
