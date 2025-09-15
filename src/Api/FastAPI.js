import axios from 'axios';

// Axios instance for the FastAPI backend (Chat)
const fastApi = axios.create({
  baseURL: "http://localhost:8000",
});

export default fastApi;