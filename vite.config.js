import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Nombre del repositorio en GitHub. La app se publicará en:
//   https://TU-USUARIO.github.io/italo-recetario/
// ⚠️ El repositorio en GitHub DEBE llamarse exactamente así.
const REPO = 'italo-recetario'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // En desarrollo se sirve en la raíz; al publicar, bajo /italo-recetario/
  const base = command === 'build' ? `/${REPO}/` : '/'

  return {
    base,
    server: { port: 3200, host: true }, // host:true => accesible desde la tablet por IP
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        workbox: {
          // Cachea toda la app para que funcione sin internet
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
          navigateFallback: `${base}index.html`,
          cleanupOutdatedCaches: true,
        },
        manifest: {
          name: 'Italo Recetario',
          short_name: 'Recetario',
          description: 'Recetario digital de Italo Gelateria — helados, pan y bebidas.',
          lang: 'es',
          // Rutas relativas => funcionan tanto en la raíz como bajo /italo-recetario/
          start_url: '.',
          scope: '.',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#FAF4E8',
          theme_color: '#C5603C',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        devOptions: { enabled: true }, // permite probar la PWA en modo dev
      }),
    ],
  }
})
