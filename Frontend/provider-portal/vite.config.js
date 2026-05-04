import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // AUTH Microservice — Port 5000
      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // TENANT Microservice — Port 5001
      '/api/tenants': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // FAQs Microservice — Port 5002
      '/api/faqs': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      // APPOINTMENT Microservice — Port 5003
      '/api/appointments': {
        target: 'http://localhost:5003',
        changeOrigin: true,
      },
      // CHAT Microservice — Port 5004
      '/api/chat': {
        target: 'http://localhost:5004',
        changeOrigin: true,
      },
    },
  },
})
