@extends('layouts.admin')
@section('content')
<div class="container">
    <h2>Mail Settings</h2>
    @if(session('success')) <div class="alert alert-success">{{ session('success') }}</div> @endif
    <form method="POST" action="{{ route('admin.mail_settings.update') }}">@csrf
        @php
        $fields = ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME', 'MAIL_PASSWORD', 'MAIL_ENCRYPTION', 'MAIL_FROM_ADDRESS', 'MAIL_FROM_NAME'];
        @endphp
        @foreach($fields as $field)
        <div class="mb-3">
            <label>{{ $field }}</label>
            <input type="text" name="{{ $field }}" class="form-control" value="{{ $settings[$field] ?? '' }}">
        </div>
        @endforeach
        <button type="submit" class="btn btn-primary">Save Settings</button>
    </form>
</div>
@endsection
