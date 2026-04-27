import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../interceptor';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      wallet: null, // Start as null to avoid showing "₦0" while loading
      isLoggedIn: false,
      loading: false,

      syncAppData: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;

        set({ loading: true });
        try {
          // Use Promise.all to fetch both simultaneously
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
          
          // If the token is invalid/expired, boot them out
          if (err.response?.status === 401) {
            get().logout();
          }
        }
      },

      setAuth: (userData, token) => {
        if (token) {
          localStorage.setItem('token', token);
        }
        
        set({ 
          user: userData, 
          isLoggedIn: true 
        });

        // Trigger sync immediately to get the FRESH wallet for THIS user
        get().syncAppData();
      },

      logout: () => {
        // 1. Remove tokens
        localStorage.removeItem('token'); 
        
        // 2. Clear state completely (The "Nuclear" option to prevent ID mismatch)
        set({ 
          user: null, 
          wallet: null, 
          isLoggedIn: false, 
          loading: false 
        });

        // 3. Purge the persisted storage
        localStorage.removeItem('Notiox-auth-storage'); 
        
        // 4. Redirect
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }),
    { 
      name: 'Notiox-auth-storage',
      // This ensures that when the app reloads, we check if the user is still valid
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn) {
          state.syncAppData();
        }
      }
    }
  )
);

export default useAuthStore;