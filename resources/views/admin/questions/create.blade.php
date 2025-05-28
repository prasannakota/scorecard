@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Create Question for {{ $department->name }}</h3>
                </div>
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-12">
                            <form action="{{ route('admin.departments.questions.store', $department) }}" method="POST" class="needs-validation" novalidate>
                                @csrf
                                
                                <!-- Basic Information -->
                                <div class="card mb-4">
                                    <div class="card-header">
                                        <h5 class="card-title">Basic Information</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="question_text">Question Text</label>
                                                    <textarea name="question_text" id="question_text" class="form-control @error('question_text') is-invalid @enderror" rows="2" required></textarea>
                                                    @error('question_text')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="sequence_number">Sequence Number</label>
                                                    <input type="number" name="sequence_number" id="sequence_number" class="form-control" 
                                                           value="{{ old('sequence_number') ?? $department->questions()->count() + 1 }}" required>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="industry_id">Industry</label>
                                                    <select name="industry_id" id="industry_id" class="form-control @error('industry_id') is-invalid @enderror" required>
                                                        <option value="">Select Industry</option>
                                                        @foreach($industries as $industry)
                                                            <option value="{{ $industry->id }}">
                                                                {{ $industry->name }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                    @error('industry_id')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="is_active">Status</label>
                                                    <select name="is_active" id="is_active" class="form-control">
                                                        <option value="1" selected>Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Options -->
                                <div class="card mb-4">
                                    <div class="card-header">
                                        <h5 class="card-title">Options</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="options-container">
                                            @foreach(['a', 'b', 'c', 'd', 'e', 'f'] as $option)
                                                <div class="option-group">
                                                    <div class="form-group">
                                                        <div class="row">
                                                            <div class="col-md-3">
                                                                <label for="option_{{ $option }}">Option {{ strtoupper($option) }}</label>
                                                                <input type="text" name="option_{{ $option }}" id="option_{{ $option }}" class="form-control @error('option_' . $option) is-invalid @enderror" {{ $option === 'a' || $option === 'b' ? 'required' : '' }}>
                                                                @error('option_' . $option)
                                                                    <div class="invalid-feedback">{{ $message }}</div>
                                                                @enderror
                                                            </div>
                                                            <div class="col-md-2">
                                                                <label for="score_{{ $option }}">Score</label>
                                                                <input type="number" name="score_{{ $option }}" id="score_{{ $option }}" class="form-control @error('score_' . $option) is-invalid @enderror" {{ $option === 'a' || $option === 'b' ? 'required' : '' }}>
                                                                @error('score_' . $option)
                                                                    <div class="invalid-feedback">{{ $message }}</div>
                                                                @enderror
                                                            </div>
                                                            <div class="col-md-4">
                                                                <label for="next_question_id_{{ $option }}">Next Question</label>
                                                                <select name="next_question_id_{{ $option }}" id="next_question_id_{{ $option }}" class="form-control @error('next_question_id_' . $option) is-invalid @enderror">
                                                                    <option value="">Select Next Question</option>
                                                                    @foreach($department->questions as $nextQuestion)
                                                                        <option value="{{ $nextQuestion->id }}">
                                                                            {{ $nextQuestion->question_text }}
                                                                        </option>
                                                                    @endforeach
                                                                </select>
                                                                @error('next_question_id_' . $option)
                                                                    <div class="invalid-feedback">{{ $message }}</div>
                                                                @enderror
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="d-flex justify-content-end">
                                            <button type="submit" class="btn btn-primary">Create Question</button>
                                            <a href="{{ route('admin.departments.questions.index', $department) }}" class="btn btn-secondary ms-2">Cancel</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        margin-left: 270px;
    }
    .card-body {
        padding: 1.5rem;
    }
    .form-group {
        margin-bottom: 1rem;
    }
</style>

@section('scripts')
<script>
    $(document).ready(function() {
        // Initialize Bootstrap tooltips
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
