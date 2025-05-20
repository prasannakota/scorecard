@extends('layouts.admin')

@section('title', 'Manage Departments')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Departments</h2>
        <a href="{{ route('admin.departments.create') }}" class="btn btn-primary">Create New Department</a>
    </div>

    <div class="card">
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($departments as $department)
                    <tr>
                        <td>{{ $department->id }}</td>
                        <td>{{ $department->name }}</td>
                        <td>{{ $department->description }}</td>
                        <td>
                            <span class="badge {{ $department->is_active ? 'bg-success' : 'bg-danger' }}">
                                {{ $department->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td>
                            <a href="{{ route('admin.departments.show', $department) }}" class="btn btn-sm btn-info me-1">View</a>
                            <a href="{{ route('admin.departments.edit', $department) }}" class="btn btn-sm btn-primary me-1">Edit</a>
                            <a href="{{ route('admin.departments.questions.index', $department) }}" class="btn btn-sm btn-success me-1">Questions</a>
                            <form action="{{ route('admin.departments.destroy', $department) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            {{ $departments->links() }}
        </div>
    </div>
</div>
@endsection
