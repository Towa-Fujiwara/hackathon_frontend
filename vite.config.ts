import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hackathon-backend-723035348521.us-central1.run.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
