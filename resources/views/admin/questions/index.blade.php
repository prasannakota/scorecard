@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Questions for {{ $department->name }}</h3>
                    <div class="card-tools">
                        <a href="{{ route('admin.departments.questions.create', $department) }}" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Add Question
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Revenue Range</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($questions as $question)
                                <tr>
                                    <td>{{ $question->question_text }}</td>
                                    <td>
                                        @switch($question->revenue_range)
                                            @case('5m')
                                                <5 million
                                                @break
                                            @case('5-10m')
                                                5-10 million
                                                @break
                                            @case('10m+')
                                                >10 million
                                                @break
                                        @endswitch
                                    </td>
                                    <td>
                                        <span class="badge {{ $question->is_active ? 'bg-success' : 'bg-danger' }}">
                                            {{ $question->is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="btn-group">
                                            <a href="{{ route('admin.departments.questions.edit', [$department, $question]) }}" class="btn btn-sm btn-warning">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('admin.departments.questions.destroy', [$department, $question]) }}" method="POST" class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    {{ $questions->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
