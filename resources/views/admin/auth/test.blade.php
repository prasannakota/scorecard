<!DOCTYPE html>
<html>
<head>
    <title>Admin Auth Test</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Admin Authentication Test</h1>
    
    <form id="testForm" method="POST" action="{{ route('admin.test.auth') }}">
        @csrf
        <div>
            <label>Email:</label>
            <input type="email" name="email" value="testadmin@test.com">
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password" value="test1234">
        </div>
        <button type="submit">Test Login</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('testForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const response = await fetch('{{ route('admin.test.auth') }}', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });
            
            const result = await response.json();
            document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
        });
    </script>
</body>
</html>
