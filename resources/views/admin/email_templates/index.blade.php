@extends('layouts.admin')
@section('content')
<div class="container">
    <h2>Email Templates</h2>
    <a href="{{ route('admin.email_templates.create') }}" class="btn btn-success mb-3">Create New Template</a>
    @if(session('success')) <div class="alert alert-success">{{ session('success') }}</div> @endif
    <table class="table table-bordered">
        <thead>
            <tr><th>ID</th><th>Name</th><th>Slug</th><th>Subject</th><th>Actions</th></tr>
        </thead>
        <tbody>
            @foreach($templates as $template)
            <tr>
                <td>{{ $template->id }}</td>
                <td>{{ $template->name }}</td>
                <td>{{ $template->slug }}</td>
                <td>{{ $template->subject }}</td>
                <td>
                    <a href="{{ route('admin.email_templates.edit', $template) }}" class="btn btn-warning btn-sm">Edit</a>
                    <form action="{{ route('admin.email_templates.destroy', $template) }}" method="POST" style="display:inline;">
                        @csrf @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you Sure to Delete?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
