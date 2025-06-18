<?php

namespace App\Http\Controllers\Admin\React;

use App\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class Industries extends Controller
{
    // Get all industries (departments) with filters and pagination
    public function getIndustries(Request $request)
    {

        try {
            $query = Industry::query();

            if ($request->filled('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }
            $industries = $query->latest()->paginate(10);

            $industries->getCollection()->transform(function ($industry) {
                $industry->manager = 'Not Assigned'; // Optional default
                $industry->status = $industry->is_active ? 'Active' : 'Inactive';
                return $industry;
            });

            return response()->json($industries);
        } catch (\Exception $e) {
            Log::error('Error in getIndustries: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch industries'], 500);
        }
    }

    // Store new industry
    public function storeIndustry(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:industries,name',
                'is_active' => 'nullable|boolean',
            ]);

            $industry = Industry::create([
                'name' => $validated['name'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            return response()->json([
                'message' => 'Industry created successfully',
                'industry' => $industry,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating industry: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create industry'], 500);
        }
    }

    // Update industry
    public function updateIndustry(Request $request, $id)
    {
        try {
            $industry = Industry::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:industries,name,' . $id,
                'is_active' => 'nullable|boolean',
            ]);

            $industry->update([
                'name' => $validated['name'],
                'is_active' => $validated['is_active'] ?? $industry->is_active,
            ]);

            return response()->json([
                'message' => 'Industry updated successfully',
                'industry' => $industry,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating industry: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update industry'], 500);
        }
    }

    // Delete industry
    public function deleteIndustry($id)
    {
        try {
            $industry = Industry::findOrFail($id);

            if ($industry->count() > 0) {
                return response()->json([
                    'error' => 'Cannot delete industry with associated users. Please reassign them first.'
                ], 422);
            }
            $industry->delete();
            return response()->json(['message' => 'Industry deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting industry: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete industry'], 500);
        }
    }
}
