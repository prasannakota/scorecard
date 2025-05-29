<?php

namespace App\Http\Controllers\Admin;

use App\Models\BusinessCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class BusinessCategoryController extends Controller
{
    public function index(Request $request)
    {
        $sortField = $request->input('sort', 'name');
        $sortDirection = $request->input('direction', 'asc');

        $businessCategories = BusinessCategory::orderBy($sortField, $sortDirection)->get();
        
        return view('admin.business_categories.index', compact('businessCategories', 'sortField', 'sortDirection'));
    }

    public function create()
    {
        return view('admin.business_categories.create');
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255|unique:business_categories',
                'description' => 'nullable|string',
                'is_active' => 'boolean|nullable'
            ]);

            // Get the TinyMCE content
            $description = $request->input('description', '');
            
            // Create the business category
            BusinessCategory::create([
                'name' => $validatedData['name'],
                'description' => $description,
                'is_active' => $request->has('is_active') ? true : false
            ]);

            return redirect()->route('admin.business_categories.index')
                ->with('success', 'Business category created successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create business category: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function edit(BusinessCategory $businessCategory)
    {
        return view('admin.business_categories.edit', compact('businessCategory'));
    }

    public function update(Request $request, BusinessCategory $businessCategory)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:business_categories,name,' . $businessCategory->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean|nullable'
        ]);

        $businessCategory->update([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'is_active' => $request->has('is_active') ? true : false
        ]);

        return redirect()->route('admin.business_categories.index')
            ->with('success', 'Business category updated successfully');
    }

    public function destroy(BusinessCategory $businessCategory)
    {
        $businessCategory->delete();

        return redirect()->route('admin.business_categories.index')
            ->with('success', 'Business category deleted successfully');
    }

    public function getBusinessCategory()
    {
        $businessCategory = BusinessCategory::where('is_active', 1)->get();
        $meta = [
            'total' => $businessCategory->count(),
            'timestamp' => now(),
        ];
        return $this->sendResponse($businessCategory, $meta);
    }


}
