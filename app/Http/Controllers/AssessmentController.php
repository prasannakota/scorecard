<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AssessmentController extends Controller
{
    public function index()
    {
        $assessments = Assessment::where('user_id', auth()->id())->latest()->paginate(10);
        return view('user.assessment.index', compact('assessments'));
    }

    public function create()
    {
        $assessment = new Assessment();
        return view('user.assessment.form', [
            'industrySectorOptions' => $assessment->getIndustrySectorOptions(),
            'annualRevenueOptions' => $assessment->getAnnualRevenueOptions(),
            'marketPositionOptions' => $assessment->getMarketPositionOptions()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'website_url' => 'required|url',
            'industry_sector' => 'required|in:Sporting Goods,Fishing equipments,Medical supplements',
            'annual_revenue' => 'required|in:5 million,5-10 million,Above 10 million',
            'country' => 'required|string|max:255',
            'market_position' => 'required|in:1,2,3,4,5,6,7,8,9,10',
        ]);

        $assessment = new Assessment();
        $assessment->user_id = auth()->id();
        $assessment->organization_name = $validated['organization_name'];
        $assessment->website_url = $validated['website_url'];
        $assessment->industry_sector = $validated['industry_sector'];
        $assessment->annual_revenue = $validated['annual_revenue'];
        $assessment->country = $validated['country'];
        $assessment->market_position = $validated['market_position'];
        $assessment->save();

        return redirect()->route('assessment.department')
            ->with('success', 'Assessment submitted successfully');
    }

    public function department()
    {
        $assessment = new Assessment();
        return view('user.assessment.department', []);
    }
}
