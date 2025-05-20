<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-commerce Scorecard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .google-btn {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px 16px;
            color: #555;
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            cursor: pointer;
        }
        .google-btn:hover {
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        .google-btn i {
            color: #4285F4;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 d-flex flex-column justify-content-center">
                <div class="text-center mb-4">
                    <img src="{{ asset('images/scorecard-logo.png.avif') }}" alt="E-commerce Scorecard Logo" class="img-fluid mb-4" style="max-width: 200px;">
                </div>
                <h1 class="display-4 mb-3">Welcome to E-commerce Scorecard</h1>
                <p class="lead mb-3">Evaluate your Commerce business's performance.</p>
                <p class="mb-4">Discover how your online store performs, compare with industry benchmarks, and get expert recommendations to grow your business.</p>
                <div class="text-center">
                    <a href="{{ route('register') }}" class="btn btn-primary px-4">Get Started</a>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <ul class="nav nav-tabs mb-3" id="authTabs" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="login-tab" data-bs-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">
                                    <i class="bi bi-box-arrow-in-right me-2"></i>Login
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="register-tab" data-bs-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">
                                    <i class="bi bi-person-plus me-2"></i>Create an account
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('admin.login') }}" class="nav-link">
                                    <i class="bi bi-shield-lock me-2"></i>Admin Login
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
                                <form action="{{ route('login') }}" method="POST">
                                    @csrf
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email address</label>
                                        <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com">
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="password" name="password">
                                    </div>
                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="remember">
                                        <label class="form-check-label" for="remember">Remember me</label>
                                    </div>
                                    <button type="submit" class="btn btn-success w-100 mb-3">Login</button>
                                </form>
                                <div class="text-center mb-3">
                                    <span class="text-muted">or</span>
                                </div>
                                <div class="d-grid gap-2">
                                    <a href="{{ route('social.redirect', 'google') }}" class="google-btn w-100">
                                        <i class="bi bi-google" style="font-size: 1.2rem;"></i>Continue with Google
                                    </a>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                                <form action="{{ route('register') }}" method="POST">
                                    @csrf
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="name" name="name" placeholder="Your full name">
                                    </div>
                                    <div class="mb-3">
                                        <label for="register-email" class="form-label">Email address</label>
                                        <input type="email" class="form-control" id="register-email" name="email" placeholder="name@example.com">
                                    </div>
                                    <div class="mb-3">
                                        <label for="register-password" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="register-password" name="password" placeholder="Password">
                                    </div>
                                    <div class="mb-3">
                                        <label for="confirm-password" class="form-label">Confirm Password</label>
                                        <input type="password" class="form-control" id="confirm-password" name="password_confirmation" placeholder="Confirm password">
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Create Account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
