import { create } from 'zustand';
import api from '../interceptor';
const useUserStore = create((set, get) => ({
  // --- STATE ---
  user: null,
  wallet: {
    balance: 0,
    totalDeposit: 0,
    totalWithdrawal: 0,
    currency: "₦"
  },
  loading: false,
  error: null,

  // --- ACTIONS ---
  
  // Initialize user and wallet data
  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      // Replace with your actual combined endpoint or multiple calls
      const response = await axios.get('/api/user/profile'); 
      const { user, wallet } = response.data;
      
      set({ 
        user, 
        wallet, 
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to load user data", 
        loading: false 
      });
    }
  },

  // Update wallet locally (useful after a deposit or transaction)
  updateBalance: (newBalance) => {
    set((state) => ({
      wallet: { ...state.wallet, balance: newBalance }
    }));
  },

  // Clear store (useful for Logout)
  clearUser: () => {
    set({ user: null, wallet: { balance: 0 }, error: null });
  },

  // Getter example (Computed property)
  getFormattedBalance: () => {
    const { balance, currency } = get().wallet;
    return `${currency}${balance.toLocaleString()}`;
  }
}));

export default useUserStore;