@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Edit Question</h3>
        </div>
        <div class="card-body">
            <form action="{{ route('admin.departments.questions.update', [$department, $question]) }}" method="POST">
                @csrf
                @method('PUT')

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
                                    <textarea name="question_text" id="question_text" class="form-control @error('question_text') is-invalid @enderror" rows="3" required>{{ old('question_text', $question->question_text) }}</textarea>
                                    @error('question_text')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="revenue_range">Revenue Range</label>
                                    <select name="revenue_range" id="revenue_range" class="form-control @error('revenue_range') is-invalid @enderror" required>
                                        <option value="5m" {{ old('revenue_range', $question->revenue_range) === '5m' ? 'selected' : '' }}><5 million</option>
                                        <option value="5-10m" {{ old('revenue_range', $question->revenue_range) === '5-10m' ? 'selected' : '' }}>5-10 million</option>
                                        <option value="10m+" {{ old('revenue_range', $question->revenue_range) === '10m+' ? 'selected' : '' }}>10 million+</option>
                                    </select>
                                    @error('revenue_range')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="is_active">Status</label>
                                    <select name="is_active" id="is_active" class="form-control">
                                        <option value="1" {{ old('is_active', $question->is_active) ? 'selected' : '' }}>Active</option>
                                        <option value="0" {{ !old('is_active', $question->is_active) ? 'selected' : '' }}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="sequence_number">Sequence Number</label>
                                    <input type="number" name="sequence_number" id="sequence_number" class="form-control @error('sequence_number') is-invalid @enderror" value="{{ old('sequence_number', optional($question->condition)->sequence_number) }}">
                                    @error('sequence_number')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
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
                            @foreach(['a', 'b', 'c', 'd'] as $option)
                                <div class="option-group">
                                    <div class="form-group">
                                        <label>Option {{ strtoupper($option) }}</label>
                                        <div class="row">
                                             <div class="col-md-4">
                                                <input type="text" name="option_{{ $option }}" id="option_{{ $option }}" class="form-control @error('option_{{ $option }}') is-invalid @enderror" value="{{ old('option_' . $option, $question->{'option_' . $option}) }}">
                                                @error('option_' . $option)
                                                    <div class="invalid-feedback">{{ $message }}</div>
                                                @enderror
                                            </div>
                                            <div class="col-md-2">
                                                <label for="score_{{ $option }}">Score</label>
                                                <input type="number" name="score_{{ $option }}" id="score_{{ $option }}" class="form-control @error('score_{{ $option }}') is-invalid @enderror" value="{{ old('score_' . $option, $question->{'score_' . $option}) }}" {{ $option === 'a' || $option === 'b' ? 'required' : '' }}>
                                                @error('score_' . $option)
                                                    <div class="invalid-feedback">{{ $message }}</div>
                                                @enderror
                                            </div>
                                            <div class="col-md-3">
                                                <select name="next_question_id_{{ $option }}" id="next_question_id_{{ $option }}" class="form-control @error('next_question_id_{{ $option }}') is-invalid @enderror">
                                                    <option value="">Select Next Question</option>
                                                    @foreach($department->questions as $nextQuestion)
                                                        @if($nextQuestion->id !== $question->id)
                                                            <option value="{{ $nextQuestion->id }}" {{ old('next_question_id_' . $option, optional($question->conditions->where('option', strtoupper($option))->first())->next_question_id) === $nextQuestion->id ? 'selected' : '' }}>
                                                                {{ $nextQuestion->question_text }}
                                                            </option>
                                                        @endif
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
                        <button type="submit" class="btn btn-primary">Update Question</button>
                        <a href="{{ route('admin.departments.questions.index', $department) }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

@section('scripts')
<script>
    $(document).ready(function() {



    });
</script>
@endsection
</div>
@endsection
