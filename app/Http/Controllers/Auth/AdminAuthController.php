<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    protected $guard = 'admin';

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard($this->guard)->attempt($credentials)) {
            $user = Auth::guard($this->guard)->user();

            if ($user->role === 'admin') {
                Auth::shouldUse($this->guard);
                $request->session()->regenerate();

                return response()->json([
                    'success' => true,
                    'token' => session()->getId(),
                    'user' => $user,
                ]);
            }

            Auth::guard($this->guard)->logout();
            return response()->json([
                'success' => false,
                'message' => 'Only admin accounts can log in.',
            ], 403);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password.',
        ], 401);
    }

    public function logout(Request $request)
    {
        if ($request->method() === 'GET') {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return view('auth.logout');
        }

        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
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
