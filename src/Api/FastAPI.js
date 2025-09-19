import axios from 'axios';

// Axios instance for the FastAPI backend (Chat)
const fastApi = axios.create({
  baseURL: process.env.REACT_APP_FASTAPI_URL,
});

export default fastApi;