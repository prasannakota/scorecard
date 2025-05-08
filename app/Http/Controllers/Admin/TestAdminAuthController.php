<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class TestAdminAuthController extends Controller
{
    public function testLogin(Request $request)
    {
        $email = 'admin@test.com';
        $password = 'kspl@1234';

        // Check if user exists
        $user = \DB::table('admin_users')
            ->where('email', $email)
            ->first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found']);
        }

        // Verify password
        if (password_verify($password, $user->password)) {
            Auth::guard('admin')->loginUsingId($user->id);
            return response()->json(['success' => 'Login successful']);
        }

        return response()->json(['error' => 'Password mismatch']);
    }

    public function testCheckAuth()
    {
        if (Auth::guard('admin')->check()) {
            return response()->json(['success' => 'Authenticated']);
        }
        return response()->json(['error' => 'Not authenticated']);
    }
}
