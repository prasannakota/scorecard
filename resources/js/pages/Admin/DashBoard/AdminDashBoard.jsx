// pages/admin/Dashboard.jsx
import React from 'react';
import AdminSidebarLayout from "./AdminSidebarLayout";
import { useState ,useEffect } from "react";
import { Link } from 'react-router-dom';


const AdminDashBoard = () => {

    const [stats, setStats] = useState([
        { name: 'Total Users', value: '0', change: '0%', trend: 'up' },
        { name: 'Departments', value: '0', change: '0', trend: 'up' },
        { name: 'Assessments', value: '0', change: '0%', trend: 'up' },
        { name: 'Completion Rate', value: '0%', change: '0%', trend: 'up' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/react-admin/dashboard/stats');
                if (response.data) {
                    // Transform the data to match our component's expectations
                    const transformedStats = [
                        {
                            name: 'Total Users',
                            value: response.data.users.toString(),
                            change: '+0%',
                            trend: 'up'
                        },
                        {
                            name: 'Departments',
                            value: response.data.departments.toString(),
                            change: '+0',
                            trend: 'up'
                        },
                        {
                            name: 'Questions',
                            value: response.data.questions.toString(),
                            change: '+0%',
                            trend: 'up'
                        },
                        {
                            name: 'Assessments',
                            value: response.data.assessments.toString(),
                            change: '+0%',
                            trend: 'up'
                        },
                    ];
                    setStats(transformedStats);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load dashboard statistics. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);
    return (
        <AdminSidebarLayout>
            <div className="p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
                </header>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {loading ? (
                        // Loading skeletons
                        Array(4).fill().map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : (
                        // Actual stats
                        stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                <div className="mt-2 flex items-center">
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                                    <svg
                                        className={`w-4 h-4 ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {stat.trend === 'up' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        )}
                                    </svg>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Access Cards */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
                            <p className="text-gray-600 mb-4">Manage user accounts, permissions and roles</p>
                            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                                View Users
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Departments</h3>
                            <p className="text-gray-600 mb-4">Manage departments and organizational structure</p>
                            <Link to="/admin/departments" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                                View Departments
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessments</h3>
                            <p className="text-gray-600 mb-4">View and manage assessment results and analytics</p>
                            <Link to="/admin/assessments" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                                View Assessments
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
};

export default AdminDashBoard;
