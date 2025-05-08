<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated with admin guard
        if (!auth()->guard('admin')->check()) {
            return redirect()->route('admin.login');
        }

        // Get the user and verify admin role
        $user = auth()->guard('admin')->user();
        if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
            auth()->guard('admin')->logout();
            return redirect()->route('admin.login')->with('error', 'You do not have admin privileges.');
        }

        // Set the default guard to admin for this request
        auth()->shouldUse('admin');

        return $next($request);
    }
}
