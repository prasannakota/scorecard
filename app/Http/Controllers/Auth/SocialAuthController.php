<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\SocialiteManager;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{

    public function redirectToProvider($provider)
    {
        if ($provider !== 'google') {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            if ($provider !== 'google') {
                abort(404);
            }

            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();
            $fullName = $googleUser->name;
            $nameParts = explode(' ', $fullName, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

            if (!$user) {
                $user = User::create([
                    "first_name"=> $firstName,
                    "last_name"=> $lastName,
                    'name' => $fullName,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $googleUser->id,
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            return redirect(env('APP_URL') . "/social-login?token={$token}");

        } catch (\Exception $e) {
            return redirect(env('APP_URL') . '/login?error=google_failed');
        }
    }

}
