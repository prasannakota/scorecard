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
 * Fetch users with pagination and search
 * @param {number} page - Page number
 * @param {string} search - Search term
 * @returns {Promise} - Promise with users data
 */
export const fetchUsers = async (page = 1, search = '') => {
  try {
    const response = await api.get(`/api/admin/users`, {
      params: { page, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a single user by ID
 * @param {number} id - User ID
 * @returns {Promise} - Promise with user data
 */
export const fetchUser = async (id) => {
  try {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise} - Promise with created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise with updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise} - Promise with deletion status
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export default {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
};