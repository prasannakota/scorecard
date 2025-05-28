@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Create Question for {{ $department->name }}</h3>
                </div>
                <div class="card-body">
                    <form action="{{ route('admin.departments.questions.store', $department) }}" method="POST">
                        @csrf
                        
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="question_text">Question Text</label>
                                    <textarea name="question_text" id="question_text" class="form-control @error('question_text') is-invalid @enderror" rows="3" required></textarea>
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
                                        <option value="5m">$5M</option>
                                        <option value="5-10m">$5M - $10M</option>
                                        <option value="10m+">$10M+</option>
                                    </select>
                                    @error('revenue_range')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>



                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="sequence_number">Sequence Number</label>
                                    <input type="number" name="sequence_number" id="sequence_number" class="form-control @error('sequence_number') is-invalid @enderror" 
                                           value="{{ $department->questions()->count() + 1 }}">
                                    @error('sequence_number')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <!-- Question Type and Options -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="card-title">Question Type and Options</h5>
                            </div>
                            <div class="card-body">
                                <div class="options-container">
                                    @foreach(['a', 'b', 'c', 'd'] as $option)
                                        <div class="option-group">
                                            <div class="form-group">
                                                <label>Option {{ strtoupper($option) }}</label>
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <input type="text" name="option_{{ $option }}" id="option_{{ $option }}" class="form-control @error('option_{{ $option }}') is-invalid @enderror" {{ $option === 'a' || $option === 'b' ? 'required' : '' }}>
                                                        @error('option_' . $option)
                                                            <div class="invalid-feedback">{{ $message }}</div>
                                                        @enderror
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label for="score_{{ $option }}">Score</label>
                                                        <input type="number" name="score_{{ $option }}" id="score_{{ $option }}" class="form-control @error('score_{{ $option }}') is-invalid @enderror" {{ $option === 'a' || $option === 'b' ? 'required' : '' }}>
                                                        @error('score_' . $option)
                                                            <div class="invalid-feedback">{{ $message }}</div>
                                                        @enderror
                                                    </div>
                                                    <div class="col-md-3">
                                                        <select name="next_question_id_{{ $option }}" id="next_question_id_{{ $option }}" class="form-control @error('next_question_id_{{ $option }}') is-invalid @enderror">
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

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Create Question</button>
                            <a href="{{ route('admin.departments.questions.index', $department) }}" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
