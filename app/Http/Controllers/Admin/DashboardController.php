<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Department;
use App\Models\Question;
use App\Models\Assessment;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalUsers = User::count();
        $recentUsers = User::latest()->take(5)->get();
        
        return view('admin.dashboard', compact('totalUsers', 'recentUsers'));
    }

    /**
     * Get dashboard statistics for API
     */
    public function getStats()
    {
        $stats = [
            'users' => User::count(),
            'departments' => Department::count(),
            'questions' => Question::count(),
            'assessments' => Assessment::count(),
        ];

        return response()->json($stats);
    }
}
