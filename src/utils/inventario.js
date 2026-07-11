// ===========================================================
// Lógica pura de inventario y planificación de producción.
// Sin dependencias de React ni de IndexedDB → fácil de testear.
// Es la parte más delicada (cálculo de insumos y descuento de stock),
// por eso tiene tests en inventario.test.js.
// ===========================================================
import { normalize } from './format'

// Familias de unidades y su factor hacia la unidad base de la familia.
// Solo se convierte DENTRO de la misma familia (masa↔masa, etc.).
const FAMILIAS = {
  masa: { g: 1, kg: 1000, lb: 453.592, oz: 28.3495 },
  volumen: { ml: 1, l: 1000, L: 1000 },
  conteo: { unidad: 1, und: 1, u: 1, unidades: 1 },
}

function familiaDe(unidad) {
  for (const [fam, mapa] of Object.entries(FAMILIAS)) {
    if (Object.prototype.hasOwnProperty.call(mapa, unidad)) return fam
  }
  return null
}

// ¿Se pueden comparar/convertir dos unidades?
export function unidadesCompatibles(a, b) {
  if (a === b) return true
  const fa = familiaDe(a)
  return fa !== null && fa === familiaDe(b)
}

// Convierte una cantidad de una unidad a otra. Devuelve null si no se puede.
export function convertir(cantidad, de, a) {
  if (de === a) return cantidad
  const fam = familiaDe(de)
  if (!fam || familiaDe(a) !== fam) return null
  return (cantidad * FAMILIAS[fam][de]) / FAMILIAS[fam][a]
}

function redondear(n) {
  return Math.round(n * 1000) / 1000
}

// Índice de insumos por nombre normalizado (para enlazar con ingredientes).
export function indexarInsumos(insumos) {
  const m = new Map()
  for (const ins of insumos) m.set(normalize(ins.nombre), ins)
  return m
}

// ¿La cantidad del ingrediente es cuantificable? (no "al gusto")
function esCuantificable(cantidad) {
  return cantidad !== null && cantidad !== undefined && cantidad !== '' && !isNaN(Number(cantidad))
}

// -----------------------------------------------------------
// Calcula las necesidades de insumos para un PLAN de producción.
//   plan: [{ recetaId, cantidad }]  (cantidad en unidades de rendimiento)
//   getReceta: (id) => receta | undefined
//   insumos: array de insumos { id, nombre, unidad, stock, minimo }
// Devuelve: { necesidades, sinInsumo, incompatibles, sinCantidad }
// -----------------------------------------------------------
export function calcularNecesidades(plan, getReceta, insumos) {
  const idx = indexarInsumos(insumos)
  const acc = new Map()            // insumoId -> { insumo, necesario }
  const sinInsumo = new Map()      // nombreNorm -> { nombre, cantidad, unidad }
  const incompatibles = []         // { nombre, cantidad, unidad, insumoUnidad }
  const sinCantidad = new Set()    // nombres "al gusto"

  for (const item of plan || []) {
    const receta = getReceta(item.recetaId)
    const cantProd = Number(item.cantidad)
    if (!receta || !cantProd || cantProd <= 0) continue
    const base = Number(receta.rendimiento) || 1
    const factor = cantProd / base

    for (const ing of receta.ingredientes || []) {
      if (!esCuantificable(ing.cantidad)) {
        sinCantidad.add(ing.nombre)
        continue
      }
      const need = Number(ing.cantidad) * factor
      const insumo = idx.get(normalize(ing.nombre))

      if (!insumo) {
        const k = normalize(ing.nombre)
        const prev = sinInsumo.get(k) || { nombre: ing.nombre, unidad: ing.unidad, cantidad: 0 }
        prev.cantidad = redondear(prev.cantidad + need)
        sinInsumo.set(k, prev)
        continue
      }

      const conv = convertir(need, ing.unidad, insumo.unidad)
      if (conv === null) {
        incompatibles.push({
          nombre: ing.nombre, cantidad: redondear(need),
          unidad: ing.unidad, insumoUnidad: insumo.unidad,
        })
        continue
      }
      const cur = acc.get(insumo.id) || { insumo, necesario: 0 }
      cur.necesario += conv
      acc.set(insumo.id, cur)
    }
  }

  const necesidades = [...acc.values()]
    .map(({ insumo, necesario }) => {
      const stock = Number(insumo.stock) || 0
      necesario = redondear(necesario)
      const falta = redondear(Math.max(0, necesario - stock))
      return { insumo, necesario, stock, falta, alcanza: stock + 1e-9 >= necesario }
    })
    .sort((a, b) => b.falta - a.falta || a.insumo.nombre.localeCompare(b.insumo.nombre))

  return {
    necesidades,
    sinInsumo: [...sinInsumo.values()],
    incompatibles,
    sinCantidad: [...sinCantidad],
  }
}

// -----------------------------------------------------------
// Descuento de stock tras confirmar una producción.
// Nunca deja el stock negativo (se descuenta como máximo lo que hay).
// Devuelve { updates, movimientos } — NO persiste (eso lo hace el context).
// -----------------------------------------------------------
export function calcularDescuento(necesidades, fecha, ref, genId) {
  const updates = []
  const movimientos = []
  for (const n of necesidades) {
    const stock = Number(n.insumo.stock) || 0
    const descontar = Math.min(stock, n.necesario)
    const nuevoStock = redondear(stock - descontar)
    const faltante = redondear(Math.max(0, n.necesario - descontar))
    updates.push({ insumoId: n.insumo.id, nuevoStock, descontado: redondear(descontar), faltante, fecha })
    if (descontar > 0) {
      movimientos.push({
        id: genId(),
        insumoId: n.insumo.id,
        tipo: 'salida',
        cantidad: redondear(descontar),
        unidad: n.insumo.unidad,
        motivo: 'Producción',
        fecha,
        ref: ref || null,
      })
    }
  }
  return { updates, movimientos }
}

// -----------------------------------------------------------
// Lista de compras: insumos bajo el mínimo + faltantes de producción.
// Sugiere comprar lo suficiente para producir y no quedar bajo el mínimo.
// -----------------------------------------------------------
export function calcularListaCompras(insumos, necesidades = []) {
  const needById = new Map(necesidades.map((n) => [n.insumo.id, n.necesario]))
  const items = []
  for (const ins of insumos) {
    const stock = Number(ins.stock) || 0
    const minimo = Number(ins.minimo) || 0
    const necesario = needById.get(ins.id) || 0
    const objetivo = Math.max(necesario, minimo)
    const comprar = redondear(Math.max(0, objetivo - stock))
    if (comprar > 0) {
      items.push({
        insumo: ins,
        stock,
        minimo,
        necesario,
        comprar,
        unidad: ins.unidad,
        bajoMinimo: minimo > 0 && stock < minimo,
        porProduccion: necesario > stock,
      })
    }
  }
  return items.sort(
    (a, b) => Number(b.bajoMinimo) - Number(a.bajoMinimo) || a.insumo.nombre.localeCompare(b.insumo.nombre)
  )
}

// Insumos por debajo de su cantidad mínima deseada (para alertas).
export function insumosBajoMinimo(insumos) {
  return insumos.filter((i) => {
    const min = Number(i.minimo) || 0
    return min > 0 && (Number(i.stock) || 0) < min
  })
}
