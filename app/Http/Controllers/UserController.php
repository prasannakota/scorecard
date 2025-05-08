<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(User $user)
    {
        return view('user.profile.show', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user->update($validated);

        return redirect()->route('profile.show')
            ->with('success', 'Profile updated successfully');
    }

    public function assessmentIndex(Request $request)
    {
        $assessments = auth()->user()->assessments()->latest()->paginate(10);
        return view('user.assessment.index', compact('assessments'));
    }

    public function assessmentStore(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'score' => 'required|integer|min:0|max:100',
        ]);

        $assessment = \App\Models\Assessment::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'score' => $validated['score'],
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('assessment.index')
            ->with('success', 'Assessment submitted successfully');
    }

    public function assessmentCreate()
    {
        $departments = \App\Models\Department::where('is_active', true)->get();
        return view('user.assessment.create', compact('departments'));
    }

    public function showResetForm()
    {
        return view('user.password.reset');
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', function ($attribute, $value, $fail) {
                if (!Hash::check($value, auth()->user()->password)) {
                    $fail('The current password is incorrect.');
                }
            }],
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return redirect()->route('dashboard')
            ->with('success', 'Password updated successfully');
    }
}
