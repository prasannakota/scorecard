<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Admin\DepartmentController;

Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/register', [UserAuthController::class, 'register']);

Route::middleware('auth:sanctum')->group( function () {
	Route::get('assessment/form-data', [AssessmentController::class, 'create']);
	Route::post('assessment', [AssessmentController::class, 'store']);
	Route::get('/assessment', [AssessmentController::class, 'getAssessment']);
	Route::get('/department', [DepartmentController::class, 'getDepartment']);
});