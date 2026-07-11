import { describe, it, expect } from 'vitest'
import {
  convertir,
  unidadesCompatibles,
  calcularNecesidades,
  calcularDescuento,
  calcularListaCompras,
  insumosBajoMinimo,
} from './inventario'

// Utilidades de prueba
let _n = 0
const genId = () => `mov_${++_n}`

const insumo = (id, nombre, unidad, stock, minimo = 0) => ({ id, nombre, unidad, stock, minimo })
const receta = (id, rendimiento, unidadRendimiento, ingredientes) => ({
  id, nombre: id, rendimiento, unidadRendimiento, ingredientes,
})
const ing = (nombre, cantidad, unidad) => ({ nombre, cantidad, unidad })

describe('convertir / unidadesCompatibles', () => {
  it('convierte dentro de la misma familia (masa)', () => {
    expect(convertir(2, 'kg', 'g')).toBe(2000)
    expect(convertir(500, 'g', 'kg')).toBe(0.5)
  })
  it('convierte volumen', () => {
    expect(convertir(1, 'L', 'ml')).toBe(1000)
    expect(convertir(250, 'ml', 'L')).toBe(0.25)
  })
  it('misma unidad devuelve lo mismo', () => {
    expect(convertir(7, 'unidad', 'unidad')).toBe(7)
  })
  it('unidades incompatibles devuelven null', () => {
    expect(convertir(3, 'g', 'unidad')).toBeNull()
    expect(convertir(3, 'ml', 'g')).toBeNull()
  })
  it('unidadesCompatibles', () => {
    expect(unidadesCompatibles('kg', 'g')).toBe(true)
    expect(unidadesCompatibles('g', 'unidad')).toBe(false)
    expect(unidadesCompatibles('taza', 'taza')).toBe(true)
  })
})

describe('calcularNecesidades', () => {
  // Receta: 1 pan de banano = 200g harina, 2 huevos, 150g banano
  const recetas = {
    pan: receta('pan', 1, 'unidad', [
      ing('Harina', 200, 'g'),
      ing('Huevos', 2, 'unidad'),
      ing('Banano', 150, 'g'),
    ]),
  }
  const getReceta = (id) => recetas[id]

  it('escala por cantidad producida y agrega por insumo', () => {
    const insumos = [
      insumo('i1', 'Harina', 'kg', 3),   // stock 3 kg
      insumo('i2', 'Huevos', 'unidad', 12),
      insumo('i3', 'Banano', 'g', 1000),
    ]
    const { necesidades } = calcularNecesidades([{ recetaId: 'pan', cantidad: 10 }], getReceta, insumos)
    const byId = Object.fromEntries(necesidades.map((n) => [n.insumo.id, n]))
    // 10 panes => 2000 g harina = 2 kg (insumo en kg)
    expect(byId.i1.necesario).toBe(2)
    expect(byId.i1.alcanza).toBe(true)
    // 20 huevos pero solo hay 12 => falta 8
    expect(byId.i2.necesario).toBe(20)
    expect(byId.i2.falta).toBe(8)
    expect(byId.i2.alcanza).toBe(false)
    // 1500 g banano, hay 1000 => falta 500
    expect(byId.i3.necesario).toBe(1500)
    expect(byId.i3.falta).toBe(500)
  })

  it('consolida varias recetas en la misma lista', () => {
    const recetas2 = {
      pan: recetas.pan,
      torta: receta('torta', 1, 'unidad', [ing('Harina', 300, 'g')]),
    }
    const insumos = [insumo('i1', 'Harina', 'g', 100)]
    const { necesidades } = calcularNecesidades(
      [{ recetaId: 'pan', cantidad: 10 }, { recetaId: 'torta', cantidad: 5 }],
      (id) => recetas2[id],
      insumos
    )
    // 10*200 + 5*300 = 2000 + 1500 = 3500 g
    const harina = necesidades.find((n) => n.insumo.id === 'i1')
    expect(harina.necesario).toBe(3500)
    expect(harina.falta).toBe(3400)
  })

  it('marca ingredientes sin insumo y "al gusto"', () => {
    const rec = { r: receta('r', 1, 'unidad', [
      ing('Sal', undefined, 'al gusto'),
      ing('Cacao', 50, 'g'),
    ]) }
    const { necesidades, sinInsumo, sinCantidad } = calcularNecesidades(
      [{ recetaId: 'r', cantidad: 2 }],
      (id) => rec[id],
      [] // sin insumos definidos
    )
    expect(necesidades).toHaveLength(0)
    expect(sinCantidad).toContain('Sal')
    expect(sinInsumo.find((s) => s.nombre === 'Cacao').cantidad).toBe(100)
  })

  it('reporta unidades incompatibles', () => {
    const rec = { r: receta('r', 1, 'unidad', [ing('Huevos', 100, 'g')]) }
    const insumos = [insumo('i', 'Huevos', 'unidad', 10)]
    const { incompatibles, necesidades } = calcularNecesidades(
      [{ recetaId: 'r', cantidad: 1 }], (id) => rec[id], insumos
    )
    expect(necesidades).toHaveLength(0)
    expect(incompatibles[0]).toMatchObject({ nombre: 'Huevos', unidad: 'g', insumoUnidad: 'unidad' })
  })

  it('empareja por nombre normalizado (acentos/mayúsculas)', () => {
    const rec = { r: receta('r', 1, 'unidad', [ing('Azúcar', 100, 'g')]) }
    const insumos = [insumo('i', 'AZUCAR', 'g', 500)]
    const { necesidades } = calcularNecesidades([{ recetaId: 'r', cantidad: 1 }], (id) => rec[id], insumos)
    expect(necesidades[0].insumo.id).toBe('i')
    expect(necesidades[0].necesario).toBe(100)
  })
})

