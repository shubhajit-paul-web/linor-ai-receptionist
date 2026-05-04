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
  // Always use environment variables — they are set correctly in .env.local
  const envMap = {
    auth: import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/auth",
    appointments: import.meta.env.VITE_APPOINTMENT_API_URL || "http://localhost:5003/api/appointments",
    chat: import.meta.env.VITE_CHAT_API_URL || "http://localhost:5004/api/chat",
    faqs: import.meta.env.VITE_FAQS_API_URL || "http://localhost:5002/api/faqs",
    tenant: import.meta.env.VITE_TENANT_API_URL || "http://localhost:5001/api/tenants",
  };
  return envMap[service] || envMap.auth;
};

const apiClient = async (service, endpoint, options = {}) => {
  const baseUrl = getApiUrl(service);
  const { token, apiKey } = useAuthStore.getState();
  
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Chat, FAQ, appointment services authenticate via x-api-key (tenant key)
    if (apiKey && ["chat", "faqs", "appointments"].includes(service)) {
      headers["x-api-key"] = apiKey;
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

  getById: (id) => apiClient("appointments", `/${id}`, { method: "GET" }),

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
  // POST /api/chat — send a message to the AI (used by chat widget only)
  sendMessage: (data) =>
    apiClient("chat", "/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // GET /api/chat/sessions — provider portal chat logs
  getSessions: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.page)      qs.set("page",      String(params.page));
    if (params.limit)     qs.set("limit",     String(params.limit));
    if (params.outcome && params.outcome !== "All") qs.set("outcome", params.outcome);
    if (params.sentiment && params.sentiment !== "All") qs.set("sentiment", params.sentiment);
    if (params.search)    qs.set("search",    params.search);
    if (params.transferred) qs.set("transferred", "true");
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient("chat", `/sessions${query}`, { method: "GET" });
  },

  // POST /api/chat/transfer — request human agent handover
  requestTransfer: (sessionId) =>
    apiClient("chat", "/transfer", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),

  // GET /api/chat/clinic-info — fetch widget config from backend
  getClinicInfo: () => apiClient("chat", "/clinic-info", { method: "GET" }),
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
