<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Department;
use App\Models\Question;
use App\Models\Assessment;

class ReactAdminController extends Controller
{
    /**
     * Get dashboard statistics for React admin
     */
    public function getDashboardStats()
    {
        try {
            $stats = [
                'users' => User::count(),
                'departments' => Department::count(),
                'questions' => Question::count(),
                'assessments' => Assessment::count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error in getDashboardStats: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get users for React admin
     */
    public function getUsers(Request $request)
    {
        try {
            $query = User::query();

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            // Include department relationship
            $query->with('department');
            
            // Pagination
            $users = $query->latest()->paginate(10);

            // Add status field for compatibility with our frontend
            $users->getCollection()->transform(function ($user) {
                $user->status = 'Active'; // Default status
                return $user;
            });

            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Error in getUsers: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Store a new user
     */
    public function storeUser(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'nullable|string|max:20',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,user',
                'status' => 'boolean',
                'customer_type' => 'required|in:lite,full'
            ]);
            
            $user = new User();
            $user->name = $validated['name'];
            $user->first_name = $validated['first_name'];
            $user->last_name = $validated['last_name'];
            $user->email = $validated['email'];
            $user->mobile = $validated['phone'] ?? null;
            $user->password = bcrypt($validated['password']);
            $user->role = $validated['role'];
            $user->customer_type = $validated['customer_type'];
            
            $user->save();
            
            return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating user: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Update an existing user
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            $rules = [
                'name' => 'required|string|max:255',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'role' => 'required|in:admin,user',
                'status' => 'boolean',
                'customer_type' => 'required|in:lite,full'
            ];
            
            // Only validate password if it's provided
            if ($request->filled('password')) {
                $rules['password'] = 'string|min:8';
            }
            
            $validated = $request->validate($rules);
            
            $user->name = $validated['name'];
            $user->first_name = $validated['first_name'];
            $user->last_name = $validated['last_name'];
            $user->email = $validated['email'];
            $user->mobile = $validated['phone'] ?? null;
            $user->role = $validated['role'];
            $user->customer_type = $validated['customer_type'];
            
            if ($request->filled('password')) {
                $user->password = bcrypt($validated['password']);
            }
            
            $user->save();
            
            return response()->json(['message' => 'User updated successfully', 'user' => $user]);
        } catch (\Exception $e) {
            \Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Delete a user
     */
    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get departments for React admin
     */
    public function getDepartments(Request $request)
    {
        try {
            $query = Department::query();

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('name', 'like', "%{$search}%");
            }

            // Filter by status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            // Include user count
            //$query->withCount('users');

            // Pagination
            $departments = $query->latest()->paginate(10);

            // Add manager field for compatibility with our frontend
            $departments->getCollection()->transform(function ($dept) {
               // $dept->manager = 'Not Assigned'; // Default manager
                $dept->status = $dept->is_active ? 'Active' : 'Inactive';
                return $dept;
            });

            return response()->json($departments);
        } catch (\Exception $e) {
            \Log::error('Error in getDepartments: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Store a new department
     */
    public function storeDepartment(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments',
                'is_active' => 'boolean',
            ]);
            
            $department = new Department();
            $department->name = $validated['name'];
            $department->is_active = $validated['is_active'] ?? true;
            $department->save();
            
            return response()->json([
                'message' => 'Department created successfully', 
                'department' => $department
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating department: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Update an existing department
     */
    public function updateDepartment(Request $request, $id)
    {
        try {
            $department = Department::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments,name,' . $id,
                'is_active' => 'boolean',
            ]);
            
            $department->name = $validated['name'];
            $department->is_active = $validated['is_active'] ?? $department->is_active;
            $department->save();
            
            return response()->json([
                'message' => 'Department updated successfully', 
                'department' => $department
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating department: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Delete a department
     */
    public function deleteDepartment($id)
    {
        try {
            $department = Department::findOrFail($id);
            if ($department->count() > 0) {
                return response()->json([
                    'error' => 'Cannot delete department with associated users. Please reassign users first.'
                ], 422);
            }
            $department->delete();
            return response()->json(['message' => 'Department deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Error deleting department: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}