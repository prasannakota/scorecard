<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Admin</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Scripts and Styles -->
    @vite(['resources/css/app.css', 'resources/js/admin.jsx'])
    
    <!-- Manually include the built assets as a fallback -->
    @if(app()->environment('production'))
        <link rel="stylesheet" href="{{ asset('build/assets/app-DqUF59-0.css') }}">
        <script type="module" src="{{ asset('build/assets/admin-DUJItLW5.js') }}"></script>
        <script type="module" src="{{ asset('build/assets/index-D_vMn3V1.js') }}"></script>
    @endif
    
    <!-- Debug script -->
    <script>
        console.log('Admin React layout loaded');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM fully loaded');
            console.log('admin-app element exists:', !!document.getElementById('admin-app'));
            
            // Check if Vite scripts are loaded
            const scripts = document.querySelectorAll('script');
            console.log('Total scripts on page:', scripts.length);
            scripts.forEach(script => {
                if (script.src) {
                    console.log('Script src:', script.src);
                }
            });
            
            // Check for any script loading errors
            window.addEventListener('error', function(e) {
                console.error('Error event:', e);
            }, true);
        });
    </script>
    
    <!-- Inline React test (as a fallback) -->
    <script>
        // This will run regardless of whether the Vite scripts load
        window.onload = function() {
            console.log('Window loaded');
            setTimeout(function() {
                const adminApp = document.getElementById('admin-app');
                if (adminApp && adminApp.innerHTML.includes('Loading Admin Panel')) {
                    console.log('React did not render after 2 seconds, trying inline React');
                    
                    // Try to render a simple message using React
                    try {
                        if (window.React && window.ReactDOM) {
                            console.log('React and ReactDOM are available globally');
                            const element = React.createElement('div', null, [
                                React.createElement('h2', {key: 'title'}, 'Inline React Test'),
                                React.createElement('p', {key: 'message'}, 'This is rendered with inline React')
                            ]);
                            ReactDOM.render(element, adminApp);
                        } else {
                            console.error('React or ReactDOM not available globally');
                            adminApp.innerHTML = '<div style="color: red; padding: 20px;">React libraries not loaded. Check console for errors.</div>';
                        }
                    } catch (error) {
                        console.error('Error with inline React:', error);
                    }
                }
            }, 2000);
        };
    </script>
</head>
<body class="font-sans antialiased">
    <!-- Content section for child views -->
    @yield('content', '
    <div id="admin-app">
        <div style="padding: 20px; text-align: center;">
            <h2>Loading Admin Panel...</h2>
            <p>If this message persists, there might be an issue with the React application.</p>
        </div>
    </div>
    ')
</body>
</html>