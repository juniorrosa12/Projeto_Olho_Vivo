import axios from "axios";

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8000`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisições: injeta o JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("olhovivo_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respostas: desloga se der 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("olhovivo_token");
      localStorage.removeItem("olhovivo_user");
    }
    return Promise.reject(error);
  }
);

export default api;
