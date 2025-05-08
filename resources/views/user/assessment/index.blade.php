@extends('layouts.user-dashboard')

@section('title', 'Assessments')

@section('content')
<div class="container-fluid">
    <h2 class="mb-4">Assessments</h2>
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <a href="{{ route('assessment.create') }}" class="btn btn-primary">New Assessment</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Score</th>
                        <th>Organization</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($assessments as $assessment)
                    <tr>
                        <td>{{ $assessment->title }}</td>
                        <td>{{ $assessment->description }}</td>
                        <td>{{ $assessment->score }}%</td>
                        <td>{{ $assessment->organization_name }}</td>
                        <td>{{ $assessment->created_at->format('Y-m-d H:i') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            {{ $assessments->links() }}
        </div>
    </div>
</div>
@endsection
