import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Auto-switch: Production = relative path, Local = /
  // Using './' is safer for GitHub Pages as it handles any repo name
  base: command === 'build' ? './' : '/',
  server: {
    host: '0.0.0.0', // Expose to network
    // Proxy for Local Development (Backend ON)
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
}))
