@extends('layouts.admin')
@section('content')
<div class="container">
    <h2>Edit Email Template</h2>
    <form action="{{ route('admin.email_templates.update', $emailTemplate) }}" method="POST">@csrf @method('PUT')
        <div class="mb-3">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="{{ $emailTemplate->name }}" required>
        </div>
        <div class="mb-3">
            <label>Slug</label>
            <input type="text" name="slug" class="form-control" value="{{ $emailTemplate->slug }}" required>
        </div>
        <div class="mb-3">
            <label>Subject</label>
            <input type="text" name="subject" class="form-control" value="{{ $emailTemplate->subject }}" required>
        </div>
        <div class="mb-3">
            <label>Body</label>
            <textarea name="body" class="form-control" rows="5" required>{{ $emailTemplate->body }}</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('admin.email_templates.index') }}" class="btn btn-secondary">Back</a>
    </form>
</div>
@endsection
