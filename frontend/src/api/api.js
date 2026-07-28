import axios from "axios";

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8000`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
