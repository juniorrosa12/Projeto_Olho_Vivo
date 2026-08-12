import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/live': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/static': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/connector': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/events': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/auth': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/validation': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/dataset': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/dashboard': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/heatmap': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/tracks': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/annotations': { target: 'http://backend:8000', changeOrigin: true, secure: false },
      '/roi': { target: 'http://backend:8000', changeOrigin: true, secure: false },
    },
  },
})
