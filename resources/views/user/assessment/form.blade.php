@extends('layouts.user')

@section('title', 'New Assessment')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Company Assessment') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('assessment.store') }}">
                        @csrf

                        <div class="form-group row">
                            <label for="organization_name" class="col-md-4 col-form-label text-md-right">{{ __('Organization Name') }}</label>

                            <div class="col-md-6">
                                <input id="organization_name" type="text" class="form-control @error('organization_name') is-invalid @enderror" name="organization_name" value="{{ old('organization_name') }}" required autocomplete="organization_name" autofocus>

                                @error('organization_name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="website_url" class="col-md-4 col-form-label text-md-right">{{ __('Company Website URL') }}</label>

                            <div class="col-md-6">
                                <input id="website_url" type="url" class="form-control @error('website_url') is-invalid @enderror" name="website_url" value="{{ old('website_url') }}" required autocomplete="website_url">

                                @error('website_url')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="industry_sector" class="col-md-4 col-form-label text-md-right">{{ __('Industry Sector') }}</label>

                            <div class="col-md-6">
                                <select id="industry_sector" class="form-control @error('industry_sector') is-invalid @enderror" name="industry_sector" required>
                                    <option value="">Select Industry Sector</option>
                                    @foreach($industrySectorOptions as $option)
                                        <option value="{{ $option }}" {{ old('industry_sector') == $option ? 'selected' : '' }}>{{ $option }}</option>
                                    @endforeach
                                </select>

                                @error('industry_sector')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="annual_revenue" class="col-md-4 col-form-label text-md-right">{{ __('Annual Revenue') }}</label>

                            <div class="col-md-6">
                                <select id="annual_revenue" class="form-control @error('annual_revenue') is-invalid @enderror" name="annual_revenue" required>
                                    <option value="">Select Revenue Range</option>
                                    @foreach($annualRevenueOptions as $option)
                                        <option value="{{ $option }}" {{ old('annual_revenue') == $option ? 'selected' : '' }}>{{ $option }}</option>
                                    @endforeach
                                </select>

                                @error('annual_revenue')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="country" class="col-md-4 col-form-label text-md-right">{{ __('Country') }}</label>

                            <div class="col-md-6">
                                <input id="country" type="text" class="form-control @error('country') is-invalid @enderror" name="country" value="{{ old('country') }}" required autocomplete="country">

                                @error('country')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="market_position" class="col-md-4 col-form-label text-md-right">{{ __('Market Position') }}</label>

                            <div class="col-md-6">
                                <select id="market_position" class="form-control @error('market_position') is-invalid @enderror" name="market_position" required>
                                    <option value="">Select Market Position</option>
                                    @foreach($marketPositionOptions as $option)
                                        <option value="{{ $option }}" {{ old('market_position') == $option ? 'selected' : '' }}>{{ $option }}</option>
                                    @endforeach
                                </select>

                                @error('market_position')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Submit Assessment') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
