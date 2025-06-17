<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Admin Test</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Scripts and Styles -->
    @vite(['resources/css/app.css', 'resources/js/admin-test.jsx'])
    
    <script>
        console.log('Admin Test page loaded');
    </script>
</head>
<body class="font-sans antialiased">
    <div id="admin-app">
        <div style="padding: 20px; text-align: center;">
            <h2>Loading Test Admin Panel...</h2>
            <p>If this message persists, there might be an issue with the React application.</p>
        </div>
    </div>
</body>
</html>