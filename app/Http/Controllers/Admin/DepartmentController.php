<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::latest()->paginate(10);
        return view('admin.departments.index', compact('departments'));
    }

    public function create()
    {
        return view('admin.departments.create');
    }

    public function store(Request $request)
    {
        try {
            // First, let's check if we can get the route
            $route = route('admin.departments.index');
            \Log::info('Route check:', ['route' => $route]);

            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments,name',
                'description' => 'nullable|string',
                'is_active' => 'nullable', // Changed to nullable without boolean
            ]);

            \Log::info('Validation passed:', ['data' => $validated]);

            // Prepare the data
            $data = [
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'slug' => Str::of($validated['name'])->slug(),
                'is_active' => $request->has('is_active'), // Changed to check if checkbox is checked
            ];

            \Log::info('Data prepared:', ['data' => $data]);

            // Try to create the department
            $department = Department::create($data);

            \Log::info('Department created:', ['id' => $department->id]);

            return redirect($route)
                ->with('success', 'Department created successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error:', [
                'errors' => $e->errors(),
                'validator' => $e->validator->errors()
            ]);
            
            return back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            \Log::error('General error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()
                ->withInput()
                ->with('error', 'Failed to create department: ' . $e->getMessage());
        }
    }

    public function show(Department $department)
    {
        return view('admin.departments.show', compact('department'));
    }

    public function edit(Department $department)
    {
        return view('admin.departments.edit', compact('department'));
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments')->ignore($department->id)],
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $department->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'slug' => Str::slug($validated['name']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    public function getDepartment()
    {
        try {
            $departments = Department::withCount('questions')->get(['id', 'name']);
            $meta = (object) ['message' => 'Department list fetched successfully'];
            return $this->sendResponse($departments, $meta);
        } catch (\Exception $e) {
            return $this->sendError('Failed to fetch departments', ['error' => $e->getMessage()], 500);
        }
    }
}
