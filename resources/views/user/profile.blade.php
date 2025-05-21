@extends('layouts.user-dashboard')

@section('title', 'Update Profile')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-8">
    <h2 class="mb-4">Update Profile</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <form action="{{ route('user.profile.update') }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label>First Name</label>
            <input type="text" name="first_name" class="form-control" value="{{ old('first_name', $user->first_name) }}">
            @error('first_name') <div class="text-danger">{{ $message }}</div> @enderror
        </div>

        <div class="mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" id="last_name" name="last_name"
                   class="form-control"
                   value="{{ old('last_name', $user->last_name) }}">
            @error('last_name')
            <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label>Work Email</label>
            <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" readonly>
            @error('email') <div class="text-danger">{{ $message }}</div> @enderror
        </div>
        {{-- Mobile --}}
        <div class="mb-3">
            <label for="mobile" class="form-label">Mobile</label>
            <input type="text" id="mobile" name="mobile"
                   class="form-control"
                   value="{{ old('mobile', $user->mobile) }}">
            @error('mobile')
            <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>

        {{-- Password --}}{{--
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password"
                   class="form-control @error('password') is-invalid @enderror"
                   name="password" required autocomplete="new-password">
            @error('password')
            <span class="invalid-feedback" role="alert"><strong>{{ $message }}</strong></span>
            @enderror
        </div>

        --}}{{-- Confirm Password --}}{{--
        <div class="mb-3">
            <label for="password-confirm" class="form-label">Confirm Password</label>
            <input id="password-confirm" type="password"
                   class="form-control" name="password_confirmation"
                   required autocomplete="new-password">
        </div>--}}

        <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
    </div>
</div>
@endsection
