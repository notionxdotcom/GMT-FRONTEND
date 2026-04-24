import { create } from 'zustand';
import api from '../interceptor'; // Use your custom instance with credentials

const useDataStore = create((set) => ({
  stories: [],
  isLoading: false,
  error: null,

  // Action: Fetch all stories
  fetchStories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/stories');
      set({ stories: response.data, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch stories", 
        isLoading: false 
      });
    }
  },

  // Action: Add a new story locally (Optimistic Update)
  addStoryLocal: (newStory) => set((state) => ({ 
    stories: [newStory, ...state.stories] 
  })),

  // Action: Clear store
  clearData: () => set({ stories: [], error: null })
}));

export default useDataStore;