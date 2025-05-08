<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            if ($user->role === 'user') {
                $request->session()->regenerate();
                return redirect()->intended('dashboard'); // Changed from route('dashboard') to 'dashboard'
            }
            
            // Instead of logging out, redirect to admin login
            Auth::logout();
            return redirect()->route('admin.login')->with('warning', 'Please use the admin login page for admin accounts.');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function dashboard()
    {
        $user = auth()->user();
        $recentAssessments = $user->assessments()->latest()->take(5)->get();
        return view('user.dashboard', compact('recentAssessments'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }

    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'user',
        ]);

        Auth::login($user);
        return redirect()->route('dashboard');
    }

    public function showForgotPasswordForm()
    {
        return view('auth.passwords.email');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = \Illuminate\Foundation\Auth\SendsPasswordResetEmails::sendResetLinkEmail($request);

        return $status === \Illuminate\Foundation\Auth\SendsPasswordResetEmails::RESET_LINK_SENT
                    ? back()->with(['status' => __($status)])
                    : back()->withErrors(['email' => __($status)]);
    }

    public function showResetForm($token)
    {
        return view('auth.passwords.reset')->with(
            ['token' => $token]
        );
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = \Illuminate\Foundation\Auth\ResetsPasswords::reset($request);

        return $status === \Illuminate\Foundation\Auth\ResetsPasswords::PASSWORD_RESET
                    ? redirect()->route('login')->with('status', __($status))
                    : back()->withErrors(['email' => [__($status)]]);
    }
}
