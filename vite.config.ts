import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: funciona em qualquer subcaminho do GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true },
  test: { environment: 'node' },
})
