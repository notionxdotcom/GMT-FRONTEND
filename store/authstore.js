import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../interceptor';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      wallet: { balance: 0, totalDeposit: 0 },
      isLoggedIn: false,
      loading: false,

      syncAppData: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;

        set({ loading: true });
        try {
          const [userRes, walletRes] = await Promise.all([
            api.get('/user/me'), 
            api.get('/wallet/my-balance')
          ]);

          set({
            user: userRes.data,
            wallet: walletRes.data,
            loading: false
          });
        } catch (err) {
          console.error("Sync failed:", err);
          set({ loading: false });
          if (err.response?.status === 401) {
            get().logout();
          }
        }
      },

      // Updated: Accept token from login response
      setAuth: (userData, token) => {
        if (token) {
          localStorage.setItem('token', token); // Essential for the interceptor
        }
        set({ 
          user: userData, 
          isLoggedIn: true 
        });
        get().syncAppData();
      },

      logout: () => {
        // Clear the manual token
        localStorage.removeItem('token'); 
        // Clear the persisted state
        set({ user: null, wallet: { balance: 0, totalDeposit: 0 }, isLoggedIn: false });
        localStorage.removeItem('Notiox-auth-storage'); 
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }),
    { 
      name: 'Notiox-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn) {
          state.syncAppData();
        }
      }
    }
  )
);

export default useAuthStore;