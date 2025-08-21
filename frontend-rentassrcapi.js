import axios from 'axios';

// En Vercel usaremos VITE_API_URL como env variable
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({ baseURL });
export default api;
