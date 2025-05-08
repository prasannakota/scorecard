<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Log;

class TestAuthController extends Controller
{
    public function testAuth(Request $request)
    {
        try {
            // Get email and password from request
            $email = $request->input('email', 'testadmin@test.com');
            $password = $request->input('password', 'test1234');

            // Find user
            $user = AdminUser::where('email', $email)->first();
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Check if password needs rehashing
            if (Hash::needsRehash($user->password)) {
                // Update with new hash
                $user->password = Hash::make($password);
                $user->save();
            }

            // Check password
            $passwordCheck = Hash::check($password, $user->password);
            
            if ($passwordCheck) {
                // Login with admin guard
                Auth::guard('admin')->login($user);
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'email' => $user->email,
                        'role' => $user->role
                    ]
                ]);
            }

            return response()->json([
                'error' => 'Invalid credentials',
                'details' => [
                    'email' => $email,
                    'password_hash' => $user->password,
                    'password_check' => $passwordCheck
                ]
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
