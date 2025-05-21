<!DOCTYPE html>
<html>
<head>
    <title>Login Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f8fa;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 30px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-height: 50px;
        }
        .content {
            color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border-radius: 4px;
            text-decoration: none;
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="logo">
        <img src="https://yourdomain.com/logo.png" alt="Your Company Logo">
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }},</h2>

        <p>This is to notify you that your account (<strong>{{ $user->email }}</strong>) was just accessed.</p>

        <p>If this was you, no further action is needed.</p>

        <p>If you did not perform this login, please reset your password immediately and contact support.</p>

        <a href="{{ url('/reset-password') }}" class="button">Reset Password</a>
    </div>

    <div class="footer">
        &copy; {{ date('Y') }} Your Company. All rights reserved.
    </div>
</div>
</body>
</html>
