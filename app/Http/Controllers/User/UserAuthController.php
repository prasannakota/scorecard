<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        \Log::info('Login attempt', [
            'email' => $request->email,
            'method' => $request->method(),
            'url' => $request->url(),
            'session_id' => $request->session()->getId()
        ]);

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        \Log::info('Credentials validated', [
            'email' => $credentials['email']
        ]);

        if (Auth::guard('web')->attempt($credentials, $request->filled('remember'))) {
            \Log::info('Login successful');
            $request->session()->regenerate();
            
            // Get the intended URL from session or default to dashboard
            $intended = session()->pull('url.intended', 'dashboard');
            
            return redirect()->to($intended);
        }

        \Log::info('Login failed');
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:250|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[\d\W]).+$/'
            ],
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'mobile'     => 'required|string',
            'terms'      => 'accepted'
        ],[
            'password.regex' => 'Password should contain a number or symbol.',
        ]);


        $name = $request->first_name.' '.$request->last_name;
        $user = User::create([
            'name' => $name,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'mobile'     => $validated['mobile']
        ]);

        Auth::guard('web')->login($user);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        if ($request->method() === 'GET') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return view('auth.logout');
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('home');
    }
}
