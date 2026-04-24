import { create } from 'zustand';
import api from '../interceptor';

const useBankStore = create((set) => ({
  bankData: null,
  loading: false,
  error: null,

  // Fetch from backend
  fetchBankDetails: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/wallet/my-bank-details');
      set({ bankData: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Update store locally after a successful POST
  setBankData: (data) => set({ bankData: data }),

  // Clear on logout
  clearBankData: () => set({ bankData: null })
}));

export default useBankStore;