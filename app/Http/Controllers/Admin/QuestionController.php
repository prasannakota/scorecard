<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Department;
use App\Models\Industry;
use App\Models\QuestionCondition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function index(Department $department)
    {
        $sort = request('sort', 'created_at');
        $direction = request('direction', 'desc');

        // Map sort fields to database columns
        $sortMap = [
            'id' => 'id',
            'sequence_number' => 'sequence_number',
            'question_text' => 'question_text',
            'industry_id' => 'industry_id',
            'is_active' => 'is_active'
        ];

        $questions = $department->questions()
            ->with('conditions')
            ->when(isset($sortMap[$sort]), function ($query) use ($sort, $direction, $sortMap) {
                $query->orderBy($sortMap[$sort], $direction);
            })
            ->when(!isset($sortMap[$sort]), function ($query) use ($direction) {
                $query->orderBy('created_at', $direction);
            })
            ->paginate(10);
        return view('admin.questions.index', compact('department', 'questions'));
    }

    public function create(Department $department)
    {
        $industries = Industry::all();
        $previousQuestions = $department->questions()->orderBy('sequence_number')->pluck('question_text', 'id');
        return view('admin.questions.create', compact('department', 'industries', 'previousQuestions'));
    }

    public function store(Request $request, Department $department)
    {
        $validated = Validator::make($request->all(), [
            'question_text' => 'required|string|max:255',
            'industry_id' => 'required|exists:industries,id',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
            'option_e' => 'required|string|max:255',
            'option_f' => 'required|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'required|integer|min:0',
            'score_d' => 'required|integer|min:0',
            'score_e' => 'required|integer|min:0',
            'score_f' => 'required|integer|min:0',
            'sequence_number' => 'nullable|integer',
            'next_question_id_a' => 'nullable|exists:questions,id',
            'next_question_id_b' => 'nullable|exists:questions,id',
            'next_question_id_c' => 'nullable|exists:questions,id',
            'next_question_id_d' => 'nullable|exists:questions,id'
        ])->validate();

        $sequenceNumber = $validated['sequence_number'] ?? $department->questions()->count() + 1;

        $question = Question::create([
            'department_id' => $department->id,
            'industry_id' => $validated['industry_id'],
            'question_text' => $validated['question_text'],
            'option_a' => $validated['option_a'],
            'option_b' => $validated['option_b'],
            'option_c' => $validated['option_c'],
            'option_d' => $validated['option_d'],
            'option_e' => $validated['option_e'],
            'option_f' => $validated['option_f'],
            'score_a' => $validated['score_a'],
            'score_b' => $validated['score_b'],
            'score_c' => $validated['score_c'],
            'score_d' => $validated['score_d'],
            'score_e' => $validated['score_e'],
            'score_f' => $validated['score_f'],
            'sequence_number' => $sequenceNumber,
            'is_active' => true,
        ]);

        // Create conditions for each option
        foreach (['a', 'b', 'c', 'd', 'e', 'f'] as $option) {
            if ($validated['option_' . $option]) {
                QuestionCondition::create([
                    'question_id' => $question->id,
                    'option' => strtoupper($option),
                    'sequence_number' => $sequenceNumber,
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
        $industries = Industry::all();
        return view('admin.questions.edit', compact('department', 'question', 'industries'));
    }

    public function update(Request $request, Department $department, Question $question)
    {
        $validated = Validator::make($request->all(), [
            'question_text' => 'required|string|max:255',
            'industry_id' => 'required|exists:industries,id',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
            'option_e' => 'required|string|max:255',
            'option_f' => 'required|string|max:255',
            'score_a' => 'required|integer|min:0',
            'score_b' => 'required|integer|min:0',
            'score_c' => 'required|integer|min:0',
            'score_d' => 'required|integer|min:0',
            'score_e' => 'required|integer|min:0',
            'score_f' => 'required|integer|min:0',
            'sequence_number' => 'nullable|integer',
            'next_question_id_a' => 'nullable|exists:questions,id',
            'next_question_id_b' => 'nullable|exists:questions,id',
            'next_question_id_c' => 'nullable|exists:questions,id',
            'next_question_id_d' => 'nullable|exists:questions,id'
        ])->validate();

        // Update the main question
        $question->update([
            'sequence_number' => $validated['sequence_number'],
            'industry_id' => $validated['industry_id'],
            'question_text' => $validated['question_text'],
            'option_a' => $validated['option_a'],
            'option_b' => $validated['option_b'],
            'option_c' => $validated['option_c'],
            'option_d' => $validated['option_d'],
            'option_e' => $validated['option_e'],
            'option_f' => $validated['option_f'],
            'score_a' => $validated['score_a'],
            'score_b' => $validated['score_b'],
            'score_c' => $validated['score_c'],
            'score_d' => $validated['score_d'],
            'score_e' => $validated['score_e'],
            'score_f' => $validated['score_f'],
            'is_active' => $request->has('is_active'),
        ]);

        // Update or create conditions for each option
        foreach (['a', 'b', 'c', 'd', 'e', 'f'] as $option) {
            if ($validated['option_' . $option]) {
                $condition = $question->conditions()->where('option', strtoupper($option))->firstOrNew([
                    'question_id' => $question->id,
                    'option' => strtoupper($option)
                ]);
                $condition->update([
                    'sequence_number' => $validated['sequence_number'],
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



    public function bulkStore(Request $request, Department $department)
    {
        $questions = $request->input('questions', []);
        $savedQuestions = [];

        foreach ($questions as $q) {
            $isNew = $q['isNew'] ?? true;

            // Common required fields with defaults
            $q['question_text'] = $q['text'] ?? 'Sample Question';
            $q['department_id'] = $q['department_id'] ?? 8;
            $q['option_a'] = $q['option_a'] ?? 'Option A';
            $q['option_b'] = $q['option_b'] ?? 'Option B';
            $q['option_c'] = $q['option_c'] ?? 'Option C';
            $q['option_d'] = $q['option_d'] ?? 'Option D';
            $q['option_e'] = $q['option_e'] ?? 'Option E';
            $q['option_f'] = $q['option_f'] ?? 'Option F';
            $q['score_a'] = $q['score_a'] ?? 0;
            $q['score_b'] = $q['score_b'] ?? 1;
            $q['score_c'] = $q['score_c'] ?? 2;
            $q['score_d'] = $q['score_d'] ?? 3;
            $q['score_e'] = $q['score_e'] ?? 4;
            $q['score_f'] = $q['score_f'] ?? 5;

            $validator = Validator::make($q, [
                'question_text' => 'required|string|max:255',
                'department_id' => 'required|integer',
                'option_a' => 'required|string|max:255',
                'option_b' => 'required|string|max:255',
                'option_c' => 'required|string|max:255',
                'option_d' => 'required|string|max:255',
                'option_e' => 'required|string|max:255',
                'option_f' => 'required|string|max:255',
                'score_a' => 'required|integer|min:0',
                'score_b' => 'required|integer|min:0',
                'score_c' => 'required|integer|min:0',
                'score_d' => 'required|integer|min:0',
                'score_e' => 'required|integer|min:0',
                'score_f' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'question' => $q
                ], 422);
            }

            $validated = $validator->validated();

            if (!$isNew && !empty($q['id'])) {
                // Only try update if isNew is false and id exists
                $question = Question::find($q['id']);
                if ($question) {
                    $question->update($validated);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => "Question with ID {$q['id']} not found for update."
                    ], 404);
                }
            } else {
                // Always create new if isNew = true (ignore any ID sent)
                $question = Question::create($validated);
            }

            $savedQuestions[] = [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'department_id' => $question->department_id,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => count($savedQuestions) . ' question(s) saved successfully.',
            'questions' => $savedQuestions
        ]);
    }

    public function getQuestions()
    {
        $questions = Question::select('id', 'question_text')->orderBy('id', 'desc')->get();
        return response()->json($questions);
    }
}
