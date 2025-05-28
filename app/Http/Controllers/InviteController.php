<?php

namespace App\Http\Controllers;

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
        $invite = Invite::where('token', $token)->where('used', false)->where('expires_at', '>', now())->firstOrFail();
        return view('auth.register-invite', compact('invite'));
    }

    public function completeRegistration(Request $request, $token)
    {
        $invite = Invite::where('token', $token)->where('used', false)->where('expires_at', '>', now())->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $invite->email,
            'password' => bcrypt($request->password),
        ]);

        $invite->update(['used' => true]);

        auth()->login($user);

        return redirect('/home')->with('success', 'Welcome! You have been registered.');
    }

}
