// Recetas abiertas recientemente (guardadas en localStorage con timestamp).
// Sirve para la sección "Usadas recientemente" en la pantalla de inicio.
const KEY = 'italo-recientes'
const MAX = 12

function leer() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

// Registra que se abrió una receta (la pone de primera).
export function registrarReciente(id, ts) {
  try {
    const arr = leer().filter((x) => x && x.id !== id)
    arr.unshift({ id, ts: ts || Date.now() })
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAX)))
  } catch {
    /* si localStorage falla (modo privado / cuota), no es crítico */
  }
}

// Devuelve los IDs de las últimas recetas abiertas (más reciente primero).
export function getRecientesIds(limit = 4) {
  return leer()
    .slice(0, limit)
    .map((x) => x.id)
}
