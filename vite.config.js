import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        short_name: "TelanganaLive",
        name: "telangana.live — 2026 Civic Portal",
        icons: [
          {
            src: "/vite.svg",
            type: "image/svg+xml",
            sizes: "any"
          },
          {
            src: "/vite.svg",
            type: "image/svg+xml",
            sizes: "192x192",
            purpose: "maskable"
          },
          {
            src: "/vite.svg",
            type: "image/svg+xml",
            sizes: "512x512",
            purpose: "any"
          }
        ],
        start_url: "/",
        background_color: "#0F172A",
        display: "standalone",
        theme_color: "#0F172A",
        description: "The 2026-era civic portal for Hyderabad, Cyberabad, and Malkajgiri."
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/xgzxbenwlcmqtloajroi\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/tough-rat-69556\.upstash\.io\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'redis-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
