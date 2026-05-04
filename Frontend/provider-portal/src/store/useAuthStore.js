import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateApiKey } from "../lib/utils";
import { authApi } from "../lib/api";

/**
 * Auth store — handles login state, user session, and API key.
 * Persisted to localStorage so the session survives page refresh.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      apiKey: null,
      isAuthenticated: false,

      // Login with real API call
      login: async (email, password) => {
        try {
          const response = await authApi.login(email, password);
          set({
            user: {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.docName || "Doctor",
              plan: "pro",
              avatar: null,
            },
            token: response.data.token,
            isAuthenticated: true,
          });
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null });
          throw error;
        }
      },

      // Register with real API call
      register: async (clinicData) => {
        try {
          const response = await authApi.signup(
            clinicData.email,
            clinicData.password,
            clinicData.clinicName,
          );
          set({
            user: {
              id: response.data.user.id,
              email: response.data.user.email,
              name: clinicData.clinicName,
              plan: "starter",
              avatar: null,
            },
            token: response.data.token,
            apiKey: response.data.apiKey,
            isAuthenticated: true,
          });
          return response.data.apiKey;
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            apiKey: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, apiKey: null, isAuthenticated: false });
        }
      },

      // Add this right below your existing logout function:
      setOAuthData: (user, token, apiKey) => {
        set({
          user,
          token,
          apiKey: apiKey || get().apiKey, // keep existing or set new
          isAuthenticated: true,
        });
      },

      // Generate a local API key (for initialization only)
      // NOTE: The actual API key should be managed by the TENANT service
      // This is just for fallback/local initialization
      regenerateApiKey: () => {
        const key = generateApiKey();
        set({ apiKey: key });
        return key;
      },

      // Get or initialize API key (local fallback)
      // Real API key regeneration happens via useClinicStore.regenerateApiKeyOnApi()
      getApiKey: () => {
        const { apiKey } = get();
        if (apiKey) return apiKey;
        const key = generateApiKey();
        set({ apiKey: key });
        return key;
      },
    }),
    {
      name: "linor-auth",
      // Only persist what's needed — avoid leaking sensitive data
      partialize: (state) => ({
        user: state.user,
        token: state.token, 
        apiKey: state.apiKey,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
