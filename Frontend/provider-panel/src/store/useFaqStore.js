import { create } from "zustand";
import { faqsApi } from "../lib/api";

/**
 * FAQ store — handles fetching, creating, updating, and deleting FAQs.
 * State is managed in memory (not persisted) to ensure data is always fresh.
 */
const useFaqStore = create((set, get) => ({
  faqs: [],
  isLoading: false,
  error: null,

  // Fetch all FAQs for the tenant
  fetchFaqs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await faqsApi.getAll();
      // Adjust according to your API response structure (e.g., response.data vs response)
      set({ 
        faqs: response.data || response, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Add a new FAQ
  addFaq: async (faqData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await faqsApi.create(faqData);
      const newFaq = response.data || response;
      
      // Update local state immediately so UI reacts without a refetch
      set((state) => ({ 
        faqs: [...state.faqs, newFaq], 
        isLoading: false 
      }));
      return newFaq;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update an existing FAQ
  updateFaq: async (id, faqData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await faqsApi.update(id, faqData);
      const updatedFaq = response.data || response;

      set((state) => ({
        // Support both '_id' (MongoDB default) and 'id'
        faqs: state.faqs.map((faq) => 
          (faq.id === id || faq._id === id) ? updatedFaq : faq
        ),
        isLoading: false
      }));
      return updatedFaq;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete an FAQ
  deleteFaq: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await faqsApi.delete(id);
      
      set((state) => ({
        faqs: state.faqs.filter((faq) => faq.id !== id && faq._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  reorderFaqs: (faqs) => set({ faqs }),

  // Optional: Clear errors manually if needed for UI resets
  clearError: () => set({ error: null })
}));

export default useFaqStore;