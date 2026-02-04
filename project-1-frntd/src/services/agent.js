import axios from 'axios';

const API_URL = 'http://localhost:3000';

const agent = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Check authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await agent.get('/auth/status');
    return response.data;
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};

export default agent;