<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Simple Admin Test</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Basic styles -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
        }
        .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h1 {
            color: #2563eb;
            margin-top: 0;
        }
    </style>

    <!-- Scripts and Styles -->
    @vite(['resources/css/app.css', 'resources/js/admin.jsx'])
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Simple Admin Test</h1>
            <p>This is a simplified admin test page.</p>
            <p>The React component should appear below:</p>
        </div>
        
        <div id="admin-app" class="card" style="margin-top: 20px;">
            <div style="text-align: center; padding: 20px;">
                <p>Loading React component...</p>
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
        </div>
    </div>
    
    <script>
        // Animation for the spinner
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `);
        
        // Debug information
        console.log('Simple admin test page loaded');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM fully loaded');
            console.log('admin-app element exists:', !!document.getElementById('admin-app'));
        });
    </script>
</body>
</html>