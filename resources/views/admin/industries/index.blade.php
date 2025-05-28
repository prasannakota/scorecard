@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h4 class="card-title">Industries</h4>
                        <div class="d-flex gap-2">
                            <form method="GET" action="{{ route('admin.industries.index') }}" class="d-flex">
                                <select name="sort" class="form-select form-select-sm">
                                    <option value="name" {{ $sortField === 'name' ? 'selected' : '' }}>Sort by Name</option>
                                    <option value="description" {{ $sortField === 'description' ? 'selected' : '' }}>Sort by Description</option>
                                    <option value="is_active" {{ $sortField === 'is_active' ? 'selected' : '' }}>Sort by Status</option>
                                </select>
                                <button type="submit" class="btn btn-sm btn-primary">
                                    <i class="fas fa-sort"></i> Sort
                                </button>
                            </form>
                            <a href="{{ route('admin.industries.create') }}" class="btn btn-primary">Add New Industry</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif

                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <a href="{{ route('admin.industries.index', ['sort' => 'name', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
                                            Name
                                            @if($sortField === 'name')
                                                <i class="fas fa-sort-{{ $sortDirection === 'asc' ? 'up' : 'down' }}"></i>
                                            @endif
                                        </a>
                                    </th>
                                    <th>
                                        <a href="{{ route('admin.industries.index', ['sort' => 'description', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
                                            Description
                                            @if($sortField === 'description')
                                                <i class="fas fa-sort-{{ $sortDirection === 'asc' ? 'up' : 'down' }}"></i>
                                            @endif
                                        </a>
                                    </th>
                                    <th>
                                        <a href="{{ route('admin.industries.index', ['sort' => 'is_active', 'direction' => $sortDirection === 'asc' ? 'desc' : 'asc']) }}">
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
                                @foreach($industries as $industry)
                                    <tr>
                                        <td>{{ $industry->name }}</td>
                                        <td>{{ $industry->description }}</td>
                                        <td>
                                            <span class="badge {{ $industry->is_active ? 'bg-success' : 'bg-danger' }} text-white">
                                                {{ $industry->is_active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </td>
                                        <td>
                                            <a href="{{ route('admin.industries.edit', $industry->id) }}" class="btn btn-sm btn-primary">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('admin.industries.destroy', $industry->id) }}" method="POST" class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this industry?')">
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
        </div>
    </div>
</div>
@endsection
