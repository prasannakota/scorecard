<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Assessment;
use App\Models\AssessmentAnswer;
use function Termwind\ValueObjects\pr;

class AssessmentController extends Controller
{
    public function start()
    {
        session()->forget('answers'); // Now this will execute
        $firstQuestion = Question::first();
        return redirect()->route('assessment.question', ['questionId' => $firstQuestion->id]);
    }

    public function showAllQuestions()
    {
        session()->forget('answers'); // clear old data if needed
        $questions = Question::all();
        return view('assessment.all_questions', compact('questions'));
    }

    public function storeAllAnswers(Request $request)
    {
        $totalScore = 0;
        $answersData = [];

        foreach ($request->input('answers') as $questionId => $selectedOption) {
            $question = Question::findOrFail($questionId);
            $score = $question['score_' . $selectedOption];

            $answersData[] = [
                'question_id' => $questionId,
                'selected_option' => $selectedOption,
                'score' => $score
            ];

            $totalScore += $score;
        }

        $assessment = Assessment::create(['total_score' => $totalScore]);

        foreach ($answersData as $answer) {
            AssessmentAnswer::create([
                'assessment_id' => $assessment->id,
                'question_id' => $answer['question_id'],
                'selected_option' => $answer['selected_option'],
                'score' => $answer['score'],
            ]);
        }

        return view('assessment.result', compact('assessment'));
    }

    public function showQuestion($questionId)
    {
        $question = Question::findOrFail($questionId);
        return view('assessment.question', compact('question'));
    }

    public function storeAnswer(Request $request, $questionId)
    {
        $question = Question::findOrFail($questionId);

        $score = $question['score_' . $request->selected_option];

        session()->push('answers', [
            'question_id' => $questionId,
            'selected_option' => $request->selected_option,
            'score' => $score
        ]);

        $nextQuestion = Question::where('id', '>', $questionId)->first();

        if ($nextQuestion) {
            return redirect()->route('assessment.question', ['questionId' => $nextQuestion->id]);
        } else {
            return redirect()->route('assessment.submit');
        }
    }

    public function submit()
    {
        $totalScore = collect(session('answers'))->sum('score');
        $assessment = Assessment::create(['total_score' => $totalScore]);
        foreach (session('answers') as $answer) {
            AssessmentAnswer::create([
                'assessment_id' => $assessment->id,
                'question_id' => $answer['question_id'],
                'selected_option' => $answer['selected_option'],
                'score' => $answer['score'],
            ]);
        }

        session()->forget('answers');
        return view('assessment.result', compact('assessment'));
    }
}
