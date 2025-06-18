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
use App\Http\Controllers\Admin\FollowUpController;
use App\Http\Controllers\Auth\AdminAuthController;

Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/register', [UserAuthController::class, 'register']);
Route::get('/verify/{token}', [UserAuthController::class, 'verify'])->name('verify');
Route::post('/resend-verification', [UserAuthController::class, 'resendVerification']);
Route::post('/add-department', [DepartmentController::class, 'createDepartment']);
Route::get('/fetch-departments', [DepartmentController::class, 'getAllDepartment']);
Route::get('/fetch-questions', [AssessmentController::class, 'getAllQuestions']);

// React Admin API Routes (public)
Route::prefix('react-admin')->group(function () {
    Route::get('/dashboard/stats', [\App\Http\Controllers\ReactAdminController::class, 'getDashboardStats']);
    
    // User management
    Route::get('/users', [\App\Http\Controllers\ReactAdminController::class, 'getUsers']);
    Route::post('/users', [\App\Http\Controllers\ReactAdminController::class, 'storeUser']);
    Route::put('/users/{id}', [\App\Http\Controllers\ReactAdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [\App\Http\Controllers\ReactAdminController::class, 'deleteUser']);
    
    // Department management
    Route::get('/departments', [\App\Http\Controllers\ReactAdminController::class, 'getDepartments']);
    Route::post('/departments', [\App\Http\Controllers\ReactAdminController::class, 'storeDepartment']);
    Route::put('/departments/{id}', [\App\Http\Controllers\ReactAdminController::class, 'updateDepartment']);
    Route::delete('/departments/{id}', [\App\Http\Controllers\ReactAdminController::class, 'deleteDepartment']);
});

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
    Route::get('/users-by-super/{adminId}', [UserAuthController::class, 'getUsersBySuperUserId']);
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

// Questions
Route::post('/admin/questions/save', [\App\Http\Controllers\Admin\QuestionController::class, 'bulkStore'])
    ->name('admin.questions.bulk-store');


Route::post('/admin/options/saveOption', [\App\Http\Controllers\Admin\OptionController::class, 'store'])
    ->name('admin.questions.save-option');

Route::post('/admin/options/updateOption', [\App\Http\Controllers\Admin\OptionController::class, 'update'])
    ->name('admin.options.update-option');


Route::get('/admin/questions', [\App\Http\Controllers\Admin\QuestionController::class, 'getQuestions']);

Route::post('/follow-ups/save', [FollowUpController::class, 'saveFollowUps']);

// Admin API Routes
Route::prefix('admin')->middleware(['auth:admin'])->group(function () {

    Route::get('/check-auth', function () {
        return response()->json(['authenticated' => true]);
    });

    // Admin Routes are starting from here ...
    Route::post('/login', [AdminAuthController::class, 'login']);


    Route::get('/dashboard/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'getStats']);

    // Users
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'apiIndex']);
    Route::get('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'apiShow']);
    Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'apiStore']);
    Route::put('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'apiUpdate']);
    Route::delete('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'apiDestroy']);

    // Departments
    Route::get('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'apiIndex']);
    Route::get('/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'apiShow']);
    Route::post('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'apiStore']);
    Route::put('/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'apiUpdate']);
    Route::delete('/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'apiDestroy']);

    // Questions
    Route::get('/departments/{departmentId}/questions', [\App\Http\Controllers\Admin\QuestionController::class, 'apiIndex']);
    Route::get('/departments/{departmentId}/questions/{id}', [\App\Http\Controllers\Admin\QuestionController::class, 'apiShow']);
    Route::post('/departments/{departmentId}/questions', [\App\Http\Controllers\Admin\QuestionController::class, 'apiStore']);
    Route::put('/departments/{departmentId}/questions/{id}', [\App\Http\Controllers\Admin\QuestionController::class, 'apiUpdate']);
    Route::delete('/departments/{departmentId}/questions/{id}', [\App\Http\Controllers\Admin\QuestionController::class, 'apiDestroy']);

    // Email Templates
    Route::get('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'apiIndex']);
    Route::get('/email-templates/{id}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'apiShow']);
    Route::post('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'apiStore']);
    Route::put('/email-templates/{id}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'apiUpdate']);
    Route::delete('/email-templates/{id}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'apiDestroy']);

    // Mail Settings
    Route::get('/mail-settings', [\App\Http\Controllers\Admin\MailSettingController::class, 'apiIndex']);
    Route::post('/mail-settings', [\App\Http\Controllers\Admin\MailSettingController::class, 'apiUpdate']);

    // Email Logs
    Route::get('/email-logs', [\App\Http\Controllers\Admin\EmailLogController::class, 'apiIndex']);
});





