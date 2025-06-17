<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Simple React Test</title>
    @vite(['resources/js/simple-test.jsx'])
</head>
<body>
    <div id="app">
        <p>Loading... If you see this message, React is not rendering.</p>
    </div>
</body>
</html>