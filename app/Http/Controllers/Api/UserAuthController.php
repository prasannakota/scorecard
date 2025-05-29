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
                'terms'      => 'accepted',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ],[
                'password.regex' => 'Password should contain a number or symbol.',
            ]);

            // Handle file upload
            if ($request->hasFile('profile_picture')) {
                $path = $request->file('profile_picture')->store('profile_pictures', 'public');
                $validated['profile_picture'] = $path;
            }

            $name = $request->first_name.' '.$request->last_name;
            $user = User::create([
                'name' => $name,
                'email' => $validated['email'],
                'profile_picture' => $validated['profile_picture'] ?? null,
                'password' => Hash::make($validated['password']),
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
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

    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $request->validate([
            'business_category' => 'nullable|integer',
        ]);
        $user->business_category = $request->business_category;
        $user->save();
         return $this->sendResponse($user, 'User profile updated successfully.');
    }

}
