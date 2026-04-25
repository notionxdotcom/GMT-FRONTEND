import axios from 'axios';
import useAuthStore from './store/authstore';

const api = axios.create({
  baseURL:  'https://sublime-optimism-production-20d2.up.railway.app/api', 

  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // We don't manually set the Authorization header here.
    // The browser handles the cookie injection because of withCredentials: true.
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401, it means the cookie is missing, 
    // expired, or invalid.
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      
      const { logout } = useAuthStore.getState(); 
      logout();

      // We don't need localStorage.removeItem('token') because there is no token in storage.
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;