<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Mail\UserRegisteredMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class UserAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::guard('web')->user();
             $token = $user->createToken('api-token')->plainTextToken;
            return response()->json([
                'success' => true,
                'user' => $user,
                 'token' => $token,
                'message' => 'Login successful'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function register(Request $request)
    {
        try {
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
                'mobile'     => $validated['mobile']
            ]);

            Mail::to($user->email)->send(new UserRegisteredMail($user));
            return $this->sendResponse($user, 'User registered successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation error.', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong.', $e->getMessage(), 500);
        }
    }
}
