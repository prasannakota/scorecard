@extends('layouts.admin')
@section('content')
<div class="container">
    <h2>Create Email Template</h2>
    <form action="{{ route('admin.email_templates.store') }}" method="POST">@csrf
        <div class="mb-3">
            <label>Name</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Slug</label>
            <input type="text" name="slug" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Subject</label>
            <input type="text" name="subject" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Body (HTML allowed)</label>
            <textarea name="body" class="form-control" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('admin.email_templates.index') }}" class="btn btn-secondary">Back</a>
    </form>
</div>
@endsection
