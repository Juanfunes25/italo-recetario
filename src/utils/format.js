// Utilidades de formato y datos

// ID único sencillo (no necesitamos uuid completo).
// Usa un contador incremental para evitar colisiones cuando se generan
// muchos IDs en el mismo instante (ej: al sembrar varias recetas).
let _contador = 0
export function uid(prefix = 'r') {
  _contador = (_contador + 1) % 1000000
  return `${prefix}_${Date.now().toString(36)}_${_contador.toString(36)}`
}

export const CATEGORIAS = [
  { id: 'helados', nombre: 'Helados', emoji: '🍦', color: 'helados' },
  { id: 'pan', nombre: 'Pan', emoji: '🍞', color: 'pan' },
  { id: 'bebidas', nombre: 'Bebidas', emoji: '🥤', color: 'bebidas' },
  { id: 'comidas', nombre: 'Comidas', emoji: '🍽️', color: 'comidas' },
]

export const UNIDADES = ['kg', 'g', 'L', 'ml', 'oz', 'unidad', 'cda', 'cdta', 'taza', 'pizca']

export function categoriaInfo(id) {
  return CATEGORIAS.find((c) => c.id === id) || CATEGORIAS[0]
}

// Formatea una cantidad escalada: quita decimales innecesarios y redondea bonito
export function formatQty(n) {
  if (n === null || n === undefined || isNaN(n)) return ''
  const num = Number(n)
  // Redondea a 2 decimales pero limpia ceros
  let r = Math.round(num * 100) / 100
  if (Number.isInteger(r)) return String(r)
  // Hasta 2 decimales
  return r.toFixed(2).replace(/\.?0+$/, '')
}

export function formatTime(min) {
  if (!min) return '—'
  const m = Number(min)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h} h ${r} min` : `${h} h`
}

// Normaliza texto para búsqueda (sin acentos, minúsculas)
export function normalize(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}
