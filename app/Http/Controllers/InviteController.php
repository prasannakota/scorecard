<?php

namespace App\Http\Controllers;

use App\Mail\UserRegisteredMail;
use Illuminate\Http\Request;
use App\Models\Invite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\InviteUserMail;

class InviteController extends Controller
{
    public function create()
    {
        return view('admin.invite.create');
    }

    public function sendInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email|unique:invites,email',
        ]);

        $token = Str::random(32);

        $invite = Invite::create([
            'email' => $request->email,
            'token' => $token,
            'expires_at' => now()->addDays(7),
        ]);

        Mail::to($request->email)->send(new InviteUserMail($invite));

        return redirect()->route('invites.create')->with('success', 'Invitation sent successfully.');
    }

    public function accept($token)
    {
        $invite = Invite::where('token', $token)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        // Optional: mark as used if you want one-time invites
        $invite->used = true;
        $invite->save();

        // Redirect to homepage
        return redirect('/')->with('success', 'Invitation accepted!');
    }


    public function completeRegistration(Request $request, $token)
    {
        // Validate the invite token
        $invite = Invite::where('token', $token)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        // Validate the input
        $validated = $request->validate([
            'email' => 'required|email|max:250|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[\d\W]).+$/',
            ],
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'mobile'     => 'required|string|max:20',
            'terms'      => 'accepted',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'password.regex' => 'Password must contain at least one number or symbol.',
        ]);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')
                ->store('profile_pictures', 'public');
        }

        // Create user
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'mobile'     => $validated['mobile'],
            'profile_picture' => $validated['profile_picture'] ?? null,
        ]);

        // Mark the invite as used
        $invite->used = true;
        $invite->save();

        // Send welcome email
        Mail::to($user->email)->send(new UserRegisteredMail($user));

        // Redirect to dashboard (adjust route name if needed)
        return redirect()->route('admin.dashboard')->with('success', 'Registration completed successfully!');
    }

}
