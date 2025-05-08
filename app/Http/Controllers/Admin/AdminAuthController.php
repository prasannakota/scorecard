<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    protected $guard = 'admin';

    public function __construct()
    {
        $this->middleware('guest:admin')->except(['logout', 'dashboard']);
    }

    public function showLoginForm()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.auth.login-simple');
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            // First, find the user by email
            $user = AdminUser::where('email', $request->email)->first();

            if ($user) {
                // Check if the user is an admin
                if (!$user->isAdmin()) {
                    return back()->withErrors([
                        'email' => 'The provided credentials do not belong to an admin account.',
                    ])->onlyInput('email');
                }

                // Verify password directly
                if (Hash::check($request->password, $user->password)) {
                    // Login with admin guard
                    Auth::guard('admin')->login($user);
                    $request->session()->regenerate();
                    return redirect()->intended(route('admin.dashboard'));
                }
            }

            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'An error occurred during login. Please try again.',
            ])->onlyInput('email');
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
}
