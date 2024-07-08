import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "https://ecommercekue-backend-production.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/uploads/": {
        target: "https://ecommercekue-backend-production.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
