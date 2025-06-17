import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/app.css';
import UserForm from './components/admin/UserForm';
import Modal from './components/admin/Modal';

// Configure axios to include CSRF token
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Dashboard Component
const Dashboard = () => {
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
  );
};

// Users Component
const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/react-admin/departments');
      if (response.data && response.data.data) {
        setDepartments(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchUsers = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        ...filters
      };
      
      // Use the existing API endpoint
      const response = await axios.get('/api/react-admin/users', { params });
      
      if (response.data) {
        // Transform the data to match our component's expectations
        const userData = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email,
          mobile: user.mobile || '',
          role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User',
          status: user.status || 'Active',
          customer_type: user.customer_type || 'lite'
        }));
        
        setUsers(userData);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalUsers(response.data.total || 0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    const filters = {
      search: searchTerm,
      role: roleFilter,
      status: statusFilter
    };
    
    fetchUsers(currentPage, filters);
  }, [currentPage, searchTerm, roleFilter, statusFilter]);
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setIsAddModalOpen(true);
  };
  
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleSubmitUser = async (userData) => {
    try {
      setLoading(true);
      
      if (currentUser) {
        // Update existing user
        await axios.put(`/api/react-admin/users/${currentUser.id}`, userData);
      } else {
        // Create new user
        await axios.post('/api/react-admin/users', userData);
      }
      
      // Refresh the user list
      fetchUsers(currentPage, {
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      
      // Close modals
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setCurrentUser(null);
      
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      await axios.delete(`/api/react-admin/users/${currentUser.id}`);
      
      // Refresh the user list
      fetchUsers(currentPage, {
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      
      setIsDeleteModalOpen(false);
      setCurrentUser(null);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>

        </div>
        <button 
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add User
        </button>
      </header>
      
      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <UserForm 
          departments={departments}
          onSubmit={handleSubmitUser}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User">
        <UserForm 
          user={currentUser}
          departments={departments}
          onSubmit={handleSubmitUser}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete User">
        <div className="p-1">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 rounded-full p-3 flex items-center justify-center">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Confirm Deletion</h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed.
          </p>
          
          <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
      
      {/* Search and filters */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-0 right-0 px-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </form>
      
      {/* Users table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeletons
              Array(5).fill().map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.mobile || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.customer_type === 'full' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.customer_type.charAt(0).toUpperCase() + user.customer_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditUser(user)} 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalUsers)}
                  </span>{' '}
                  of <span className="font-medium">{totalUsers}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Generate page buttons */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Only show a few pages around the current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    
                    // Show ellipsis for skipped pages
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Departments Component
const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: '', is_active: true });
  const [editDepartment, setEditDepartment] = useState({ id: null, name: '', is_active: true });

  const fetchDepartments = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        search
      };
      
      // Use the existing API endpoint
      const response = await axios.get('/api/react-admin/departments', { params });
      
      if (response.data) {
        // Transform the data to match our component's expectations
        const deptData = response.data.data.map(dept => ({
          id: dept.id,
          name: dept.name,
          status: dept.is_active ? 'Active' : 'Inactive'
        }));
        
        setDepartments(deptData);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalDepartments(response.data.total || 0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchDepartments(1, searchTerm);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleDeleteClick = (department) => {
    setCurrentDepartment(department);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!currentDepartment) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/react-admin/departments/${currentDepartment.id}`);
      
      // Refresh the department list
      fetchDepartments(currentPage, searchTerm);
      
      setIsDeleteModalOpen(false);
      setCurrentDepartment(null);
      
      // Show success message
      alert(response.data.message || 'Department deleted successfully');
      
    } catch (err) {
      console.error('Error deleting department:', err);
      
      // Show more detailed error message
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Failed to delete department. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddDepartment = async () => {
    try {
      setLoading(true);
      
      // Validate input
      if (!newDepartment.name.trim()) {
        alert('Department name is required');
        setLoading(false);
        return;
      }
      
      // Create department via API
      const response = await axios.post('/api/react-admin/departments', {
        name: newDepartment.name,
        is_active: newDepartment.is_active
      });
      
      // Reset form and close modal
      setNewDepartment({ name: '', is_active: true });
      setIsAddModalOpen(false);
      
      // Refresh the department list
      fetchDepartments(currentPage, searchTerm);
      
      // Show success message
      alert(response.data.message || 'Department created successfully');
      
    } catch (err) {
      console.error('Error creating department:', err);
      
      // Show more detailed error message
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          alert(err.response.data.error);
        } else if (err.response.data.errors && err.response.data.errors.name) {
          // Handle validation errors
          alert(`Error: ${err.response.data.errors.name[0]}`);
        } else {
          alert('Failed to create department. Please try again.');
        }
      } else {
        alert('Failed to create department. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDepartment({
      ...newDepartment,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditDepartment({
      ...editDepartment,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleEditClick = (department) => {
    console.log('Edit clicked for department:', department);
    setEditDepartment({
      id: department.id,
      name: department.name,
      is_active: department.status === 'Active'
    });
    setIsEditModalOpen(true);
    console.log('Edit modal should be open now');
  };
  
  const handleUpdateDepartment = async () => {
    try {
      setLoading(true);
      
      // Validate input
      if (!editDepartment.name.trim()) {
        alert('Department name is required');
        setLoading(false);
        return;
      }
      
      // Update department via API
      const response = await axios.put(`/api/react-admin/departments/${editDepartment.id}`, {
        name: editDepartment.name,
        is_active: editDepartment.is_active
      });
      
      // Reset form and close modal
      setEditDepartment({ id: null, name: '', is_active: true });
      setIsEditModalOpen(false);
      
      // Refresh the department list
      fetchDepartments(currentPage, searchTerm);
      
      // Show success message
      alert(response.data.message || 'Department updated successfully');
      
    } catch (err) {
      console.error('Error updating department:', err);
      
      // Show more detailed error message
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          alert(err.response.data.error);
        } else if (err.response.data.errors && err.response.data.errors.name) {
          // Handle validation errors
          alert(`Error: ${err.response.data.errors.name[0]}`);
        } else {
          alert('Failed to update department. Please try again.');
        }
      } else {
        alert('Failed to update department. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>

        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
        >
          Add Department
        </button>
      </header>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
      
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search departments..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-0 right-0 px-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Departments grid */}
      {loading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill().map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="mt-4 py-3">
                  {/* Empty space to maintain layout */}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No departments found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${dept.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="mt-4 py-2">
                    {/* Empty space to maintain layout */}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Edit button clicked for department:', dept);
                        handleEditClick(dept);
                      }} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(dept)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Generate page buttons */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Only show a few pages around the current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show ellipsis for skipped pages
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Department">
        <div className="p-1">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 rounded-full p-3 flex items-center justify-center">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Confirm Deletion</h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete the department <span className="font-semibold">{currentDepartment?.name}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
          </p>
          
          <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Department
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Add Department Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Department">
        <div className="p-1">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDepartment.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter department name"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={newDepartment.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active Department
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDepartment}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Add Department
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Department Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Department">
        <div className="p-1">
          <div className="mb-6">
            <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              id="edit_name"
              name="name"
              value={editDepartment.name}
              onChange={handleEditInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter department name"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit_is_active"
                name="is_active"
                checked={editDepartment.is_active}
                onChange={handleEditInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="edit_is_active" className="ml-2 block text-sm text-gray-700">
                Active Department
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateDepartment}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Department
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Not Found Component
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-gray-900">404</h2>
        <p className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link 
          to="/admin/dashboard" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

// Layout Component
const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link
                  to="/admin/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive('/admin/dashboard') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>

                <Link
                  to="/admin/users"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/users')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive('/admin/users') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Users
                </Link>

                <Link
                  to="/admin/departments"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/departments')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive('/admin/departments') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Departments
                </Link>

                <Link
                  to="/admin/assessments"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/assessments')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive('/admin/assessments') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Assessments
                </Link>

                <Link
                  to="/admin/settings"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/settings')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive('/admin/settings') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <Link
                    to="/admin/dashboard"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive('/admin/dashboard')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg 
                      className={`mr-4 h-6 w-6 ${isActive('/admin/dashboard') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/users"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive('/admin/users')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg 
                      className={`mr-4 h-6 w-6 ${isActive('/admin/users') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Users
                  </Link>

                  <Link
                    to="/admin/departments"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive('/admin/departments')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg 
                      className={`mr-4 h-6 w-6 ${isActive('/admin/departments') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Departments
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                <a href="#" className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">A</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Admin User</p>
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">View profile</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 w-14"></div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">A</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Create router
const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "departments",
        element: <Departments />,
      },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

// Debug information
console.log('Admin.jsx loaded with React 19 compatibility and routing');

// Use React 19 createRoot API
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded in admin.jsx');
    const adminRoot = document.getElementById('admin-app');
    console.log('Admin root element found:', !!adminRoot);
    
    if (adminRoot) {
        try {
            console.log('Attempting to render AdminApp with createRoot');
            // Clear any existing content
            adminRoot.innerHTML = '';
            // Use createRoot API for React 19
            const root = createRoot(adminRoot);
            root.render(
              <React.StrictMode>
                <RouterProvider router={router} />
              </React.StrictMode>
            );
            console.log('AdminApp with routing rendered successfully with React 19');
        } catch (error) {
            console.error('Error rendering AdminApp:', error);
            // Try to display the error in the DOM
            adminRoot.innerHTML = `
              <div style="color: red; padding: 20px; border: 1px solid red; margin-top: 20px;">
                <h3>Error Rendering React</h3>
                <p>${error.message}</p>
                <pre>${error.stack}</pre>
              </div>
            `;
        }
    } else {
        console.error('Admin root element not found');
    }
});