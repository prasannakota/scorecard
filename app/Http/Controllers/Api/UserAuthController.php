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

            $adminId = $request->input('super_user_id') ?  $request->input('super_user_id') : null;


            $name = $request->first_name.' '.$request->last_name;
            $user = User::create([
                'name' => $name,
                'email' => $validated['email'],
                'profile_picture' => $validated['profile_picture'] ?? null,
                'password' => Hash::make($validated['password']),
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
                'mobile'     => $validated['mobile'],
                'super_user_id'     => $adminId
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

    public function updateProfile(Request $request, User $user)
    {
        try {
            $user = auth()->user(); //Always use authenticated user

            // Dynamically build validation rules based on inputs present
            $rules = [];

            if ($request->has('name')) {
                $rules['name'] = 'required|string|max:255';
            }

            if ($request->has('email')) {
                $rules['email'] = 'required|email|unique:users,email,' . $user->id;
            }

            if ($request->has('password')) {
                $rules['password'] = [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/^(?=.*[\d\W]).+$/'
                ];
            }

            $validated = $request->validate($rules, [
                'password.regex' => 'Password should contain a number or symbol.',
            ]);

            // Update name
            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            // Update email
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            // Update password
            if (isset($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $path = $file->store('profile_pictures', 'public');
                $user->profile_picture = $path;
            }

            $user->save();

            return $this->sendResponse($user->fresh(), 'Profile updated successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation error.', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong.', $e->getMessage(), 500);
        }
    }

    public function getUsersBySuperUserId($superUserId)
    {
        try {
            // Fetch users with this super_user_id
            $users = User::where('super_user_id', $superUserId)->get();

            return response()->json([
                'code' => 200,
                'data' => $users,
                'meta' => 'Users fetched successfully.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'code' => 422,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
