@extends('layouts.user-dashboard')

@section('content')
<div class="wrapper">
    <!-- Main Content -->
    <div class="main-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h4>User Profile</h4>
                        </div>
                        <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif
                    
                    <div class="nav-tabs-navigation">
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                                <li class="nav-item">
                                    <a href="#profile" data-toggle="tab" class="nav-link active">
                                        <i class="fa fa-user"></i> Profile
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#pre-assessment" data-toggle="tab" class="nav-link">
                                        <i class="fa fa-file"></i> Pre-Assessment Details
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane active" id="profile">
                            <div class="row">
                                <div class="col-md-6">
                                    <h4>User Information</h4>
                                    <p><strong>Name:</strong> {{ auth()->user()->name }}</p>
                                    <p><strong>Email:</strong> {{ auth()->user()->email }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" id="pre-assessment">
                            @if($assessment)
                                <div class="row">
                                    <div class="col-md-6">
                                        <h4>Pre-Assessment Details</h4>
                                        <div class="table-responsive">
                                            <table class="table">
                                                <tr>
                                                    <th>Organization Name</th>
                                                    <td>{{ $assessment->organization_name }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Website URL</th>
                                                    <td>{{ $assessment->website_url }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Industry Sector</th>
                                                    <td>{{ $assessment->industry_sector }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Annual Revenue</th>
                                                    <td>{{ $assessment->annual_revenue }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Country</th>
                                                    <td>{{ $assessment->country }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Market Position</th>
                                                    <td>{{ $assessment->market_position }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="mt-3">
                                            <a href="{{ route('profile.assessment.edit', $assessment->id) }}" class="btn btn-primary">
                                                <i class="fa fa-edit"></i> Edit Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            @else
                                <div class="alert alert-info">
                                    No pre-assessment details found. Please complete your assessment first.
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
