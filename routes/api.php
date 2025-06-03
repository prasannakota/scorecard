<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AdviceController;
use App\Http\Controllers\Admin\BusinessCategoryController;
use Illuminate\Support\Facades\Storage;

Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/register', [UserAuthController::class, 'register']);
Route::middleware('auth:sanctum')->group( function () {
	Route::get('assessment/form-data', [AssessmentController::class, 'create']);
	Route::post('assessment', [AssessmentController::class, 'store']);
	Route::get('/assessment', [AssessmentController::class, 'getAssessment']);
	Route::get('/department', [DepartmentController::class, 'getDepartment']);
	Route::get('/assessment/questions', [AssessmentController::class, 'getQuestions']);
	Route::post('/assessment/answer', [AssessmentController::class, 'submitAnswer']);
	Route::post('/start-assessment', [AssessmentController::class, 'startAssessment']);
	Route::get('/assessment-status', [AssessmentController::class, 'checkAssessmentStatus']);
	Route::get('/assessment-answers/{assessmentId}', [AssessmentController::class, 'getAnswersByAssessment']);
	Route::put('/assessment-answers/{id}', [AssessmentController::class, 'updateAnswer']);
	Route::post('/update-score', [AssessmentController::class, 'updateScore']);
    Route::post('/user/feedback', [FeedbackController::class, 'store']);
    Route::post('/user/advice', [AdviceController::class, 'store']);
    Route::get('/business-category', [BusinessCategoryController::class, 'getBusinessCategory']);
    Route::post('/user/update', [UserAuthController::class, 'update']);
    Route::post('/update-user', [UserAuthController::class, 'updateProfile']);
});

// Storefront Manage Questions Endpoints
Route::get('/admin/questions', function () {
    // For demo, load from a JSON file or return mock data
    $data = Storage::disk('local')->exists('questions.json')
        ? json_decode(Storage::disk('local')->get('questions.json'), true)
        : [
            'questions' => [
                [
                    'id' => 'q1',
                    'text' => 'What is your favorite color?',
                    'options' => [
                        [ 'id' => 'o1', 'text' => 'Red', 'followUps' => ['q2'] ],
                        [ 'id' => 'o2', 'text' => 'Blue', 'followUps' => [] ],
                    ],
                ],
                [ 'id' => 'q2', 'text' => 'Why do you like red?', 'options' => [] ],
                [ 'id' => 'q3', 'text' => 'Why do you like blue?', 'options' => [] ],
            ]
        ];
    return response()->json($data);
});

Route::post('/admin/questions/save', function (\Illuminate\Http\Request $request) {
    $questions = $request->input('questions');
    Storage::disk('local')->put('questions.json', json_encode(['questions' => $questions], JSON_PRETTY_PRINT));
    return response()->json(['success' => true]);
});
