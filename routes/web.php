<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AssessmentController;

// Root route
Route::get('/', function () {
    return view('welcome');
})->name('home');

// User Authentication Routes
Route::middleware(['web', 'guest'])->group(function () {
    Route::get('login', [UserAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [UserAuthController::class, 'login']);
    Route::post('logout', [UserAuthController::class, 'logout'])->name('logout');
    Route::get('register', [UserAuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('register', [UserAuthController::class, 'register']);

    // Password Reset Routes
    Route::get('password/reset', [UserAuthController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('password/email', [UserAuthController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('password/reset/{token}', [UserAuthController::class, 'showResetForm'])->name('password.reset');
    Route::post('password/reset', [UserAuthController::class, 'reset'])->name('password.update');
});

// Authenticated User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [UserAuthController::class, 'dashboard'])->name('dashboard');
    
    // Assessment Routes
    Route::get('assessment', [AssessmentController::class, 'index'])->name('assessment.index');
    Route::get('assessment/create', [AssessmentController::class, 'create'])->name('assessment.create');
    Route::get('assessment/department', [AssessmentController::class, 'department'])->name('assessment.department');
    Route::post('assessment', [AssessmentController::class, 'store'])->name('assessment.store');
    Route::get('assessment/{assessment}', [AssessmentController::class, 'show'])->name('assessment.show');
    Route::get('assessment/{assessment}/edit', [AssessmentController::class, 'edit'])->name('assessment.edit');
    Route::put('assessment/{assessment}', [AssessmentController::class, 'update'])->name('assessment.update');
    Route::delete('assessment/{assessment}', [AssessmentController::class, 'destroy'])->name('assessment.destroy');

    // Password Reset Routes for authenticated users
    Route::get('password/reset-form', [UserAuthController::class, 'showResetForm'])->name('password.reset.form');
    Route::put('password/reset', [UserAuthController::class, 'resetPassword'])->name('password.reset');
});

// Admin Routes
Route::prefix('admin')->group(function () {
    // Authentication Routes
    Route::get('login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

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
    });
});

// Test route
Route::get('/test', function () {
    return view('test');
})->name('test');
