@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">{{ __('Navigation') }}</div>
                <div class="card-body">
                    <ul class="nav flex-column">
                        @if(Auth::user()->role === 'admin')
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('admin.industries.index') }}">
                                    <i class="fas fa-industry"></i> Industries
                                </a>
                            </li>
                        @endif
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>
                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <p>Welcome, {{ Auth::user()->name }}!</p>
                    <p>You are logged in as a {{ ucfirst(Auth::user()->role) }}.</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
