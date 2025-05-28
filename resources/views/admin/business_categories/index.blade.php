@extends('layouts.admin')

@section('content')
<div class="card">
    <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
            <h3 class="card-title">Business Categories</h3>
            <div>
                <a href="{{ route('admin.business_categories.create') }}" class="btn btn-primary">
                    <i class="bi bi-plus-lg"></i> Add New
                </a>
            </div>
        </div>
    </div>
    <div class="card-body p-4">
        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <div class="d-flex gap-2 mb-3">
            <form method="GET" action="{{ route('admin.business_categories.index') }}" class="d-flex">
                <select name="sort" class="form-select form-select-sm">
                    <option value="name" {{ $sortField === 'name' ? 'selected' : '' }}>Sort by Name</option>
                    <option value="description" {{ $sortField === 'description' ? 'selected' : '' }}>Sort by Description</option>
                    <option value="is_active" {{ $sortField === 'is_active' ? 'selected' : '' }}>Sort by Status</option>
                </select>
                <button type="submit" class="btn btn-sm btn-primary">
                    <i class="fas fa-sort"></i> Sort
                </button>
            </form>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>
                            <a href="{{ route('admin.business_categories.index', ['sort' => 'name', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
                                Name
                                @if($sortField === 'name')
                                    <i class="fas fa-sort-{{ $sortDirection === 'asc' ? 'up' : 'down' }}"></i>
                                @endif
                            </a>
                        </th>
                        <th>
                            <a href="{{ route('admin.business_categories.index', ['sort' => 'description', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
                                Description
                                @if($sortField === 'description')
                                    <i class="fas fa-sort-{{ $sortDirection === 'asc' ? 'up' : 'down' }}"></i>
                                @endif
                            </a>
                        </th>
                        <th>
                            <a href="{{ route('admin.business_categories.index', ['sort' => 'is_active', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
                                Status
                                @if($sortField === 'is_active')
                                    <i class="fas fa-sort-{{ $sortDirection === 'asc' ? 'up' : 'down' }}"></i>
                                @endif
                            </a>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($businessCategories as $category)
                        <tr>
                            <td>{{ $category->name }}</td>
                            <td>{{ $category->description }}</td>
                            <td>
                                <span class="badge {{ $category->is_active ? 'bg-success' : 'bg-danger' }} text-white">
                                    {{ $category->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td>
                                <a href="{{ route('admin.business_categories.edit', $category->id) }}" class="btn btn-sm btn-primary">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <form action="{{ route('admin.business_categories.destroy', $category->id) }}" method="POST" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this business category?')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
