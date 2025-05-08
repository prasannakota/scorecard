<!DOCTYPE html>
<html>
<head>
    <title>Direct Auth Test</title>
</head>
<body>
    <h1>Direct Authentication Test</h1>
    
    <form id="testForm" method="POST" action="{{ url('admin/test-auth-direct') }}">
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
            const response = await fetch('{{ route('admin.test.direct') }}', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
        });
    </script>
</body>
</html>
