<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Admin\EmailTemplateController;
use App\Http\Controllers\Admin\MailSettingController;
use App\Http\Controllers\Admin\EmailLogController;


Route::get('/', function () {
    return view('app');
});

// Root route
//Route::get('/', [HomeController::class, 'index'])->name('home');

// Social Authentication Routes
use App\Http\Controllers\Auth\SocialAuthController;

Route::get('/auth/{provider}', [SocialAuthController::class, 'redirectToProvider'])->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])->name('social.callback');

// User Authentication Routes
Route::middleware(['web', 'guest'])->group(function () {
    Route::get('login', [\App\Http\Controllers\User\UserAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [\App\Http\Controllers\User\UserAuthController::class, 'login']);

    Route::get('register', [\App\Http\Controllers\User\UserAuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('register', [\App\Http\Controllers\User\UserAuthController::class, 'register']);

    // Password Reset Routes
    Route::get('password/reset', [\App\Http\Controllers\User\UserAuthController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('password/email', [\App\Http\Controllers\User\UserAuthController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('password/reset/{token}', [\App\Http\Controllers\User\UserAuthController::class, 'showResetForm'])->name('password.reset');
    Route::post('password/reset', [\App\Http\Controllers\User\UserAuthController::class, 'reset'])->name('password.update');
});

// Authenticated User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return view('dashboard');
    });

    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    Route::match(['get', 'post'], 'logout', [\App\Http\Controllers\User\UserAuthController::class, 'logout'])->name('logout');
    Route::get('profile', [\App\Http\Controllers\User\ProfileController::class, 'index'])->name('profile.show');
    Route::get('profile/assessment/{id}/edit', [\App\Http\Controllers\User\ProfileController::class, 'edit'])->name('profile.assessment.edit');
    Route::put('profile/assessment/{id}', [\App\Http\Controllers\User\ProfileController::class, 'update'])->name('profile.assessment.update');
    
    // Assessment Routes
    Route::get('assessment', [AssessmentController::class, 'index'])->name('assessment.index');
    Route::get('assessment/create', [AssessmentController::class, 'create'])->name('assessment.create');
    Route::get('assessment/department', [AssessmentController::class, 'department'])->name('assessment.department');
    Route::post('assessment', [AssessmentController::class, 'store'])->name('assessment.store');

    Route::get('/assessment/start', [AssessmentController::class, 'showAllQuestions'])->name('assessment.start');
    Route::post('/assessment/submit-all', [AssessmentController::class, 'storeAllAnswers'])->name('assessment.submit');

    Route::get('/assessment/question/{questionId}', [AssessmentController::class, 'showQuestion'])->name('assessment.question');
    Route::post('/assessment/answer/{questionId}', [AssessmentController::class, 'storeAnswer']);
    Route::get('/assessment/submit', [AssessmentController::class, 'submit'])->name('assessment.submit');
    
    //Route::get('assessment/{assessment}', [AssessmentController::class, 'show'])->name('assessment.show');

    //Route::get('assessment/{assessment}/edit', [AssessmentController::class, 'edit'])->name('assessment.edit');
    //Route::put('assessment/{assessment}', [AssessmentController::class, 'update'])->name('assessment.update');
    //Route::delete('assessment/{assessment}', [AssessmentController::class, 'destroy'])->name('assessment.destroy');

    // Password Reset Routes for authenticated users
    Route::get('password/reset-form', [UserAuthController::class, 'showResetForm'])->name('password.reset.form');
    Route::put('password/reset', [UserAuthController::class, 'resetPassword'])->name('password.reset');

    Route::get('profile', [UserAuthController::class, 'showProfile'])->name('user.profile.show');
    Route::put('profile', [UserAuthController::class, 'updateProfile'])->name('user.profile.update');

});

// Admin Routes
Route::prefix('admin')->group(function () {
    // Authentication Routes
    Route::get('login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::get('logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('admin.logout.post');

    // Test routes
    Route::get('test-login', [\App\Http\Controllers\Admin\TestAdminAuthController::class, 'testLogin'])->name('admin.test.login');
    Route::get('test-check-auth', [\App\Http\Controllers\Admin\TestAdminAuthController::class, 'testCheckAuth'])->name('admin.test.check-auth');
    Route::post('test-auth', [\App\Http\Controllers\Admin\TestAuthController::class, 'testAuth'])->name('admin.test.auth');
    Route::get('test-auth', function () {
        return view('admin.auth.test');
    })->name('admin.test.page');

    // CSRF-exempt test route
    Route::post('test-auth-direct', function (Request $request) {
        try {
            $email = $request->input('email', 'testadmin@test.com');
            $password = $request->input('password', 'test1234');

    // Test page route
    Route::get('test-auth-direct', function () {
        return view('admin.auth.test-direct');
    })->name('admin.test.direct.page');

            // Find user
            $user = \App\Models\AdminUser::where('email', $email)->first();
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Check password
            $passwordCheck = \Hash::check($password, $user->password);
            
            if ($passwordCheck) {
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'email' => $user->email,
                        'role' => $user->role
                    ]
                ]);
            }

            return response()->json([
                'error' => 'Invalid credentials',
                'details' => [
                    'email' => $email,
                    'password_hash' => $user->password,
                    'password_check' => $passwordCheck
                ]
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal error',
                'message' => $e->getMessage()
            ], 500);
        }
    })->withoutMiddleware(['web'])->name('admin.test.direct');

    // Protected admin routes
    Route::middleware(['auth:admin'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
        
        // Profile
        Route::get('profile', [AdminAuthController::class, 'show'])->name('profile.show');
        Route::put('profile', [AdminAuthController::class, 'update'])->name('profile.update');
        
        // Assessment
        Route::get('assessment', [AdminAuthController::class, 'adminAssessmentIndex'])->name('admin.assessment.index');
        Route::post('assessment', [AdminAuthController::class, 'adminAssessmentStore'])->name('admin.assessment.store');
        Route::get('assessment/create', [AdminAuthController::class, 'adminAssessmentCreate'])->name('admin.assessment.create');
        
        // Password Reset
        Route::get('password/reset', [AdminAuthController::class, 'adminShowResetForm'])->name('admin.password.reset.form');
        Route::put('password/reset', [AdminAuthController::class, 'adminResetPassword'])->name('admin.password.reset');

        // Departments
        Route::resource('departments', \App\Http\Controllers\Admin\DepartmentController::class, [
            'names' => [
                'index' => 'admin.departments.index',
                'create' => 'admin.departments.create',
                'store' => 'admin.departments.store',
                'show' => 'admin.departments.show',
                'edit' => 'admin.departments.edit',
                'update' => 'admin.departments.update',
                'destroy' => 'admin.departments.destroy'
            ]
        ]);

        // Users
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class, [
            'names' => [
                'index' => 'admin.users.index',
                'create' => 'admin.users.create',
                'store' => 'admin.users.store',
                'show' => 'admin.users.show',
                'edit' => 'admin.users.edit',
                'update' => 'admin.users.update',
                'destroy' => 'admin.users.destroy'
            ]
        ]);

        // Questions
        Route::resource('departments.questions', \App\Http\Controllers\Admin\QuestionController::class, [
            'names' => [
                'index' => 'admin.departments.questions.index',
                'create' => 'admin.departments.questions.create',
                'store' => 'admin.departments.questions.store',
                'show' => 'admin.departments.questions.show',
                'edit' => 'admin.departments.questions.edit',
                'update' => 'admin.departments.questions.update',
                'destroy' => 'admin.departments.questions.destroy'
            ]
        ]);
        
        // Industries
        Route::resource('industries', \App\Http\Controllers\Admin\IndustryController::class, [
            'names' => [
                'index' => 'admin.industries.index',
                'create' => 'admin.industries.create',
                'store' => 'admin.industries.store',
                'show' => 'admin.industries.show',
                'edit' => 'admin.industries.edit',
                'update' => 'admin.industries.update',
                'destroy' => 'admin.industries.destroy'
            ]
        ]);

        // Business Categories
        Route::resource('business_categories', \App\Http\Controllers\Admin\BusinessCategoryController::class, [
            'names' => [
                'index' => 'admin.business_categories.index',
                'create' => 'admin.business_categories.create',
                'store' => 'admin.business_categories.store',
                'show' => 'admin.business_categories.show',
                'edit' => 'admin.business_categories.edit',
                'update' => 'admin.business_categories.update',
                'destroy' => 'admin.business_categories.destroy'
            ]
        ]);

        // 📩 Email Templates, Mail Settings, Email Logs
        Route::resource('email-templates', EmailTemplateController::class, [
            'names' => [
                'index' => 'admin.email_templates.index',
                'create' => 'admin.email_templates.create',
                'store' => 'admin.email_templates.store',
                'show' => 'admin.email_templates.show',
                'edit' => 'admin.email_templates.edit',
                'update' => 'admin.email_templates.update',
                'destroy' => 'admin.email_templates.destroy'
            ]
        ]);

        Route::get('mail-settings', [MailSettingController::class, 'index'])->name('admin.mail_settings.index');
        Route::post('mail-settings', [MailSettingController::class, 'update'])->name('admin.mail_settings.update');

        Route::get('email-logs', [EmailLogController::class, 'index'])->name('admin.email_logs.index');


    });
});

// Test route
Route::get('/test', function () {
    return view('test');
})->name('test');





