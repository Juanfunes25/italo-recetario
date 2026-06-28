// Genera los PNG de la PWA a partir de icon-source.svg.
// Uso: node scripts/gen-icons.js   (solo se corre cuando cambia el ícono)
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(join(__dirname, 'icon-source.svg'))
const out = join(__dirname, '..', 'public')

const targets = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-64.png', size: 64 },
]

for (const t of targets) {
  await sharp(svg).resize(t.size, t.size).png().toFile(join(out, t.file))
  console.log('  ✓', t.file)
}
console.log('Íconos generados en /public')
