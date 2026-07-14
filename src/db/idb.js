// ===========================================================
// Capa de datos — IndexedDB (vía idb).
// Las recetas (incluidas sus fotos en base64) se guardan aquí.
// Es persistente: no se pierde al cerrar la app ni sin internet.
//
// v2: se agregan los stores "insumos" (inventario de ingredientes base) y
//     "movimientos" (entradas/salidas de inventario). La migración es
//     aditiva: NO toca las recetas ni la config existentes.
// ===========================================================
import { openDB } from 'idb'

const DB_NAME = 'italo-recetario'
const DB_VERSION = 2
const STORE = 'recetas'
const SETTINGS = 'config'
const INSUMOS = 'insumos'
const MOVIMIENTOS = 'movimientos'

let _dbPromise = null

function getDB() {
  if (!_dbPromise) {
    _dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: 'id' })
          s.createIndex('categoria', 'categoria')
          s.createIndex('actualizado', 'actualizado')
        }
        if (!db.objectStoreNames.contains(SETTINGS)) {
          db.createObjectStore(SETTINGS, { keyPath: 'clave' })
        }
        // v2 — inventario
        if (!db.objectStoreNames.contains(INSUMOS)) {
          const i = db.createObjectStore(INSUMOS, { keyPath: 'id' })
          i.createIndex('nombre', 'nombre')
        }
        if (!db.objectStoreNames.contains(MOVIMIENTOS)) {
          const m = db.createObjectStore(MOVIMIENTOS, { keyPath: 'id' })
          m.createIndex('insumoId', 'insumoId')
          m.createIndex('fecha', 'fecha')
        }
      },
    })
  }
  return _dbPromise
}

// ---- Recetas ----
export async function getAllRecipes() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function getRecipe(id) {
  const db = await getDB()
  return db.get(STORE, id)
}

export async function saveRecipe(receta) {
  const db = await getDB()
  await db.put(STORE, receta)
  return receta
}

export async function deleteRecipe(id) {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function bulkAddRecipes(recetas) {
  const db = await getDB()
  const tx = db.transaction(STORE, 'readwrite')
  await Promise.all(recetas.map((r) => tx.store.put(r)))
  await tx.done
}

// ---- Config (PIN admin, flags) ----
export async function getSetting(clave, fallback = null) {
  const db = await getDB()
  const row = await db.get(SETTINGS, clave)
  return row ? row.valor : fallback
}

export async function setSetting(clave, valor) {
  const db = await getDB()
  await db.put(SETTINGS, { clave, valor })
}

// ---- Insumos (inventario) ----
export async function getAllInsumos() {
  const db = await getDB()
  return db.getAll(INSUMOS)
}

export async function getInsumo(id) {
  const db = await getDB()
  return db.get(INSUMOS, id)
}

export async function saveInsumo(insumo) {
  const db = await getDB()
  await db.put(INSUMOS, insumo)
  return insumo
}

export async function deleteInsumo(id) {
  const db = await getDB()
  await db.delete(INSUMOS, id)
}

export async function bulkAddInsumos(insumos) {
  const db = await getDB()
  const tx = db.transaction(INSUMOS, 'readwrite')
  await Promise.all(insumos.map((i) => tx.store.put(i)))
  await tx.done
}

// Actualiza el stock de varios insumos y registra movimientos en una sola
// transacción (para descuento por producción). `updates`: [{insumoId, nuevoStock}].
export async function aplicarStockYMovimientos(updates, movimientos) {
  const db = await getDB()
  const tx = db.transaction([INSUMOS, MOVIMIENTOS], 'readwrite')
  const sInsumos = tx.objectStore(INSUMOS)
  const sMov = tx.objectStore(MOVIMIENTOS)
  for (const u of updates) {
    const insumo = await sInsumos.get(u.insumoId)
    if (insumo) {
      insumo.stock = u.nuevoStock
      insumo.actualizado = u.fecha || insumo.actualizado
      await sInsumos.put(insumo)
    }
  }
  for (const m of movimientos) await sMov.put(m)
  await tx.done
}

// ---- Movimientos de inventario ----
export async function getMovimientos(insumoId = null) {
  const db = await getDB()
  if (insumoId) return db.getAllFromIndex(MOVIMIENTOS, 'insumoId', insumoId)
  return db.getAll(MOVIMIENTOS)
}

export async function saveMovimiento(mov) {
  const db = await getDB()
  await db.put(MOVIMIENTOS, mov)
  return mov
}

// ---- Copia de seguridad (exportar / importar todo) ----
export async function exportarTodo() {
  const db = await getDB()
  const [recetas, config, insumos, movimientos] = await Promise.all([
    db.getAll(STORE),
    db.getAll(SETTINGS),
    db.getAll(INSUMOS),
    db.getAll(MOVIMIENTOS),
  ])
  return { version: 2, app: 'italo-recetario', fecha: Date.now(), recetas, config, insumos, movimientos }
}

// Restaura una copia. Sobrescribe por id (no borra lo que no venga en el
// respaldo), todo en una sola transacción.
export async function importarTodo(datos) {
  if (!datos || datos.app !== 'italo-recetario' || !Array.isArray(datos.recetas)) {
    throw new Error('El archivo no es un respaldo válido del recetario')
  }
  const db = await getDB()
  const tx = db.transaction([STORE, SETTINGS, INSUMOS, MOVIMIENTOS], 'readwrite')
  for (const r of datos.recetas || []) tx.objectStore(STORE).put(r)
  for (const c of datos.config || []) tx.objectStore(SETTINGS).put(c)
  for (const i of datos.insumos || []) tx.objectStore(INSUMOS).put(i)
  for (const m of datos.movimientos || []) tx.objectStore(MOVIMIENTOS).put(m)
  await tx.done
  return {
    recetas: (datos.recetas || []).length,
    insumos: (datos.insumos || []).length,
    movimientos: (datos.movimientos || []).length,
  }
}
