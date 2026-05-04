/**
 * API client for communicating with backend microservices.
 * Centralizes all API calls and error handling.
 *
 * Development: Uses Vite proxy (e.g., /api/auth)
 * Production: Uses environment variables with full URLs
 */

import useAuthStore from '../store/useAuthStore';

/**
 * Helper to build API URL based on environment
 */
const getApiUrl = (service) => {
  if (import.meta.env.local) {
    // In development, use Vite proxy paths
    const proxyMap = {
      auth: "/api/auth",
      appointments: "/api/appointments",
      chat: "/api/chat",
      faqs: "/api/faqs",
      tenant: "/api/tenants",
    };
    return proxyMap[service] || "/api/auth";
  } else {
    // In production, use environment variables
    const envMap = {
      auth: import.meta.env.VITE_AUTH_API_URL,
      appointments: import.meta.env.VITE_APPOINTMENT_API_URL,
      chat: import.meta.env.VITE_CHAT_API_URL,
      faqs: import.meta.env.VITE_FAQS_API_URL,
      tenant: import.meta.env.VITE_TENANT_API_URL,
    };
    return envMap[service] || import.meta.env.VITE_AUTH_API_URL;
  }
};

const apiClient = async (service, endpoint, options = {}) => {
  const baseUrl = getApiUrl(service);
  const token = useAuthStore.getState().token; // Get token synchronously from Zustand
  
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      credentials: "include", // Send cookies with requests (JWT token)
      ...options,
      headers,
    });

    // Read response as text first to handle empty bodies
    const text = await response.text();
    let data = null;

    // Only parse JSON if there's content
    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          `Failed to parse JSON response from ${service}:`,
          parseError,
        );
        throw new Error(`Invalid JSON response from ${service}`);
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`${service} API Error:`, error);
    throw error;
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * AUTH Microservice (Port 5000)
 * ═══════════════════════════════════════════════════════════════════
 */
export const authApi = {
  signup: (email, password, docName) =>
    apiClient("auth", "/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, docName }),
    }),

  login: (email, password) =>
    apiClient("auth", "/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiClient("auth", "/logout", { method: "POST" }),

  getMe: () => apiClient("auth", "/me", { method: "GET" }),
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * APPOINTMENT Microservice (Port 5001)
 * ═══════════════════════════════════════════════════════════════════
 */
export const appointmentApi = {
  getAll: () => apiClient("appointments", "/", { method: "GET" }),

  create: (appointmentData) =>
    apiClient("appointments", "/", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }),

  getById: (id) => apiClient("appointments"`/${id}`, { method: "GET" }),

  update: (id, appointmentData) =>
    apiClient("appointments", `/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(appointmentData),
    }),

  delete: (id) => apiClient("appointments", `/${id}`, { method: "DELETE" }),
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * CHAT Microservice (Port 5002)
 * ═══════════════════════════════════════════════════════════════════
 */
export const chatApi = {
  getChats: () => apiClient("chat", "/", { method: "GET" }),

  startChat: (data) =>
    apiClient("chat", "/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendMessage: (chatId, message) =>
    apiClient("chat", `/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  getMessages: (chatId) =>
    apiClient("chat", `/${chatId}/messages`, { method: "GET" }),
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * FAQs Microservice (Port 5003)
 * ═══════════════════════════════════════════════════════════════════
 */
export const faqsApi = {
  getAll: () => apiClient("faqs", "/", { method: "GET" }),

  create: (faqData) =>
    apiClient("faqs", "/", {
      method: "POST",
      body: JSON.stringify(faqData),
    }),

  getById: (id) => apiClient("faqs", `/${id}`, { method: "GET" }),

  update: (id, faqData) =>
    apiClient("faqs", `/${id}`, {
      method: "PUT",
      body: JSON.stringify(faqData),
    }),

  delete: (id) => apiClient("faqs", `/${id}`, { method: "DELETE" }),
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * TENANT Microservice (Port 5004)
 * ═══════════════════════════════════════════════════════════════════
 */
export const tenantApi = {
  getSettings: () => apiClient("tenant", "/settings", { method: "GET" }),

  updateSettings: (settings) =>
    apiClient("tenant", "/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  getProfile: () => apiClient("tenant", "/profile", { method: "GET" }),

  updateProfile: (profileData) =>
    apiClient("tenant", "/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  regenerateApiKey: () =>
    apiClient("tenant", "/regenerate-api-key", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getImageKitAuth: () =>
    apiClient("tenant", "/imagekit-auth", { method: "GET" }),


};

export default apiClient;
