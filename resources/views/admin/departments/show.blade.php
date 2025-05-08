@extends('layouts.admin')

@section('title', 'Department Details')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-header">
            <h5 class="card-title mb-0">Department Details</h5>
        </div>
        <div class="card-body">
            <div class="mb-3">
                <strong>Name:</strong> {{ $department->name }}
            </div>

            <div class="mb-3">
                <strong>Description:</strong> {{ $department->description }}
            </div>

            <div class="mb-3">
                <strong>Status:</strong> <span class="badge {{ $department->is_active ? 'bg-success' : 'bg-danger' }}">
                    {{ $department->is_active ? 'Active' : 'Inactive' }}
                </span>
            </div>

            <div class="mt-4">
                <a href="{{ route('admin.departments.edit', $department) }}" class="btn btn-primary">Edit</a>
                <a href="{{ route('admin.departments.index') }}" class="btn btn-secondary">Back</a>
            </div>
        </div>
    </div>
</div>
@endsection
