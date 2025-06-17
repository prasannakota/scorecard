import axios from 'axios';

// Configure axios with CSRF token
const api = axios.create({
  headers: {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

/**
 * Fetch all departments
 * @returns {Promise} - Promise with departments data
 */
export const fetchDepartments = async () => {
  try {
    const response = await api.get('/api/admin/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Fetch a single department by ID
 * @param {number} id - Department ID
 * @returns {Promise} - Promise with department data
 */
export const fetchDepartment = async (id) => {
  try {
    const response = await api.get(`/api/admin/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new department
 * @param {Object} departmentData - Department data
 * @returns {Promise} - Promise with created department data
 */
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post('/api/admin/departments', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

/**
 * Update an existing department
 * @param {number} id - Department ID
 * @param {Object} departmentData - Department data to update
 * @returns {Promise} - Promise with updated department data
 */
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await api.put(`/api/admin/departments/${id}`, departmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a department
 * @param {number} id - Department ID
 * @returns {Promise} - Promise with deletion status
 */
export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/api/admin/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    throw error;
  }
};

export default {
  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};