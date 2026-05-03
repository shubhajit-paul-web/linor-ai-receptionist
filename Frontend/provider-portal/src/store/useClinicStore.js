import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MOCK_FAQS,
  DEFAULT_WORKING_HOURS,
  DEFAULT_WORKING_HOURS_CONFIG,
  DEFAULT_SERVICES,
  DEFAULT_WIDGET_SETTINGS,
  MOCK_APPOINTMENTS,
  MOCK_CHAT_SESSIONS,
  MOCK_ORIGINS,
} from "../lib/mockData";
import {
  normalizeWorkingHoursConfig,
  createDefaultWorkingHoursConfig,
  convertConfigToBackendFormat,
} from "../lib/workingHours";
import { tenantApi } from "../lib/api";
import useAuthStore from "./useAuthStore";

/**
 * Clinic store — single source of truth for all clinic-specific data.
 * In a multi-tenant setup, this would be fetched per-clinic on login.
 */
const useClinicStore = create(
  persist(
    (set, get) => ({
      // ─── Clinic Profile ───────────────────────────────────────
      clinic: {
        name: "HealthFirst Clinic",
        description:
          "A modern primary care clinic serving the community since 2010.",
        website: "https://healthfirstclinic.com",
        logo: null,
        address: "123 Medical Drive",
        city: "San Francisco",
        postalCode: "94102",
        phone: "+1 (415) 555-0182",
        email: "hello@healthfirstclinic.com",
        isPro: true,
        setupSteps: {
          clinicInfo: true,
          faqs: false,
          workingHours: true,
          embedWidget: false,
        },
      },

      // ─── Working Hours ─────────────────────────────────────────
      workingHours: normalizeWorkingHoursConfig(DEFAULT_WORKING_HOURS_CONFIG),

      // ─── Services ──────────────────────────────────────────────
      services: DEFAULT_SERVICES,

      // ─── Widget Settings ────────────────────────────────────────
      widgetSettings: DEFAULT_WIDGET_SETTINGS,

      // ─── FAQs ──────────────────────────────────────────────────
      faqs: MOCK_FAQS,

      // ─── Appointments (mock, would come from API) ────────────────
      appointments: MOCK_APPOINTMENTS,

      // ─── Chat Sessions ──────────────────────────────────────────
      chatSessions: MOCK_CHAT_SESSIONS,

      // ─── Allowed Origins ────────────────────────────────────────
      allowedOrigins: MOCK_ORIGINS,

      // ─── Actions ────────────────────────────────────────────────

      updateClinic: (data) =>
        set((s) => ({ clinic: { ...s.clinic, ...data } })),

      // Legacy-compatible setter (array/object)
      updateWorkingHours: (hours) =>
        set({
          workingHours: normalizeWorkingHoursConfig(
            hours ?? DEFAULT_WORKING_HOURS,
          ),
        }),

      // Canonical setter for the dedicated Working Hours page
      updateWorkingHoursConfig: (updater) =>
        set((s) => {
          const next =
            typeof updater === "function" ? updater(s.workingHours) : updater;
          return { workingHours: normalizeWorkingHoursConfig(next) };
        }),

      resetWorkingHoursConfig: () =>
        set({ workingHours: createDefaultWorkingHoursConfig() }),

      addService: (service) =>
        set((s) => ({ services: [...s.services, service] })),

      removeService: (service) =>
        set((s) => ({ services: s.services.filter((sv) => sv !== service) })),

      reorderServices: (services) => set({ services }),

      updateWidgetSettings: (settings) =>
        set((s) => ({ widgetSettings: { ...s.widgetSettings, ...settings } })),

      // FAQ CRUD
      // addFaq: (faq) =>
      //   set((s) => ({
      //     faqs: [...s.faqs, { ...faq, id: `faq-${Date.now()}`, hits: 0 }],
      //   })),

      // updateFaq: (id, data) =>
      //   set((s) => ({
      //     faqs: s.faqs.map((f) => (f.id === id ? { ...f, ...data } : f)),
      //   })),

      // deleteFaq: (id) =>
      //   set((s) => ({ faqs: s.faqs.filter((f) => f.id !== id) })),

      // reorderFaqs: (faqs) => set({ faqs }),

      // Appointment status
      updateAppointmentStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        })),

      // Allowed origins
      addOrigin: (domain) =>
        set((s) => ({ allowedOrigins: [...s.allowedOrigins, domain] })),

      removeOrigin: (domain) =>
        set((s) => ({
          allowedOrigins: s.allowedOrigins.filter((o) => o !== domain),
        })),

      // Mark a setup step as complete
      completeSetupStep: (step) =>
        set((s) => ({
          clinic: {
            ...s.clinic,
            setupSteps: { ...s.clinic.setupSteps, [step]: true },
          },
        })),

      // Reset all FAQs (danger zone)
      resetFaqs: () => set({ faqs: [] }),

      // ─── API Integration ────────────────────────────────────────

      /**
       * Load clinic profile from backend API
       * Maps backend response to frontend clinic store structure
       */
      loadProfileFromApi: async () => {
        try {
          const response = await tenantApi.getProfile();
          if (response?.data) {
            const backendProfile = response.data;


            // Map backend fields to frontend clinic structure
            const clinicData = {
              name: backendProfile.clinicName || "HealthFirst Clinic",
              description: backendProfile.welcomeMsg || "",
              logo: backendProfile.logoUrl || null,
              address: backendProfile.address || "",
              phone: backendProfile.phone || "",
              website: backendProfile.website || "",
              city: backendProfile.city || "",
              postalCode: backendProfile.postalCode || "",
              email: backendProfile.email || "",
            };
            set((s) => ({
              clinic: { ...s.clinic, ...clinicData },
            }));
            // Update services if available
            if (backendProfile.services?.length > 0) {
              set({ services: backendProfile.services });
            }
            // Update working hours if available
            if (backendProfile.workingHrs) {
              set({
                workingHours: normalizeWorkingHoursConfig(
                  backendProfile.workingHrs,
                ),
              });
            }
            return response.data;
          }
        } catch (error) {
          console.error("Failed to load clinic profile:", error);
          throw error;
        }
      },

      /**
       * Update clinic profile on backend API
       * Maps frontend clinic data to backend expected format
       */
      updateProfileOnApi: async (clinicData) => {
        try {
          // Map frontend fields to backend format
          const payload = {
            clinicName: clinicData.name,
            welcomeMsg: clinicData.description,
            logoUrl: clinicData.logo,
            address: clinicData.address,
            phone: clinicData.phone,
            website: clinicData.website,
            city: clinicData.city,
            postalCode: clinicData.postalCode,
            email: clinicData.email,
            ...(clinicData.services && { services: clinicData.services }),
            ...(clinicData.workingHours && {
              workingHrs: convertConfigToBackendFormat(clinicData.workingHours),
            }),
          };

          const response = await tenantApi.updateProfile(payload);

          if (response?.success) {
            // Update local store with confirmed data
            set((s) => ({
              clinic: { ...s.clinic, ...clinicData },
            }));
            return response;
          }
        } catch (error) {
          console.error("Failed to update clinic profile:", error);
          throw error;
        }
      },

      /**
       * Regenerate API key for clinic
       * Returns new API key for embed script
       */
      regenerateApiKeyOnApi: async () => {
        try {
          const response = await tenantApi.regenerateApiKey();
          if (response?.success && response?.apiKey) {
            // Update auth store with new API key so it persists
            useAuthStore.setState({ apiKey: response.apiKey });

            return response.apiKey;
          } else if (response?.apiKey) {
            // Handle case where response doesn't have success flag
            useAuthStore.setState({ apiKey: response.apiKey });
            return response.apiKey;
          }
          throw new Error("No API key returned from server");
        } catch (error) {
          console.error("Failed to regenerate API key:", error);
          throw error;
        }
      },
    }),
    {
      name: "linor-clinic",
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object")
          return persistedState;
        return {
          ...persistedState,
          workingHours: normalizeWorkingHoursConfig(
            persistedState.workingHours,
          ),
        };
      },
    },
  ),
);

export default useClinicStore;
