<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AdviceController;

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

});