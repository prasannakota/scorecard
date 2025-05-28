<?php

namespace App\Services;

use App\Models\Question;
use App\Models\Department;

class QuestionService
{
    public function getNextQuestion($currentQuestionId, $selectedOption = null)
    {
        $question = Question::with('condition')->findOrFail($currentQuestionId);
        
        if ($selectedOption && $question->condition) {
            // Check if this option triggers a specific next question
            if ($question->option_a === $selectedOption && $question->condition->next_question_id) {
                return $question->condition->next_question_id;
            }
            
            // Check if the question has conditional logic
            if ($question->condition->condition_type === 'option_value' && 
                $selectedOption === $question->condition->condition_value) {
                return $question->condition->next_question_id;
            }
        }
        
        // If no conditions met, get next question in sequence
        return Question::where('department_id', $question->department_id)
            ->where('sequence_number', '>', $question->condition?->sequence_number ?? 0)
            ->orderBy('sequence_number')
            ->value('id');
    }

    public function getQuestionsForDepartment(Department $department)
    {
        return Question::where('department_id', $department->id)
            ->where('is_active', true)
            ->orderBy('sequence_number')
            ->get();
    }
}