describe('calcularDescuento (nunca deja stock negativo)', () => {
  it('descuenta lo necesario cuando alcanza', () => {
    const necesidades = [{ insumo: insumo('i1', 'Harina', 'g', 1000), necesario: 300 }]
    const { updates, movimientos } = calcularDescuento(necesidades, 1000, 'prod1', genId)
    expect(updates[0].nuevoStock).toBe(700)
    expect(updates[0].descontado).toBe(300)
    expect(updates[0].faltante).toBe(0)
    expect(movimientos[0]).toMatchObject({ insumoId: 'i1', tipo: 'salida', cantidad: 300 })
  })
  it('clampa a 0 y reporta faltante cuando no alcanza', () => {
    const necesidades = [{ insumo: insumo('i1', 'Huevos', 'unidad', 12), necesario: 20 }]
    const { updates } = calcularDescuento(necesidades, 1000, 'prod1', genId)
    expect(updates[0].nuevoStock).toBe(0)
    expect(updates[0].descontado).toBe(12)
    expect(updates[0].faltante).toBe(8)
  })
  it('no genera movimiento si no había stock', () => {
    const necesidades = [{ insumo: insumo('i1', 'X', 'g', 0), necesario: 50 }]
    const { movimientos } = calcularDescuento(necesidades, 1000, 'prod1', genId)
    expect(movimientos).toHaveLength(0)
  })
})

describe('calcularListaCompras', () => {
  it('incluye faltantes de producción y bajo mínimo', () => {
    const insumos = [
      insumo('i1', 'Harina', 'g', 100, 500),   // bajo mínimo (min 500)
      insumo('i2', 'Huevos', 'unidad', 12, 0),  // ok pero producción pide 20
      insumo('i3', 'Sal', 'g', 1000, 200),      // ok, no aparece
    ]
    const necesidades = [
      { insumo: insumos[1], necesario: 20, stock: 12, falta: 8, alcanza: false },
    ]
    const lista = calcularListaCompras(insumos, necesidades)
    const byId = Object.fromEntries(lista.map((x) => [x.insumo.id, x]))
    expect(byId.i1.comprar).toBe(400) // 500 - 100
    expect(byId.i1.bajoMinimo).toBe(true)
    expect(byId.i2.comprar).toBe(8)   // 20 - 12
    expect(byId.i2.porProduccion).toBe(true)
    expect(byId.i3).toBeUndefined()
  })
})

describe('insumosBajoMinimo', () => {
  it('lista solo los que están debajo del mínimo (>0)', () => {
    const insumos = [
      insumo('a', 'A', 'g', 100, 500),
      insumo('b', 'B', 'g', 600, 500),
      insumo('c', 'C', 'g', 0, 0), // sin mínimo definido => no alerta
    ]
    const bajo = insumosBajoMinimo(insumos)
    expect(bajo.map((i) => i.id)).toEqual(['a'])
  })
})
