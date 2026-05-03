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
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'),
      },
      // APPOINTMENT Microservice — Port 5001
      '/api/appointments': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/appointments/, '/api/appointments'),
      },
      // CHAT Microservice — Port 5002
      '/api/chat': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/api/chat'),
      },
      // FAQs Microservice — Port 5003
      '/api/faqs': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/faqs/, '/api/faqs'),
      },
      // TENANT Microservice — Port 5004
      '/api/tenant': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tenant/, '/api/tenant'),
      },
    },
  },
})
