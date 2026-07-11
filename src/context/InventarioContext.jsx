import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
  getAllInsumos,
  saveInsumo,
  deleteInsumo,
  bulkAddInsumos,
  getMovimientos,
  saveMovimiento,
  aplicarStockYMovimientos,
  getSetting,
  setSetting,
} from '../db/idb'
import { uid, normalize } from '../utils/format'
import { calcularNecesidades, calcularDescuento, insumosBajoMinimo } from '../utils/inventario'
import { useRecipes } from './RecipesContext'

const InventarioContext = createContext(null)
const PLAN_KEY = 'italo-plan-produccion'

// Crea un Insumo por cada ingrediente único de las recetas (solo la primera
// vez, cuando ya hay recetas cargadas). No toca las recetas — la relación
// receta↔insumo es por nombre.
async function migrarInsumosDesde(recetas) {
  const hecho = await getSetting('insumos_migrado_v1', false)
  if (hecho) return false
  const existentes = await getAllInsumos()
  const yaExiste = new Set(existentes.map((i) => normalize(i.nombre)))
  const nuevos = new Map() // nombreNorm -> insumo

  for (const r of recetas) {
    for (const ing of r.ingredientes || []) {
      const cant = ing.cantidad
      const cuantificable = cant !== null && cant !== undefined && cant !== '' && !isNaN(Number(cant))
      // Solo insumos con unidad y cantidad usables (evita "al gusto")
      if (!cuantificable || !ing.unidad || ing.unidad === 'al gusto') continue
      const k = normalize(ing.nombre)
      if (yaExiste.has(k) || nuevos.has(k)) continue
      nuevos.set(k, {
        id: uid('ins'),
        nombre: ing.nombre.trim(),
        unidad: ing.unidad,
        stock: 0,
        minimo: 0,
        costo: null,
        proveedor: '',
        creado: Date.now(),
        actualizado: Date.now(),
      })
    }
  }
  if (nuevos.size) await bulkAddInsumos([...nuevos.values()])
  await setSetting('insumos_migrado_v1', true)
  return nuevos.size > 0
}

