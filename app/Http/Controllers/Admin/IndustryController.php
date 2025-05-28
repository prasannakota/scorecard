<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use Illuminate\Http\Request;

class IndustryController extends Controller
{
    public function index(Request $request)
    {
        $sortField = $request->input('sort', 'name'); // Default to name
        $sortDirection = $request->input('direction', 'asc'); // Default to ascending

        $industries = Industry::orderBy($sortField, $sortDirection)->get();
        
        return view('admin.industries.index', compact('industries', 'sortField', 'sortDirection'));
    }

    public function create()
    {
        return view('admin.industries.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:industries|max:255',
            'description' => 'nullable|max:1000',
            'is_active' => 'boolean'
        ]);

        Industry::create($validated);

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry type created successfully');
    }

    public function edit(Industry $industry)
    {
        return view('admin.industries.edit', compact('industry'));
    }

    public function update(Request $request, Industry $industry)
    {
        $validated = $request->validate([
            'name' => 'required|unique:industries,name,' . $industry->id . '|max:255',
            'description' => 'nullable|max:1000',
            'is_active' => 'boolean'
        ]);

        $industry->update($validated);

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry type updated successfully');
    }

    public function destroy(Industry $industry)
    {
        $industry->delete();

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry type deleted successfully');
    }
}
