import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    fs: {
      strict: false // Desactiva restricciones de acceso a archivos ocultos como .well-known
    }
  },
  preview: {
    allowedHosts: ['mentorhub.info.gf']
  },
  resolve: {
    alias: {
      '.well-known': '/public/.well-known'
    }
  },
  publicDir: 'public' // Ahora está en la posición correcta
})
