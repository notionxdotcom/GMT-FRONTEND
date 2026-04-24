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

      // 1. BETTER SYNC: Remove the need for ID in URL if possible
      // Usually, backend should get ID FROM THE COOKIE (JWT) 
      // rather than the URL for security.
      syncAppData: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;

        set({ loading: true });
        try {
          // If your backend is setup correctly, you shouldn't need to pass user._id
          // The backend gets the ID from the decoded cookie/token.
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

      setAuth: (userData) => {
        set({ 
          user: userData, 
          isLoggedIn: true 
        });
        // Immediately sync data after logging in
        get().syncAppData();
      },

      logout: () => {
        // Clear everything
        set({ user: null, wallet: { balance: 0, totalDeposit: 0 }, isLoggedIn: false });
        // Use removeitem instead of clear to avoid nuking other app settings
        localStorage.removeItem('Notiox-auth-storage'); 
      }
    }),
    { 
      name: 'Notiox-auth-storage',
      // Ensure the store is hydrated before trying to use it
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn) {
          state.syncAppData();
        }
      }
    }
  )
);

export default useAuthStore;