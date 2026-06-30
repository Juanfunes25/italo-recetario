import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  getAllRecipes,
  saveRecipe,
  deleteRecipe,
  bulkAddRecipes,
  getSetting,
  setSetting,
} from '../db/idb'
import { RECETAS_BASE } from '../db/seed'

const RecipesContext = createContext(null)

// Quita las 3 recetas demo viejas (de la primera versión, con IDs aleatorios)
// para que no queden duplicadas con las nuevas del recetario base.
async function migrarDemosViejos() {
  const hecho = await getSetting('migrado_v2', false)
  if (hecho) return
  const todas = await getAllRecipes()
  const nombresDemo = new Set(['Gelato de Vainilla', 'Focaccia Artesanal', 'Frappé de Café'])
  for (const r of todas) {
    if (!String(r.id).startsWith('base_') && nombresDemo.has(r.nombre)) {
      await deleteRecipe(r.id)
    }
  }
  await setSetting('migrado_v2', true)
}

// Pone la portada ilustrada a las recetas base que se importaron antes
// de que existieran las portadas. No toca recetas con foto propia.
async function migrarCovers() {
  const hecho = await getSetting('covers_v1', false)
  if (hecho) return
  const baseConCover = new Map(RECETAS_BASE.filter((r) => r.cover).map((r) => [r.id, r.cover]))
  const todas = await getAllRecipes()
  for (const r of todas) {
    const cover = baseConCover.get(r.id)
    if (cover && !r.cover) {
      await saveRecipe({ ...r, cover })
    }
  }
  await setSetting('covers_v1', true)
}

// Actualización de contenido v2: elimina la categoría Helados (ya no se usa)
// y refresca las recetas de Crepa y Arancino con sus fórmulas reales.
async function migrarContenidoV2() {
  const hecho = await getSetting('contenido_v2', false)
  if (hecho) return
  const todas = await getAllRecipes()
  // Borrar recetas de la categoría Helados (categoría eliminada)
  for (const r of todas) {
    if (r.categoria === 'helados') await deleteRecipe(r.id)
  }
  // Refrescar Crepa y Arancino al contenido nuevo del recetario base (si existen)
  const existentesIds = new Set((await getAllRecipes()).map((r) => r.id))
  for (const id of ['base_crepa', 'base_arancino']) {
    if (!existentesIds.has(id)) continue
    const nueva = RECETAS_BASE.find((r) => r.id === id)
    if (nueva) await saveRecipe({ ...nueva })
  }
  await setSetting('contenido_v2', true)
}

// Agrega las recetas base que aún no se han importado nunca.
// Respeta las que el usuario borró (no las vuelve a meter).
async function importarBase() {
  const importadas = await getSetting('base_importadas', [])
  const yaImportadas = new Set(importadas)
  const existentes = await getAllRecipes()
  const existentesIds = new Set(existentes.map((r) => r.id))

  const nuevas = RECETAS_BASE.filter((r) => !yaImportadas.has(r.id))
  if (nuevas.length === 0) return
  const aAgregar = nuevas.filter((r) => !existentesIds.has(r.id))
  if (aAgregar.length) await bulkAddRecipes(aAgregar)
  await setSetting('base_importadas', [...importadas, ...nuevas.map((r) => r.id)])
}

export function RecipesProvider({ children }) {
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    ;(async () => {
      try {
        await migrarDemosViejos()
        await importarBase()
        await migrarCovers()
        await migrarContenidoV2()
        const datos = await getAllRecipes()
        if (activo) setRecetas(datos)
      } finally {
        if (activo) setCargando(false)
      }
    })()
    return () => {
      activo = false
    }
  }, [])

  const upsert = useCallback(async (receta) => {
    const conFecha = { ...receta, actualizado: Date.now() }
    await saveRecipe(conFecha)
    setRecetas((prev) => {
      const i = prev.findIndex((r) => r.id === conFecha.id)
      if (i === -1) return [...prev, conFecha]
      const copia = [...prev]
      copia[i] = conFecha
      return copia
    })
    return conFecha
  }, [])

  const remove = useCallback(async (id) => {
    await deleteRecipe(id)
    setRecetas((prev) => prev.filter((r) => r.id !== id))
  }, [])

  // Cuenta cuántas veces se abre una receta (para "más usadas")
  const registrarUso = useCallback(async (id) => {
    setRecetas((prev) => {
      const i = prev.findIndex((r) => r.id === id)
      if (i === -1) return prev
      const actualizada = { ...prev[i], usos: (prev[i].usos || 0) + 1 }
      saveRecipe(actualizada) // persiste en segundo plano
      const copia = [...prev]
      copia[i] = actualizada
      return copia
    })
  }, [])

  // Vuelve a agregar cualquier receta del recetario base que falte
  // (por ejemplo si se borró por accidente). No toca las recetas propias.
  const restaurarBase = useCallback(async () => {
    const existentes = await getAllRecipes()
    const existentesIds = new Set(existentes.map((r) => r.id))
    const aAgregar = RECETAS_BASE.filter((r) => !existentesIds.has(r.id))
    if (aAgregar.length) await bulkAddRecipes(aAgregar)
    await setSetting('base_importadas', RECETAS_BASE.map((r) => r.id))
    setRecetas(await getAllRecipes())
    return aAgregar.length
  }, [])

  const getById = useCallback((id) => recetas.find((r) => r.id === id), [recetas])

  return (
    <RecipesContext.Provider
      value={{ recetas, cargando, upsert, remove, registrarUso, getById, restaurarBase }}
    >
      {children}
    </RecipesContext.Provider>
  )
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes debe usarse dentro de RecipesProvider')
  return ctx
}
