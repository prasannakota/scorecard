import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebarLayout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center text-2xl font-bold bg-gray-900">
                    Admin Panel
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="px-2 py-4 space-y-1">
                        {[
                            { to: '/admin-dashboard', label: 'Dashboard', iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10...' },
                            { to: '/admin/users', label: 'Users', iconPath: 'M12 4.354a4 4 0 110 5.292M15 21...' },
                            { to: '/admin-departments', label: 'Departments', iconPath: 'M19 21V5a2 2 0...' },
                            { to: '/admin/assessments', label: 'Assessments', iconPath: 'M9 5H7a2 2 0 00-2 2v12...' },
                            { to: '/admin/settings', label: 'Settings', iconPath: 'M10.325 4.317c.426-1.756...' },
                            { to: '/admin/industries', label: 'Industries', iconPath: 'M10.325 4.317c.426-1.756...' },
                        ].map(({ to, label, iconPath }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive(to)
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <svg
                                    className={`mr-3 h-6 w-6 ${isActive(to)
                                        ? 'text-gray-300'
                                        : 'text-gray-400 group-hover:text-gray-300'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                                </svg>
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
    );
};

export default AdminSidebarLayout;
