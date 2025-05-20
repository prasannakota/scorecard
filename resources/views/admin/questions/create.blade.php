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
                                        <option value="5m"><5 million</option>
                                        <option value="5-10m">5-10 million</option>
                                        <option value="10m+">>10 million</option>
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
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Options Grid -->
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <!-- Option A -->
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Option A</label>
                                                    <input type="text" name="option_a" class="form-control @error('option_a') is-invalid @enderror" required>
                                                    @error('option_a')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Score for A</label>
                                                    <input type="number" name="score_a" class="form-control @error('score_a') is-invalid @enderror" min="0" required>
                                                    @error('score_a')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Option B -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Option B</label>
                                                    <input type="text" name="option_b" class="form-control @error('option_b') is-invalid @enderror" required>
                                                    @error('option_b')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Score for B</label>
                                                    <input type="number" name="score_b" class="form-control @error('score_b') is-invalid @enderror" min="0" required>
                                                    @error('score_b')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Option C -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Option C</label>
                                                    <input type="text" name="option_c" class="form-control @error('option_c') is-invalid @enderror">
                                                    @error('option_c')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Score for C</label>
                                                    <input type="number" name="score_c" class="form-control @error('score_c') is-invalid @enderror" min="0">
                                                    @error('score_c')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Option D -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Option D</label>
                                                    <input type="text" name="option_d" class="form-control @error('option_d') is-invalid @enderror">
                                                    @error('option_d')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Score for D</label>
                                                    <input type="number" name="score_d" class="form-control @error('score_d') is-invalid @enderror" min="0">
                                                    @error('score_d')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Option E -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Option E</label>
                                                    <input type="text" name="option_e" class="form-control @error('option_e') is-invalid @enderror">
                                                    @error('option_e')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="form-group">
                                                    <label>Score for E</label>
                                                    <input type="number" name="score_e" class="form-control @error('score_e') is-invalid @enderror" min="0">
                                                    @error('score_e')
                                                        <div class="invalid-feedback">{{ $message }}</div>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
