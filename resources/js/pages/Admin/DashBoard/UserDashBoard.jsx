import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import AdminSidebarLayout from "./AdminSidebarLayout";
import Modal from "../../../components/admin/Modal";
import axios from 'axios';
import UserForm from "../../../components/admin/UserForm";


export default function UserDashBoard (){
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
        <AdminSidebarLayout>
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
        </AdminSidebarLayout>
    );
};