@extends('layouts.admin-react')

@section('content')
    <div id="admin-app">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="text-align: center;">
                <h2>Loading Admin Panel...</h2>
                <div style="display: inline-block; width: 50px; height: 50px; border: 5px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #2563eb; animation: spin 1s linear infinite;"></div>
                <style>
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </div>
        </div>
    </div>
@endsection