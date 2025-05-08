<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    protected $guard = 'admin';

    // Authentication Methods
    public function showLoginForm()
    {
        return view('auth.admin-login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to authenticate with admin guard
        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();
            
            if ($user->role === 'admin') {
                // Set the default guard to admin
                Auth::shouldUse('admin');
                
                $request->session()->regenerate();
                return redirect()->intended(route('admin.dashboard'));
            }
            
            Auth::guard('admin')->logout();
            return back()->withErrors([
                'email' => 'The provided credentials do not belong to an admin account.',
            ]);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.auth.login');
    }

    // Dashboard Methods
    public function dashboard()
    {
        return view('admin.dashboard');
    }

    // Profile Methods
    public function show(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        return view('admin.profile.show', compact('admin'));
    }

    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
        ]);

        $admin->update($validated);

        return redirect()->route('admin.profile.show')
            ->with('success', 'Profile updated successfully');
    }

    // Assessment Methods
    public function adminAssessmentIndex()
    {
        return view('admin.assessment.index');
    }

    public function adminAssessmentStore(Request $request)
    {
        // Add your admin assessment store logic here
        return redirect()->route('admin.assessment.index')
            ->with('success', 'Assessment submitted successfully');
    }

    public function adminAssessmentCreate()
    {
        return view('admin.assessment.create');
    }

    // Password Reset Methods
    public function adminShowResetForm()
    {
        return view('admin.password.reset');
    }

    public function adminResetPassword(Request $request)
    {
        // Add your admin password reset logic here
        return redirect()->route('admin.dashboard')
            ->with('success', 'Password reset successfully');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
