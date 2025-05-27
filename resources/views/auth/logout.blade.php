<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logged Out - E-commerce Scorecard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .logout-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
        }
        .logout-message {
            margin-bottom: 20px;
        }
        .home-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .home-link:hover {
            background-color: #218838;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="logout-container">
        <div class="logout-message">
            <i class="bi bi-check-circle text-success" style="font-size: 2rem;"></i>
            <h3 class="mt-3">You have been logged out successfully!</h3>
            <p class="text-muted">Thank you for using E-commerce Scorecard.</p>
        </div>
        <a href="/" class="home-link">
            <i class="bi bi-house-door me-2"></i>Go to Home Page
        </a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
