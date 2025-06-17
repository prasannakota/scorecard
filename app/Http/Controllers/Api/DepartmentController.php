<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Get a list of all departments
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Department::query();
            
            // Apply search filter if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where('name', 'like', "%{$searchTerm}%");
            }
            
            // Get paginated results
            $perPage = $request->input('per_page', 10);
            $departments = $query->paginate($perPage);
            
            // Transform the data to include additional information
            $departments->getCollection()->transform(function ($department) {
                // Count employees in this department
                $employeeCount = User::where('department_id', $department->id)->count();
                
                // Get manager name (assuming the first user with manager role in the department)
                $manager = User::where('department_id', $department->id)
                              ->where('role', 'manager')
                              ->first();
                
                $managerName = $manager ? $manager->name : 'No Manager Assigned';
                
                // Determine status based on your application's logic
                $status = $department->active ? 'Active' : 'Inactive';
                
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'employees' => $employeeCount,
                    'manager' => $managerName,
                    'status' => $status,
                    'created_at' => $department->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $department->updated_at->format('Y-m-d H:i:s'),
                ];
            });
            
            return response()->json($departments);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch departments',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get department statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        try {
            $totalDepartments = Department::count();
            $activeDepartments = Department::where('active', true)->count();
            $inactiveDepartments = $totalDepartments - $activeDepartments;
            
            // Get new departments created this month
            $newDepartmentsThisMonth = Department::whereMonth('created_at', now()->month)
                                               ->whereYear('created_at', now()->year)
                                               ->count();
            
            return response()->json([
                'total' => $totalDepartments,
                'active' => $activeDepartments,
                'inactive' => $inactiveDepartments,
                'new_this_month' => $newDepartmentsThisMonth
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch department statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}