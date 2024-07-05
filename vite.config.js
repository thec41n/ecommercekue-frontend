import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://ecommercekue-backend-production.up.railway.app",
      "/uploads/": "https://ecommercekue-backend-production.up.railway.app",
    }
  }
})
