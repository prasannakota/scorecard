@extends('layouts.admin')
@section('content')
<div class="container">
    <h2>Email Logs</h2>
    <table class="table table-bordered">
        <thead>
            <tr><th>ID</th><th>To</th><th>Subject</th><th>Status</th><th>Error</th><th>Sent At</th></tr>
        </thead>
        <tbody>
            @foreach($logs as $log)
            <tr>
                <td>{{ $log->id }}</td>
                <td>{{ $log->to_email }}</td>
                <td>{{ $log->subject }}</td>
                <td>{{ $log->status }}</td>
                <td>{{ $log->error_message }}</td>
                <td>{{ $log->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    {{ $logs->links() }}
</div>
@endsection
