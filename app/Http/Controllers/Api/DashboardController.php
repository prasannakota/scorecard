<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        try {
            // User stats
            $totalUsers = User::count();
            $userChange = $this->calculatePercentChange('users');
            
            // Department stats
            $totalDepartments = Department::count();
            $departmentChange = $this->calculatePercentChange('departments');
            
            // Assessment stats
            $totalAssessments = Assessment::count();
            $assessmentChange = $this->calculatePercentChange('assessments');
            
            // Completion rate
            $completedAssessments = Assessment::where('status', 'completed')->count();
            $completionRate = $totalAssessments > 0 ? round(($completedAssessments / $totalAssessments) * 100) : 0;
            $completionRateChange = $this->calculateCompletionRateChange();
            
            return response()->json([
                'stats' => [
                    [
                        'name' => 'Total Users',
                        'value' => number_format($totalUsers),
                        'change' => ($userChange >= 0 ? '+' : '') . $userChange . '%',
                        'trend' => $userChange >= 0 ? 'up' : 'down'
                    ],
                    [
                        'name' => 'Departments',
                        'value' => number_format($totalDepartments),
                        'change' => ($departmentChange >= 0 ? '+' : '') . $departmentChange,
                        'trend' => $departmentChange >= 0 ? 'up' : 'down'
                    ],
                    [
                        'name' => 'Assessments',
                        'value' => number_format($totalAssessments),
                        'change' => ($assessmentChange >= 0 ? '+' : '') . $assessmentChange . '%',
                        'trend' => $assessmentChange >= 0 ? 'up' : 'down'
                    ],
                    [
                        'name' => 'Completion Rate',
                        'value' => $completionRate . '%',
                        'change' => ($completionRateChange >= 0 ? '+' : '') . $completionRateChange . '%',
                        'trend' => $completionRateChange >= 0 ? 'up' : 'down'
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch dashboard statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Calculate percent change for a given model
     *
     * @param string $model
     * @return float
     */
    private function calculatePercentChange($model)
    {
        $modelClass = null;
        
        switch ($model) {
            case 'users':
                $modelClass = User::class;
                break;
            case 'departments':
                $modelClass = Department::class;
                break;
            case 'assessments':
                $modelClass = Assessment::class;
                break;
            default:
                return 0;
        }
        
        // Current month count
        $currentCount = $modelClass::whereMonth('created_at', now()->month)
                                  ->whereYear('created_at', now()->year)
                                  ->count();
        
        // Previous month count
        $previousCount = $modelClass::whereMonth('created_at', now()->subMonth()->month)
                                   ->whereYear('created_at', now()->subMonth()->year)
                                   ->count();
        
        if ($previousCount == 0) {
            return $currentCount > 0 ? 100 : 0;
        }
        
        return round((($currentCount - $previousCount) / $previousCount) * 100, 1);
    }
    
    /**
     * Calculate completion rate change
     *
     * @return float
     */
    private function calculateCompletionRateChange()
    {
        // Current month completion rate
        $currentTotal = Assessment::whereMonth('created_at', now()->month)
                                 ->whereYear('created_at', now()->year)
                                 ->count();
        
        $currentCompleted = Assessment::whereMonth('created_at', now()->month)
                                     ->whereYear('created_at', now()->year)
                                     ->where('status', 'completed')
                                     ->count();
        
        $currentRate = $currentTotal > 0 ? ($currentCompleted / $currentTotal) * 100 : 0;
        
        // Previous month completion rate
        $previousTotal = Assessment::whereMonth('created_at', now()->subMonth()->month)
                                  ->whereYear('created_at', now()->subMonth()->year)
                                  ->count();
        
        $previousCompleted = Assessment::whereMonth('created_at', now()->subMonth()->month)
                                      ->whereYear('created_at', now()->subMonth()->year)
                                      ->where('status', 'completed')
                                      ->count();
        
        $previousRate = $previousTotal > 0 ? ($previousCompleted / $previousTotal) * 100 : 0;
        
        if ($previousRate == 0) {
            return $currentRate > 0 ? $currentRate : 0;
        }
        
        return round($currentRate - $previousRate, 1);
    }
}