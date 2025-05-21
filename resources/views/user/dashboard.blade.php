@extends('layouts.user-dashboard')

@section('title', 'Dashboard')

@section('content')
<div class="container-fluid">
    <h2 class="mb-4">Welcome, {{ auth()->user()->name }}</h2>
    
    <div class="row">
        <!-- Profile Card -->
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Profile Information</h5>
                    <p>Name: {{ auth()->user()->name }}</p>
                    <p>Email: {{ auth()->user()->email }}</p>
                    @if(auth()->user()->phone)
                        <p>Phone: {{ auth()->user()->phone }}</p>
                    @endif
                    @if(auth()->user()->address)
                        <p>Address: {{ auth()->user()->address }}</p>
                    @endif
                    <a href="{{ route('user.profile.show') }}" class="btn btn-primary">Update Profile</a>
                </div>
            </div>
        </div>

        <!-- Recent Assessments Card -->
        <div class="col-md-8 mb-4">
            <div class="card">
                <div class="card-body">

                    <h5 class="card-title">Recent Assessments</h5>
                    
                    @if($recentAssessments->isEmpty())
                       <p class="text-muted">No assessments yet. <a href="{{ route('assessment.create') }}" class="text-primary">Create your first assessment</a></p>
                    @else
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Score</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($recentAssessments as $assessment)
                                    <tr>
                                        <td>{{ $assessment->title }}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="progress me-2" style="width: 100px; height: 10px;">
                                                    <div class="progress-bar" role="progressbar" style="width: {{ $assessment->score }}%" aria-valuenow="{{ $assessment->score }}" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <span class="text-{{ $assessment->score >= 70 ? 'success' : ($assessment->score >= 40 ? 'warning' : 'danger') }}">{{ $assessment->score }}%</span>
                                            </div>
                                        </td>
                                        <td>{{ $assessment->created_at->format('Y-m-d H:i') }}</td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                       <a href="{{ route('assessment.index') }}" class="btn btn-primary">View All Assessments</a>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
