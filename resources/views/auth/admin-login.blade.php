<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row w-100 shadow rounded overflow-hidden" style="max-width: 1200px;">
        <!-- Left Panel -->
        <div class="col-md-6 d-none d-md-flex bg-dark text-white flex-column justify-content-center p-5">
            <h2 class="fw-bold mb-3">Evaluate your Commerce business's performance.</h2>
            <p class="text-light">
                Discover how your online store performs, compare with industry benchmarks, and get expert recommendations to grow your business.
            </p>
        </div>

        <!-- Right Panel -->
        <div class="col-md-6 bg-white p-5">
            <div className='customlogo'>
            <img src="/images/Kensiumlogo.svg" alt="Logo" />
          </div>

            <!-- Tabs -->
            <ul class="nav nav-tabs justify-content-center mb-4" id="loginTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab">{{ __('Admin Login') }}</button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content" id="loginTabsContent">
                <!-- Login Tab -->
                <div class="tab-pane fade show active" id="login" role="tabpanel">
                    <form method="POST" action="{{ route('admin.login.post') }}">
                        @csrf

                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input id="email" type="email"
                                   class="form-control @error('email') is-invalid @enderror"
                                   name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                            @error('email')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input id="password" type="password"
                                   class="form-control @error('password') is-invalid @enderror"
                                   name="password" required autocomplete="current-password">
                            @error('password')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3 form-check">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember"
                                    {{ old('remember') ? 'checked' : '' }}>
                            <label class="form-check-label" for="remember">Remember Me</label>
                        </div>

                        <div class="d-grid mb-3">
                            <button type="submit" class="btn btn-success">Login</button>
                        </div>

                        @if (Route::has('password.request'))
                            <div class="text-center">
                                <a class="text-decoration-none" href="{{ route('password.request') }}">Forgot Your Password?</a>
                            </div>
                        @endif
                    </form>

                    <div class="my-3 text-center">OR</div>

                    <!-- Social Login Buttons -->
                    {{--<div class="d-flex justify-content-center gap-3 mt-4">--}}
                        {{--<!-- Google -->--}}
                        {{--<button type="button" class="btn btn-outline-secondary rounded-circle p-3" aria-label="Login with Google">--}}
                            {{--<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"--}}
                                 {{--class="text-dark" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">--}}
                                {{--<path--}}
                                        {{--d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z">--}}
                                {{--</path>--}}
                            {{--</svg>--}}
                        {{--</button>--}}

                        {{--<!-- Apple -->--}}
                        {{--<button type="button" class="btn btn-outline-secondary rounded-circle p-3" aria-label="Login with Apple">--}}
                            {{--<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512"--}}
                                 {{--class="text-dark" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">--}}
                                {{--<path--}}
                                        {{--d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z">--}}
                                {{--</path>--}}
                            {{--</svg>--}}
                        {{--</button>--}}

                        {{--<!-- Microsoft -->--}}
                        {{--<button type="button" class="btn btn-outline-secondary rounded-circle p-3" aria-label="Login with Microsoft">--}}
                            {{--<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512"--}}
                                 {{--class="text-dark" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">--}}
                                {{--<path--}}
                                        {{--d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z">--}}
                                {{--</path>--}}
                            {{--</svg>--}}
                        {{--</button>--}}
                    {{--</div>--}}


                    <p class="text-center text-muted mt-4" style="font-size: 0.8rem;">
                        By signing in, you accept KENSIUM Company's <br>
                        <a href="#" class="text-decoration-underline">Terms of Use</a> & <a href="#" class="text-decoration-underline">Privacy Policy</a>
                    </p>
                </div>

                <!-- Register Tab (Optional placeholder) -->
                <div class="tab-pane fade" id="register" role="tabpanel">
                    <p class="text-muted text-center">Registration form coming soon...</p>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>