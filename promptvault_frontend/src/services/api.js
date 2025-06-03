// services/api.js

import axios from 'axios';

const ACCESS_TOKEN = 'access_token';
const GOOGLE_ACCESS_TOKEN = 'GOOGLE_ACCESS_TOKEN';

const debug = import.meta.env.VITE_APP_DEBUG;
const address = debug ? "http://127.0.0.1:8000" : "https://promptvault.onrender.com"; 

const apiClient = axios.create({
  baseURL: `${address}/api`,
  withCredentials: true,
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
    if (googleAccessToken) {
      config.headers["X-Google-Access-Token"] = googleAccessToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;