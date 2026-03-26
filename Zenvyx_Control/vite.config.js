import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Passagem secreta para os Dados (Estoque)
      '/api/zoho': {
        target: 'https://www.zohoapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zoho/, '')
      },
      // 2. Passagem secreta para as Senhas (Tokens)
      '/api/zoho-auth': {
        target: 'https://accounts.zoho.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zoho-auth/, '')
      }
    }
  }
})