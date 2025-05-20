@extends('layouts.user-dashboard')

@section('title', 'Dashboard')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="fs-2 mb-3">
                <a href="{{ route('assessment.index') }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"></path>
                </svg>
                </a>
                Background
            </div>
            <sub>Total questions :6</sub>
            </div>

            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">{{ __('Company Assessment') }}</div>

                    <div class="card-body">
                        <form method="POST" action="{{ route('assessment.store') }}">
                            @csrf
                                                <label for="organization_name" class="col-md-4 col-form-label text-md-right">{{ __('Name of your Organization') }}</label>

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
                                                <label for="website_url" class="col-md-4 col-form-label text-md-right">{{ __('What is your company website (URL) ?') }}</label>

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
                                                <label for="industry_sector" class="col-md-4 col-form-label text-md-right">{{ __('Which industry or sector do you primarily operate in ?') }}</label>

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
                                                <label for="annual_revenue" class="col-md-4 col-form-label text-md-right">{{ __('What is your annual total revenue ?') }}</label>

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
                                                <label for="country" class="col-md-4 col-form-label text-md-right">{{ __('What country do you operate from?') }}</label>

                                                <div class="col-md-6">
                                                    <select id="country" class="form-control @error('country') is-invalid @enderror" name="country" required>
                                                        <option value="">Select Country</option>
                                                        @foreach($countryOptions as $option)
                                                            <option value="{{ $option }}" {{ old('country') == $option ? 'selected' : '' }}>{{ $option }}</option>
                                                        @endforeach
                                                    </select>

                                                    @error('country')
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label for="market_position" class="col-md-4 col-form-label text-md-right">{{ __('How are you positioned in the market?') }}</label>

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
                                                        {{ __('Next') }}
                                                    </button>
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
        </div>
    </div>
</div>
@endsection
