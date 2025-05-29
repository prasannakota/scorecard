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

export const fetchQuestionsByDepartments = async (departmentIds) => {
  const token = getAuthToken();
  const response = await axios.get(`/api/assessment/questions`, {
    params: { departments: departmentIds.join(',') },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; 
};

export const submitAnswer = async (payload) => {
  const token = getAuthToken();
  const response = await axios.post(`/api/assessment/answer`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  return response.data.data; 
};

export const startAssessment = async (departments) => {
  const token = getAuthToken();
  const response = await axios.post(
    `/api/start-assessment`,
    { departments },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data; 
};

export const getAssessmentStatus = async () => {
  const token = getAuthToken();
  const response = await axios.get(`/api/assessment-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const fetchAnswersByAssessmentId = async (assessmentId) => {
  const token = getAuthToken();
  const response = await axios.get(`/api/assessment-answers/${assessmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;  
};

export const updateScore = async (assessmentId, score) => {
  const token = getAuthToken();
  const response = await axios.post(
    `/api/update-score`,
    { assessment_id: assessmentId, score },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const fetchBusinessCategories = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`/api/business-category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};


