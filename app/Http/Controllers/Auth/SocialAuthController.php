<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\SocialiteManager;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    protected $socialite;

    public function __construct(SocialiteManager $socialite)
    {
        $this->socialite = $socialite;
    }

    public function redirectToProvider($provider)
    {
        if ($provider !== 'google') {
            abort(404);
        }

        return $this->socialite->driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            if ($provider !== 'google') {
                abort(404);
            }

            $googleUser = $this->socialite->driver($provider)->user();

            // Check if user exists by email
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $googleUser->getId(),
                ]);
            }

            auth()->login($user);
            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Failed to login with Google. Please try again.');
        }
    }
}
