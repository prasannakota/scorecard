import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-600 hover:text-white';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold">AP</h1>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            <li className="mb-2">
              <Link to="/dashboard" className={`flex items-center p-3 ${isActive('/dashboard')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/users" className={`flex items-center p-3 ${isActive('/users')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {sidebarOpen && <span>Users</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/departments" className={`flex items-center p-3 ${isActive('/departments')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {sidebarOpen && <span>Departments</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/email-templates" className={`flex items-center p-3 ${isActive('/email-templates')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {sidebarOpen && <span>Email Templates</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/mail-settings" className={`flex items-center p-3 ${isActive('/mail-settings')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {sidebarOpen && <span>Mail Settings</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/email-logs" className={`flex items-center p-3 ${isActive('/email-logs')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {sidebarOpen && <span>Email Logs</span>}
              </Link>
            </li>
            <li className="mt-auto mb-2">
              <button onClick={handleLogout} className="flex items-center p-3 w-full text-left text-gray-300 hover:bg-blue-600 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/users' && 'User Management'}
                {location.pathname.includes('/users/create') && 'Create User'}
                {location.pathname.includes('/users/') && location.pathname.includes('/edit') && 'Edit User'}
                {location.pathname === '/departments' && 'Departments'}
                {location.pathname.includes('/departments/create') && 'Create Department'}
                {location.pathname.includes('/departments/') && location.pathname.includes('/edit') && 'Edit Department'}
                {location.pathname.includes('/questions') && !location.pathname.includes('/create') && !location.pathname.includes('/edit') && 'Questions'}
                {location.pathname.includes('/questions/create') && 'Create Question'}
                {location.pathname.includes('/questions/') && location.pathname.includes('/edit') && 'Edit Question'}
                {location.pathname === '/email-templates' && 'Email Templates'}
                {location.pathname === '/mail-settings' && 'Mail Settings'}
                {location.pathname === '/email-logs' && 'Email Logs'}
              </h2>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Admin User</span>
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    A
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;