// ===========================================================
// Capa de datos — IndexedDB (vía idb).
// Las recetas (incluidas sus fotos en base64) se guardan aquí.
// Es persistente: no se pierde al cerrar la app ni sin internet.
// Si mañana quieres sincronizar con la nube, solo agregas un módulo
// que lea/escriba aquí y haga push/pull a tu backend.
// ===========================================================
import { openDB } from 'idb'

const DB_NAME = 'italo-recetario'
const DB_VERSION = 1
const STORE = 'recetas'
const SETTINGS = 'config'

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
