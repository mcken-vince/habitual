import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Habitual',
        short_name: 'Habitual',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2086f7',
        icons: [
          {
            src: '/src/assets/continuity_128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/src/assets/continuity_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})