import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, createUser, updateUser } from '../api/users';
import { fetchDepartments } from '../api/departments';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    department_id: '',
    role: 'user',
  });
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Error loading departments:', err);
        setError('Failed to load departments. Please try again.');
      }
    };

    loadDepartments();

    if (isEditMode) {
      const loadUser = async () => {
        setLoading(true);
        try {
          const userData = await fetchUser(id);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            password: '',
            password_confirmation: '',
            department_id: userData.department_id || '',
            role: userData.role || 'user',
          });
        } catch (err) {
          console.error('Error loading user:', err);
          setError('Failed to load user data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      loadUser();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      if (isEditMode) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      navigate('/users');
    } catch (err) {
      console.error('Error saving user:', err);
      
      if (err.response && err.response.status === 422) {
        // Validation errors
        setValidationErrors(err.response.data.errors);
      } else {
        setError('Failed to save user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit User' : 'Create New User'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.department_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {validationErrors.department_id && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.department_id[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          {validationErrors.role && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.role[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password {isEditMode && '(leave blank to keep current password)'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            {...(!isEditMode && { required: true })}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
            }`}
            {...(!isEditMode && { required: true })}
          />
          {validationErrors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password_confirmation[0]}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;