function leerPlan() {
  try {
    const p = JSON.parse(localStorage.getItem(PLAN_KEY) || '[]')
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

export function InventarioProvider({ children }) {
  const { recetas, cargando: recetasCargando } = useRecipes()
  const [insumos, setInsumos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [plan, setPlanState] = useState(() => leerPlan())

  // Ref para leer el stock actual dentro de callbacks sin recrearlos
  const insumosRef = useRef(insumos)
  insumosRef.current = insumos

  // Carga inicial de insumos y movimientos
  useEffect(() => {
    let activo = true
    ;(async () => {
      try {
        const [ins, mov] = await Promise.all([getAllInsumos(), getMovimientos()])
        if (activo) {
          setInsumos(ins)
          setMovimientos(mov)
        }
      } finally {
        if (activo) setCargando(false)
      }
    })()
    return () => {
      activo = false
    }
  }, [])

  // Migración de insumos: solo cuando las recetas ya están cargadas (evita
  // crear 0 insumos si corre antes de que se siembren las recetas).
  const migradoRef = useRef(false)
  useEffect(() => {
    if (migradoRef.current || recetasCargando || recetas.length === 0) return
    migradoRef.current = true
    ;(async () => {
      const creo = await migrarInsumosDesde(recetas)
      if (creo) setInsumos(await getAllInsumos())
    })()
  }, [recetas, recetasCargando])

  const persistirPlan = useCallback((p) => {
    setPlanState(p)
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(p))
    } catch {
      /* cuota excedida: no crítico */
    }
  }, [])

  // ---- CRUD de insumos ----
  const crearInsumo = useCallback(async (datos) => {
    const ins = {
      id: uid('ins'),
      nombre: (datos.nombre || '').trim(),
      unidad: datos.unidad || 'g',
      stock: Number(datos.stock) || 0,
      minimo: Number(datos.minimo) || 0,
      costo: datos.costo === '' || datos.costo == null ? null : Number(datos.costo),
      proveedor: (datos.proveedor || '').trim(),
      creado: Date.now(),
      actualizado: Date.now(),
    }
    await saveInsumo(ins)
    setInsumos((prev) => [...prev, ins])
    return ins
  }, [])

  const actualizarInsumo = useCallback(async (id, datos) => {
    let guardado
    setInsumos((prev) => {
      const i = prev.findIndex((x) => x.id === id)
      if (i === -1) return prev
      guardado = {
        ...prev[i],
        ...datos,
        stock: datos.stock === undefined ? prev[i].stock : Math.max(0, Number(datos.stock) || 0),
        minimo: datos.minimo === undefined ? prev[i].minimo : Math.max(0, Number(datos.minimo) || 0),
        costo:
          datos.costo === undefined
            ? prev[i].costo
            : datos.costo === '' || datos.costo == null
              ? null
              : Number(datos.costo),
        actualizado: Date.now(),
      }
      const copia = [...prev]
      copia[i] = guardado
      return copia
    })
    if (guardado) await saveInsumo(guardado)
    return guardado
  }, [])

  const eliminarInsumo = useCallback(async (id) => {
    await deleteInsumo(id)
    setInsumos((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Registra una entrada (compra) o ajuste, sumando/estableciendo stock.
  const registrarMovimiento = useCallback(async (insumoId, { tipo, cantidad, motivo }) => {
    const cant = Number(cantidad) || 0
    const insumo = insumosRef.current.find((x) => x.id === insumoId)
    if (!insumo) return
    let nuevoStock
    if (tipo === 'entrada') nuevoStock = (Number(insumo.stock) || 0) + cant
    else if (tipo === 'salida') nuevoStock = Math.max(0, (Number(insumo.stock) || 0) - cant)
    else nuevoStock = Math.max(0, cant) // ajuste = establecer
    nuevoStock = Math.round(nuevoStock * 1000) / 1000

    const mov = {
      id: uid('mov'),
      insumoId,
      tipo,
      cantidad: cant,
      unidad: insumo.unidad,
      motivo: motivo || '',
      fecha: Date.now(),
      ref: null,
    }
    const actualizado = { ...insumo, stock: nuevoStock, actualizado: Date.now() }
    await saveInsumo(actualizado)
    await saveMovimiento(mov)
    setInsumos((prev) => prev.map((x) => (x.id === insumoId ? actualizado : x)))
    setMovimientos((prev) => [...prev, mov])
  }, [])

  // ---- Plan de producción ----
  const agregarAlPlan = useCallback(
    (recetaId, cantidad) => {
      const cant = Number(cantidad) || 0
      if (cant <= 0) return
      const p = leerPlan()
      const i = p.findIndex((x) => x.recetaId === recetaId)
      if (i === -1) p.push({ recetaId, cantidad: cant })
      else p[i] = { recetaId, cantidad: p[i].cantidad + cant }
      persistirPlan(p)
    },
    [persistirPlan]
  )
  const quitarDelPlan = useCallback(
    (recetaId) => persistirPlan(leerPlan().filter((x) => x.recetaId !== recetaId)),
    [persistirPlan]
  )
  const limpiarPlan = useCallback(() => persistirPlan([]), [persistirPlan])

  // Cálculo de necesidades del plan actual (o de un plan puntual)
  const necesidadesDe = useCallback(
    (planUsado) => calcularNecesidades(planUsado, (id) => recetas.find((r) => r.id === id), insumos),
    [recetas, insumos]
  )

  // Confirmar producción: descuenta stock y registra movimientos.
  const confirmarProduccion = useCallback(
    async (planUsado) => {
      const { necesidades } = necesidadesDe(planUsado)
      const fecha = Date.now()
      const ref = uid('prod')
      const { updates, movimientos: movs } = calcularDescuento(necesidades, fecha, ref, () => uid('mov'))
      await aplicarStockYMovimientos(
        updates.map((u) => ({ ...u, fecha })),
        movs
      )
      const [ins, mov] = await Promise.all([getAllInsumos(), getMovimientos()])
      setInsumos(ins)
      setMovimientos(mov)
      return { updates, movimientos: movs }
    },
    [necesidadesDe]
  )

  const bajoMinimo = useMemo(() => insumosBajoMinimo(insumos), [insumos])
  const getInsumoById = useCallback((id) => insumos.find((i) => i.id === id), [insumos])
  const movimientosDe = useCallback(
    (insumoId) => movimientos.filter((m) => m.insumoId === insumoId).sort((a, b) => b.fecha - a.fecha),
    [movimientos]
  )

  return (
    <InventarioContext.Provider
      value={{
        insumos,
        movimientos,
        cargando,
        bajoMinimo,
        plan,
        getInsumoById,
        movimientosDe,
        crearInsumo,
        actualizarInsumo,
        eliminarInsumo,
        registrarMovimiento,
        agregarAlPlan,
        quitarDelPlan,
        limpiarPlan,
        necesidadesDe,
        confirmarProduccion,
      }}
    >
      {children}
    </InventarioContext.Provider>
  )
}

export function useInventario() {
  const ctx = useContext(InventarioContext)
  if (!ctx) throw new Error('useInventario debe usarse dentro de InventarioProvider')
  return ctx
}
