import axios from 'axios';

export async function fetchQuestions() {
  const res = await axios.get('/api/admin/questions');
  return res.data;
}

export async function saveQuestions(questions) {
  const res = await axios.post('/api/admin/questions/save', { questions });
  return res.data;
}

// utils/api.js or wherever you keep your API calls
export async function saveOption(options, questionId) {
    const res = await axios.post('/api/admin/options/saveOption', {
        options,
        questionId
    });
    return res.data.data;
}

// utils/api.js or wherever you keep your API calls
export async function updateOption(options) {
    const res = await axios.post('/api/admin/options/updateOption', {
        options
    });
    return res.data.data;
}