<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function index(Department $department)
    {
        $questions = $department->questions()->latest()->paginate(10);
        return view('admin.questions.index', compact('department', 'questions'));
    }

    public function create(Department $department)
    {
        return view('admin.questions.create', compact('department'));
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
            'option_e' => 'nullable|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'nullable|integer|min:0',
            'score_d' => 'nullable|integer|min:0',
            'score_e' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ])->validate();

        $question = $department->questions()->create($validated);

        return redirect()->route('admin.departments.questions.index', $department)
            ->with('success', 'Question created successfully');
    }

    public function edit(Department $department, Question $question)
    {
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
            'option_e' => 'nullable|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'nullable|integer|min:0',
            'score_d' => 'nullable|integer|min:0',
            'score_e' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ])->validate();

        $question->update($validated);

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
