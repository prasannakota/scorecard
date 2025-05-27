<?php

namespace App\Http\Controllers;

use App\Models\AssessmentBackground;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Assessment;
use App\Models\AssessmentAnswer;
use function Termwind\ValueObjects\pr;
use App\Models\Department;

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

    public function getQuestions(Request $request)
    {
        $departments = explode(',', $request->departments);
        $questions = Question::whereIn('department_id', $departments)->get();
        $departmentsData = Department::whereIn('id', $departments)->get();

        $result = [
            'questions' => $questions,
            'departments' => $departmentsData
        ];

        return $this->sendResponse($result, [
            'total_questions' => $questions->count(),
        ]);
    }

    public function submitAnswer(Request $request)
    {
        $user = auth()->user();
        $answer = AssessmentAnswer::updateOrCreate(
            [
                'assessment_id' => $request->assessment_id,
                'question_id' => $request->question_id,
                'user_id' =>  $user->id,
                'department_id' => $request->department_id,
            ],
            [
                'selected_option' => $request->selected_option,
                'score' => $request->score,
            ]
        );

        return $this->sendResponse($answer, ['status' => 'saved']);
    }


    public function startAssessment(Request $request)
    {
        $user = auth()->user();
        $departments = $request->input('departments', []);
        $departmentsString = implode(',', $departments);
        $assessment = Assessment::where('user_id', $user->id)->first();

        if ($assessment) {
            $assessment->department_id = $departmentsString;
            $assessment->save();

            $message = 'Assessment updated successfully!';
        } else {
            $assessment = Assessment::create([
                'user_name' => $user->name,
                'user_id' => $user->id,
                'total_score' => 0,
                'department_id' => $departmentsString,
            ]);

            $message = 'Assessment created successfully!';
        }

        return $this->sendResponse([
            'assessment_id' => $assessment->id,
            'message' => $message,
        ], []);
    }

    public function checkAssessmentStatus(Request $request)
    {
        $user = auth()->user();
        $latestAssessment = Assessment::where('user_id', $user->id)->latest()->first();
        if ($latestAssessment) {
            return $this->sendResponse([
                'assessment_id' => $latestAssessment->id,
                'departments' => $latestAssessment->department_id,
                'total_score' => $latestAssessment->total_score
            ], []);
        }

        return $this->sendResponse(null, [], 'No assessment found', 404);
    }

    public function getAnswersByAssessment($assessmentId)
    {
        $answers = AssessmentAnswer::where('assessment_id', $assessmentId)->get();
        return $this->sendResponse(
            $answers,
            ['message' => 'Answers retrieved successfully']
        );
    }


    public function updateAnswer(Request $request, $id)
    {
        $answer = AssessmentAnswer::findOrFail($id);
        $answer->selected_option = $request->selected_option;
        $answer->score = $request->score;

        $answer->save();

        return $this->sendResponse(
            $answer,
            ['message' => 'Answer updated successfully']
        );
    }

    public function updateScore(Request $request)
    {
        $user = auth()->user();
        $assessmentId = $request->input('assessment_id');
        $score = $request->input('score', 0); 

        $assessment = Assessment::where('id', $assessmentId)
                                ->where('user_id', $user->id)
                                ->first();

        if (!$assessment) {
            return $this->sendError('Assessment not found.', [], 404);
        }

        $assessment->total_score = $score;
        $assessment->save();

        return $this->sendResponse(
            $assessment,
            ['message' => 'Score updated successfully']
        );
    }
}
