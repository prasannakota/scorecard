import axios from 'axios';

const getAuthToken = () => sessionStorage.getItem("authorization");

export const fetchAssessmentOptions = async () => {
  const token = getAuthToken();
  const response = await axios.get('/api/assessment/form-data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAssessment = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get('/api/assessment', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assessment:', error);
    throw error;
  }
};

export const saveAssessment = async (payload) => {
  const token = getAuthToken();
  try {
    const response = await axios.post('/api/assessment', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save assessment:', error);
    throw error;
  }
};

export const fetchDepartments = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get('/api/department', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    throw error;
  }
};