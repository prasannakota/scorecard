<?php

namespace App\Http\Controllers\User;

use App\Models\AssessmentBackground;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function index()
    {
        $user = Auth::user();
        $assessment = $user->assessmentBackgrounds()->latest()->first();

        return view('user.profile.index', compact('user', 'assessment'));
    }

    public function edit($id)
    {
        $user = auth()->user();
        $assessment = $user->assessmentBackgrounds()->findOrFail($id);

        return view('user.profile.edit', compact('assessment'));
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $assessment = $user->assessmentBackgrounds()->findOrFail($id);

        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'website_url' => 'required|url',
            'industry_sector' => 'required|in:Sporting Goods,Fishing equipments,Medical supplements',
            'annual_revenue' => 'required|in:5 million,5-10 million,Above 10 million',
            'country' => 'required|string|max:255',
            'market_position' => 'required|in:1,2,3,4,5,6,7,8,9,10',
        ]);

        $assessment->update($validated);

        return redirect()->route('profile')->with('success', 'Assessment details updated successfully.');
    }
}
