import { create } from "zustand";
import { appointmentApi } from "../lib/api";

/**
 * Appointment store — handles fetching, creating, updating, and deleting appointments.
 * State is managed in memory (not persisted) to ensure data is always fresh.
 */
const useAppointmentStore = create((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  // Fetch all appointments for the tenant
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentApi.getAll();
      // Adjust according to your API response structure (e.g., response.data vs response)
      set({
        appointments: response.data || response,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Add a new appointment
  addAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentApi.create(appointmentData);
      const newAppointment = response.data || response;

      // Update local state immediately so UI reacts without a refetch
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
      }));
      return newAppointment;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update an existing appointment
  // Update an existing appointment
  updateAppointmentStatus: async (id, status) => {
    // <-- Removed the 'd'
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentApi.update(id, { status });
      const updatedAppointment = response.data || response;

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id || appointment._id === id
            ? updatedAppointment
            : appointment,
        ),
        isLoading: false,
      }));
      return updatedAppointment;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete an appointment
  deleteAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentApi.delete(id);

      set((state) => ({
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== id && appointment._id !== id,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  reorderAppointments: (appointments) => set({ appointments }),

  // Optional: Clear errors manually if needed for UI resets
  clearError: () => set({ error: null }),
}));

export default useAppointmentStore;
