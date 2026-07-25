import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Serve archive pages under /past/YEAR/ as static HTML (not SPA fallback).
function pastSitesStatic(): Plugin {
  return {
    name: 'past-sites-static',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? ''
        if (url.startsWith('/past/') && (url.endsWith('/') || /^\/past\/[^/]+$/.test(url))) {
          const base = url.endsWith('/') ? url : `${url}/`
          req.url = `${base}index.html`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), pastSitesStatic()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
