@extends('layouts.admin')

{{--@section('title', 'Manage Users')--}}

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2> View Users</h2>
    </div>
    <div class="d-flex gap-2 mb-3 align-items-center">
        <a href="{{ route('admin.users.create') }}" class="btn btn-primary">Add</a>

        <button id="toggle-filters" type="button" class="btn btn-outline-secondary d-flex align-items-center">
            <i class="bi bi-funnel-fill me-1"></i> Filters
        </button>
    </div>

    <!-- Filter Form (Initially Hidden) -->
    <form method="GET" action="{{ route('admin.users.index') }}" id="filter-form" class="row g-3 mb-4 d-none">
        <div class="col-md-4">
            <input type="text" name="name" class="form-control" placeholder="Filter by Name" value="{{ request('name') }}">
        </div>
        <div class="col-md-4">
            <input type="text" name="email" class="form-control" placeholder="Filter by Email" value="{{ request('email') }}">
        </div>
        <div class="col-md-3">
            <select name="role" class="form-select">
                <option value="">All Roles</option>
                <option value="user" {{ request('role') == 'user' ? 'selected' : '' }}>User</option>
                <option value="collaborator" {{ request('role') == 'collaborator' ? 'selected' : '' }}>Collaborator</option>
                <option value="admin" {{ request('role') == 'admin' ? 'selected' : '' }}>Admin</option>
            </select>
        </div>
        <div class="col-md-1">
            <button type="submit" class="btn btn-secondary w-100">Apply</button>
        </div>
    </form>


    <div class="card">
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                        <tr>
                            <td>{{ $user->id }}</td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>
                                @switch($user->role)
                                    @case('user')
                                        <span class="badge bg-info">User</span>
                                        @break
                                    @case('collaborator')
                                        <span class="badge bg-warning">Collaborator</span>
                                        @break
                                    @case('admin')
                                        <span class="badge bg-danger">Admin</span>
                                        @break
                                @endswitch
                            </td>
                            <td>
                                <a href="{{ route('admin.users.edit', $user) }}" class="btn btn-sm btn-primary">Edit</a>
                                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

        <script>
            document.getElementById('toggle-filters').addEventListener('click', function () {
            document.getElementById('filter-form').classList.toggle('d-none');
        });
    </script>

@endsection
