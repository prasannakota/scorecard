<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to [Your Company]</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 8px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
            background-color:black;
        }
        .logo img {
            max-width: 150px;
        }
        .content {
            text-align: center;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #555555;
            line-height: 1.5;
        }
        .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
        }
        .social-icons img {
            width: 24px;
            margin: 0 5px;
        }
    </style>
</head>
<body>
<div class="email-container">
    <div class="logo">
        <img src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif" width="200" />
    </div>
    <div class="content">
        <h2>Welcome, {{ $user->name }}!</h2>
        <p>Thank you for registering with [Your Company]. We're excited to have you on board.</p>
        <p>If you have any questions, feel free to <a href="mailto:support@yourdomain.com">contact our support team</a>.</p>
    </div>
    <div class="footer">
        <p>&copy; {{ date('Y') }} [Your Company]. All rights reserved.</p>
        <div class="social-icons">
            <a href="https://facebook.com/yourcompany"><img src="https://yourdomain.com/icons/facebook.png" alt="Facebook"></a>
            <a href="https://twitter.com/yourcompany"><img src="https://yourdomain.com/icons/twitter.png" alt="Twitter"></a>
            <a href="https://instagram.com/yourcompany"><img src="https://yourdomain.com/icons/instagram.png" alt="Instagram"></a>
        </div>
    </div>
</div>
</body>
</html>
