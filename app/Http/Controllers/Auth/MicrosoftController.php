<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class MicrosoftController extends Controller
{
    public function redirectToMicrosoft()
    {
        return Socialite::driver('microsoft')->redirect();
    }

    public function handleMicrosoftCallback()
    {
        try {
            $microsoftUser = Socialite::driver('microsoft')->stateless()->user();
            $user = User::where('email', $microsoftUser->email)->first();
            $fullName = $microsoftUser->name;
            $nameParts = explode(' ', $fullName, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
            if (!$user) {
                $user = User::create([
                    "first_name" => $firstName,
                    "last_name" => $lastName,
                    'name' => $fullName,
                    'email' => $microsoftUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'provider_id' => $microsoftUser->id,
                    'provider'=>"microsoft"
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
