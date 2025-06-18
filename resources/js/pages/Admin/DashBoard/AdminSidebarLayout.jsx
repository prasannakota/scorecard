import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebarLayout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        {
            to: '/admin-dashboard',
            label: 'Dashboard',
            iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6',
        },
        {
            to: '/admin-users',
            label: 'Users',
            iconPath: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75',
        },
        {
            to: '/admin-departments',
            label: 'Departments',
            iconPath: 'M3 7v4h18V7M3 11v4h18v-4M3 15v4h18v-4',
        },
        {
            to: '/admin-assessments',
            label: 'Assessments',
            iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5V3h6v2M9 10h6',
        },
        {
            to: '/admin-settings',
            label: 'Settings',
            iconPath: [
                'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            ],
        },
        {
            to: '/admin-industries',
            label: 'Industries',
            iconPath: 'M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z',
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center text-2xl font-bold bg-gray-900">
                    Admin Panel
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="px-2 py-4 space-y-1">
                        {navItems.map(({ to, label, iconPath }) => (
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
                                    className={`mr-3 h-6 w-6 ${
                                        isActive(to)
                                            ? 'text-gray-300'
                                            : 'text-gray-400 group-hover:text-gray-300'
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {(Array.isArray(iconPath) ? iconPath : [iconPath]).map((d, index) => (
                                        <path
                                            key={index}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={d}
                                        />
                                    ))}
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
