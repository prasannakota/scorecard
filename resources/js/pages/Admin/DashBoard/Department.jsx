import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import AdminSidebarLayout from "./AdminSidebarLayout";
import Modal from "../../../components/admin/Modal";
import axios from 'axios';


export default function AdminDepartment (){
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

            const response = await axios.get('/api/react-admin/departments', { params });
            if (response.data) {
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
            fetchDepartments(currentPage, searchTerm);
            setIsDeleteModalOpen(false);
            setCurrentDepartment(null);

            alert(response.data.message || 'Department deleted successfully');
        } catch (err) {
            console.error('Error deleting department:', err);

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

            if (!newDepartment.name.trim()) {
                alert('Department name is required');
                setLoading(false);
                return;
            }
            const response = await axios.post('/api/react-admin/departments', {
                name: newDepartment.name,
                is_active: newDepartment.is_active
            });

            setNewDepartment({ name: '', is_active: true });
            setIsAddModalOpen(false);

            fetchDepartments(currentPage, searchTerm);

            alert(response.data.message || 'Department created successfully');

        } catch (err) {
            console.error('Error creating department:', err);

            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    alert(err.response.data.error);
                } else if (err.response.data.errors && err.response.data.errors.name) {

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

            if (!editDepartment.name.trim()) {
                alert('Department name is required');
                setLoading(false);
                return;
            }

            const response = await axios.put(`/api/react-admin/departments/${editDepartment.id}`, {
                name: editDepartment.name,
                is_active: editDepartment.is_active
            });

            setEditDepartment({ id: null, name: '', is_active: true });
            setIsEditModalOpen(false);

            fetchDepartments(currentPage, searchTerm);

            alert(response.data.message || 'Department updated successfully');

        } catch (err) {
            console.error('Error updating department:', err);

            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    alert(err.response.data.error);
                } else if (err.response.data.errors && err.response.data.errors.name) {

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

    const navigate = useNavigate();

    const handleViewQuestions = (department) => {
        navigate('/admin-questions', {
            state: {
                departmentId: department.id,
                departmentName: department.name,
            },
        });
    };


    return (
        <AdminSidebarLayout>
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

                                        {/*<button
                                            onClick={() => window.open(`/admin-questions/${dept.id}`, '_blank')}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            View Questions

                                        </button>*/}

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Edit button clicked for department:', dept);
                                                handleViewQuestions(dept);
                                            }}
                                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            View Questions
                                        </button>
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
        </AdminSidebarLayout>
    );
};