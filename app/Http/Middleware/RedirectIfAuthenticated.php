<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;
        
        // Check if this is an admin route
        if (in_array('admin', $guards)) {
            if (Auth::guard('admin')->check()) {
                $user = Auth::guard('admin')->user();
                if ($user && $user->isAdmin()) {
                    return $next($request);
                }
                return redirect()->route('admin.login');
            }
            return redirect()->route('admin.login');
        }

        // For non-admin routes
        foreach ($guards as $guard) {
            if ($guard === 'admin') {
                continue; // Skip admin guard for non-admin routes
            }
            
            if (Auth::guard($guard)->check()) {
                if ($guard === 'web') {
                    return redirect()->route('dashboard');
                }
                return redirect()->route('admin.dashboard');
            }
        }

        return $next($request);
    }
}
