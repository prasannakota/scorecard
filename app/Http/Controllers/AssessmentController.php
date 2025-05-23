<?php

namespace App\Http\Controllers;

use App\Models\AssessmentBackground;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Assessment;
use App\Models\AssessmentAnswer;
use function Termwind\ValueObjects\pr;

class AssessmentController extends Controller
{

    public function index()
    {
        $assessments = AssessmentBackground::where('user_id', auth()->id())->latest()->paginate(10);
        return view('user.assessment.index', compact('assessments'));
    }

    public function create()
    {
        $assessment = new AssessmentBackground();
        $result = [
            'industrySectorOptions' => $assessment->getIndustrySectorOptions(),
            'annualRevenueOptions' => $assessment->getAnnualRevenueOptions(),
            'marketPositionOptions' => $assessment->getMarketPositionOptions(),
            'countryOptions' => $assessment->getCountryOptions(),
        ];

        $metaInfo = (object)['message' => 'success'];
        return $this->sendResponse($result, $metaInfo);
    }

    public function getAssessment()
    {
        $userId = auth()->id(); 
        $assessment = AssessmentBackground::where('user_id', $userId)->first();

        if (!$assessment) {
            return $this->sendError(null, ['message' => 'No assessment found']);
        }

        return $this->sendResponse($assessment, ['message' => 'Assessment fetched successfully']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'website_url' => 'required|url',
            'industry_sector' => 'required|in:Sporting Goods,Fishing equipments,Medical supplements',
            'annual_revenue' => 'required|in:5 million,5-10 million,Above 10 million',
            'country' => 'required|string|max:255',
            'market_position' => 'required|in:1,2,3,4,5,6,7,8,9,10',
        ]);

        $userId = auth()->id();

        $assessment = AssessmentBackground::updateOrCreate(
            ['user_id' => $userId],
            [
                'organization_name' => $validated['organization_name'],
                'website_url' => $validated['website_url'],
                'industry_sector' => $validated['industry_sector'],
                'annual_revenue' => $validated['annual_revenue'],
                'country' => $validated['country'],
                'market_position' => $validated['market_position'],
            ]
        );

        return $this->sendResponse($assessment, ['message' => 'Assessment saved successfully']);
    }
    
    public function department()
    {
        $assessment = new Assessment();
        return view('user.assessment.department', []);
    }
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
