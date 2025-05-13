<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-commerce Scorecard - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 250px;
            padding-top: 20px;
            background-color: #f8f9fa;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }
        
        .sidebar .nav-link {
            padding: 10px 20px;
            color: #6c757d;
            transition: all 0.3s ease;
        }
        
        .sidebar .nav-link:hover {
            background-color: #e9ecef;
            color: #0d6efd;
        }
        
        .sidebar .nav-link.active {
            background-color: #0d6efd;
            color: white;
        }
        
        .main-content {
            /*margin-left: 250px;*/
            padding: 20px;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .sidebar.show {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
        }
        
        .navbar-brand {
            font-weight: 600;
            color: white !important;
        }
        
        .profile-dropdown {
            position: relative;
        }
        
        .profile-dropdown .dropdown-menu {
            right: 0;
            left: auto;
        }

        .navbar {
            background-color: #1B2937 !important;
            padding: 1rem;
        }

        .navbar .nav-link {
            color: white !important;
            margin: 0 10px;
        }

        .navbar .nav-link:hover {
            color: #e9ecef !important;
        }

        .search-bar {
            position: relative;
            margin: 0 20px;
        }

        .search-bar input {
            background-color: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 8px 35px 8px 15px;
            border-radius: 20px;
            width: 300px;
        }

        .search-bar input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .search-bar .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.7);
        }

        .hamburger-menu {
            color: white;
            font-size: 1.5rem;
            margin-right: 15px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Sidebar -->
        {{--<nav class="sidebar">
            <div class="sidebar-header">
                <h3 class="text-center mb-4">E-commerce Scorecard</h3>
            </div>
            
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a href="{{ route('dashboard') }}" class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                        <i class="fas fa-home me-2"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('profile.show') }}" class="nav-link {{ request()->routeIs('profile.show') ? 'active' : '' }}">
                        <i class="fas fa-user me-2"></i> Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('assessment.index') }}" class="nav-link {{ request()->routeIs('assessment.*') ? 'active' : '' }}">
                        <i class="fas fa-tasks me-2"></i> Assessments
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('password.reset.form') }}" class="nav-link {{ request()->routeIs('password.reset.form') ? 'active' : '' }}">
                        <i class="fas fa-key me-2"></i> Change Password
                    </a>
                </li>
            </ul>
        </nav>--}}

        <!-- Main Content -->
        <div class="main-content">
            <!-- Top Navigation -->
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <button class="btn btn-link d-md-none hamburger-menu" id="sidebarToggle">
                        <i class="fas fa-bars"></i>
                    </button>

                    <a class="navbar-brand" href="{{ route('dashboard') }}">
                        <i class="fas fa-bars me-2 d-none d-md-inline-block hamburger-menu"></i>

                        <img src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif" width="200" />
                    </a>

                    <div class="d-flex align-items-center flex-grow-1">
                        <div class="search-bar">
                            <input type="text" placeholder="Search..." class="form-control">
                            <i class="fas fa-search search-icon"></i>
                        </div>

                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('dashboard') }}">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Get Advice</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Add Users</a>
                            </li>
                            <li class="nav-item">
                                <div class="profile-dropdown">
                                    <div class="dropdown">
                                        <button class="btn btn-link nav-link dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                                            <i class="fas fa-user me-2"></i>{{ Auth::user()->name }}
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li><a class="dropdown-item" href="{{ route('profile.show') }}"><i class="fas fa-user me-2"></i>Profile</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <form action="{{ route('logout') }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="dropdown-item"><i class="fas fa-sign-out-alt me-2"></i>Logout</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Page Content -->
            <div class="container-fluid">
                @if(session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger">
                        {{ session('error') }}
                    </div>
                @endif

                @yield('content')
            </div>

            <!-- footer -->
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <img src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif" width="120" />
                    <span>2025 Kensium, Allrights reserved.</span>
                </div>

                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Policies</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Privacy Policy</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Terms of use</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Contact us</a>
                    </li>
                </ul>
            </nav>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    </script>
</body>
</html>
