import axios from 'axios';

// Axios instance for the FastAPI backend (Chat)
const instance = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL || "http://localhost:8000",
});

export default instance;