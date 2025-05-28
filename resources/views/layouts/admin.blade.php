<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - E-commerce Scorecard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    @stack('styles')
    <style>
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 250px;
            z-index: 1000;
            background-color: #343a40;
        }
        
        .main-content {
            margin-left: 250px;
            padding: 20px;
            width: calc(100% - 250px);
        }
        
        @media (max-width: 768px) {
            .sidebar {
                position: absolute;
                left: -250px;
            }
            
            .main-content {
                margin-left: 0;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <nav class="sidebar">
        <div class="position-sticky pt-3">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link active" href="{{ route('admin.dashboard') }}">
                        <span data-feather="home"></span>
                        Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('admin.users.index') }}">
                        <span data-feather="users"></span>
                        Users
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('admin.departments.index') }}">
                        <span data-feather="folder"></span>
                        Departments
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('admin.industries.index') }}">
                        <i class="bi bi-building"></i>
                        Industries
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('admin.business_categories.index') }}">
                        <i class="bi bi-tags"></i>
                        Business Categories
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('invites.create') }}">
                        <span data-feather="folder"></span>
                        Invite
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="collapse" href="#emailMenu" role="button" aria-expanded="{{ request()->is('admin/email-templates*') || request()->is('admin/mail-settings*') || request()->is('admin/email-logs*') ? 'true' : 'false' }}" aria-controls="emailMenu">
                        <i class="bi bi-envelope"></i>
                        Email & Notification Management
                    </a>
                    <div class="collapse {{ request()->is('admin/email-templates*') || request()->is('admin/mail-settings*') || request()->is('admin/email-logs*') ? 'show' : '' }}" id="emailMenu">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <a href="{{ route('admin.email_templates.index') }}"
                                   class="nav-link {{ request()->routeIs('admin.email_templates.*') ? 'active' : '' }}">
                                    <i class="bi bi-envelope-open"></i> Email Templates
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('admin.mail_settings.index') }}"
                                   class="nav-link {{ request()->routeIs('admin.mail_settings.*') ? 'active' : '' }}">
                                    <i class="bi bi-gear"></i> Mail Settings
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('admin.email_logs.index') }}"
                                   class="nav-link {{ request()->routeIs('admin.email_logs.*') ? 'active' : '' }}">
                                    <i class="bi bi-file-earmark-text"></i> Email Logs
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="{{ route('admin.logout') }}" class="nav-link" onclick="event.preventDefault(); confirmLogout();">
                        <span data-feather="log-out"></span>
                        Logout
                    </a>
                    <script>
                        function confirmLogout() {
                            if (confirm('Are you sure you want to logout?')) {
                                window.location.href = '{{ route('admin.logout') }}';
                            }
                        }
                    </script>
                </li>
            </ul>
        </div>
    </nav>

    <main class="main-content">
        <div class="container-fluid">
            @yield('content')
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    @stack('scripts')
    <script>
        feather.replace()
    </script>
</body>
    @stack('scripts')
    <script>
        feather.replace()
    </script>
</body>
</html>