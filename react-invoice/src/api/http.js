// src/api/http.js
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000",
});

// Automatically add Authorization and Content-Type
http.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If not already set
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default http;
