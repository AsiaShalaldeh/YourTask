import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized response - token expired
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_image');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
