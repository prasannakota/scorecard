<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Department;
use App\Models\QuestionCondition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function index(Department $department)
    {
        $questions = $department->questions()
            ->with('conditions')
            ->latest()
            ->paginate(10);
        return view('admin.questions.index', compact('department', 'questions'));
    }

    public function create(Department $department)
    {
        $questionTypes = ['single_choice', 'multiple_choice', 'text', 'yes_no'];
        $previousQuestions = $department->questions()->orderBy('sequence_number')->pluck('question_text', 'id');
        return view('admin.questions.create', compact('department', 'questionTypes', 'previousQuestions'));
    }

    public function store(Request $request, Department $department)
    {
        $validated = Validator::make($request->all(), [
            'question_text' => 'required|string|max:255',
            'revenue_range' => 'required|in:5m,5-10m,10m+',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'nullable|string|max:255',
            'option_d' => 'nullable|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'nullable|integer|min:0',
            'score_d' => 'nullable|integer|min:0',
            'sequence_number' => 'nullable|integer',
            'next_question_id_a' => 'nullable|exists:questions,id',
            'next_question_id_b' => 'nullable|exists:questions,id',
            'next_question_id_c' => 'nullable|exists:questions,id',
            'next_question_id_d' => 'nullable|exists:questions,id'
        ])->validate();

        $question = Question::create([
            'department_id' => $department->id,
            'revenue_range' => $validated['revenue_range'],
            'question_text' => $validated['question_text'],
            'option_a' => $validated['option_a'],
            'option_b' => $validated['option_b'],
            'option_c' => $validated['option_c'] ?? null,
            'option_d' => $validated['option_d'] ?? null,
            'score_a' => $validated['score_a'],
            'score_b' => $validated['score_b'],
            'score_c' => $validated['score_c'] ?? null,
            'score_d' => $validated['score_d'] ?? null,
            'is_active' => true,
        ]);

        // Create conditions for each option
        foreach (['a', 'b', 'c', 'd'] as $option) {
            if ($validated['option_' . $option]) {
                QuestionCondition::create([
                    'question_id' => $question->id,
                    'option' => strtoupper($option),
                    'sequence_number' => $validated['sequence_number'] ?? $department->questions()->count() + 1,
                    'next_question_id' => $validated['next_question_id_' . $option] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.departments.questions.index', $department)
            ->with('success', 'Question created successfully');
    }

    public function edit(Department $department, Question $question)
    {
        $question = $question->load('conditions');
        return view('admin.questions.edit', compact('department', 'question'));
    }

    public function update(Request $request, Department $department, Question $question)
    {
        $validated = Validator::make($request->all(), [
            'question_text' => 'required|string|max:255',
            'revenue_range' => 'required|in:5m,5-10m,10m+',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'nullable|string|max:255',
            'option_d' => 'nullable|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'nullable|integer|min:0',
            'score_d' => 'nullable|integer|min:0',
            'sequence_number' => 'nullable|integer',
            'next_question_id_a' => 'nullable|exists:questions,id',
            'next_question_id_b' => 'nullable|exists:questions,id',
            'next_question_id_c' => 'nullable|exists:questions,id',
            'next_question_id_d' => 'nullable|exists:questions,id'
        ])->validate();

        // Update the main question
        $question->update([
            'revenue_range' => $validated['revenue_range'],
            'question_text' => $validated['question_text'],
            'option_a' => $validated['option_a'],
            'option_b' => $validated['option_b'],
            'option_c' => $validated['option_c'] ?? null,
            'option_d' => $validated['option_d'] ?? null,
            'score_a' => $validated['score_a'],
            'score_b' => $validated['score_b'],
            'score_c' => $validated['score_c'] ?? null,
            'score_d' => $validated['score_d'] ?? null,
            'is_active' => true,
        ]);

        // Update or create the question conditions
        // First, delete existing conditions
        $question->conditions()->delete();
        
        // Create conditions for each option
        foreach (['a', 'b', 'c', 'd'] as $option) {
            if ($validated['option_' . $option]) {
                QuestionCondition::create([
                    'question_id' => $question->id,
                    'option' => strtoupper($option),
                    'sequence_number' => $validated['sequence_number'] ?? $department->questions()->count() + 1,
                    'next_question_id' => $validated['next_question_id_' . $option] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.departments.questions.index', $department)
            ->with('success', 'Question updated successfully');
    }

    public function destroy(Department $department, Question $question)
    {
        $question->delete();
        return redirect()->route('admin.departments.questions.index', $department)
            ->with('success', 'Question deleted successfully');
    }
}
