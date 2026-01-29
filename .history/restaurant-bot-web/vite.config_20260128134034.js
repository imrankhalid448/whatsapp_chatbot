import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      'craniometrically-pseudoconfessional-esmeralda.ngrok-free.dev',
      'whatsappchatbot-production-d846.up.railway.app'
    ]
  },
  preview: {
    allowedHosts: [
      'whatsappchatbot-production-d846.up.railway.app'
    ]
  }
})
