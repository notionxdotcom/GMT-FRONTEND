import axios from 'axios';
import useAuthStore from './store/authstore';

const api = axios.create({
  baseURL: 'gmt-backend-production.up.railway.appgmt-backend-production.up.railway.app/api', 
  // withCredentials is no longer strictly needed for LocalStorage, 
  // but you can keep it if you still use other cookie features.
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Grab the token from LocalStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Manually inject the token into the headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or invalid token. Logging out...");
      
      // Clear LocalStorage so the user stays logged out
      localStorage.removeItem('token');
      
      const { logout } = useAuthStore.getState(); 
      logout();
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;