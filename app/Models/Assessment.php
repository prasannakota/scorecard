<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = ['user_name', 'total_score','user_id','department_id'];

    public function answers()
    {
        return $this->hasMany(AssessmentAnswer::class);
    }
}
