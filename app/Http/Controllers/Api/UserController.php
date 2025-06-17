<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Get a paginated list of users
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();
            
            // Apply search filter if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            }
            
            // Apply role filter if provided
            if ($request->has('role') && !empty($request->role)) {
                $query->where('role', $request->role);
            }
            
            // Apply status filter if provided
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }
            
            // Get paginated results
            $perPage = $request->input('per_page', 10);
            $users = $query->paginate($perPage);
            
            // Transform the data to include role and status
            $users->getCollection()->transform(function ($user) {
                // Determine role based on your application's logic
                // This is just an example - adjust according to your actual user roles implementation
                $role = 'User';
                if ($user->is_admin) {
                    $role = 'Admin';
                } elseif ($user->department_id) {
                    $role = 'Manager';
                }
                
                // Determine status based on your application's logic
                $status = $user->active ? 'Active' : 'Inactive';
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role,
                    'status' => $status,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
                ];
            });
            
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get user statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::where('active', true)->count();
            $inactiveUsers = $totalUsers - $activeUsers;
            $newUsersThisMonth = User::whereMonth('created_at', now()->month)
                                     ->whereYear('created_at', now()->year)
                                     ->count();
            
            // Calculate percentage change from previous month
            $lastMonthUsers = User::whereMonth('created_at', now()->subMonth()->month)
                                 ->whereYear('created_at', now()->subMonth()->year)
                                 ->count();
            
            $percentChange = 0;
            if ($lastMonthUsers > 0) {
                $percentChange = (($newUsersThisMonth - $lastMonthUsers) / $lastMonthUsers) * 100;
            }
            
            return response()->json([
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => $inactiveUsers,
                'new_this_month' => $newUsersThisMonth,
                'percent_change' => round($percentChange, 1),
                'trend' => $percentChange >= 0 ? 'up' : 'down'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch user statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}