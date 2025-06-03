import axios from 'axios';

export async function fetchQuestions() {
  const res = await axios.get('/api/admin/questions');
  return res.data;
}

export async function saveQuestions(questions) {
  const res = await axios.post('/api/admin/questions/save', { questions });
  return res.data;
} 