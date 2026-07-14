import { describe, it, expect } from 'vitest'
import { formatQty, normalize, coincide } from './format'

describe('formatQty (cantidades escaladas)', () => {
  it('enteros sin decimales', () => {
    expect(formatQty(2)).toBe('2')
    expect(formatQty(2.0)).toBe('2')
  })
  it('redondea a 2 decimales y limpia ceros', () => {
    expect(formatQty(5.8)).toBe('5.8')
    expect(formatQty(1.006)).toBe('1.01')
    expect(formatQty(3.333333)).toBe('3.33')
    expect(formatQty(0.1 + 0.2)).toBe('0.3') // error de flotantes controlado
    expect(formatQty(2.5)).toBe('2.5')
  })
  it('valores inválidos devuelven cadena vacía (no NaN en pantalla)', () => {
    expect(formatQty(undefined)).toBe('')
    expect(formatQty(null)).toBe('')
    expect(formatQty(NaN)).toBe('')
    // "al gusto": cantidad undefined × factor => NaN => ''
    expect(formatQty(undefined * 2)).toBe('')
  })
})

describe('normalize', () => {
  it('quita acentos y mayúsculas', () => {
    expect(normalize('AZÚCAR Morena')).toBe('azucar morena')
    expect(normalize('  Café ')).toBe('cafe')
  })
  it('tolera null/undefined', () => {
    expect(normalize(null)).toBe('')
    expect(normalize(undefined)).toBe('')
  })
})

describe('coincide (búsqueda por nombre e ingrediente)', () => {
  const receta = {
    nombre: 'Torta de Banano',
    ingredientes: [
      { nombre: 'Harina', cantidad: 580, unidad: 'g' },
      { nombre: 'Azúcar morena', cantidad: 400, unidad: 'g' },
    ],
  }
  it('encuentra por nombre (con acentos distintos)', () => {
    expect(coincide(receta, 'banano')).toBe(true)
    expect(coincide(receta, 'BANANO')).toBe(true)
  })
  it('encuentra por ingrediente', () => {
    expect(coincide(receta, 'azucar')).toBe(true)
    expect(coincide(receta, 'harina')).toBe(true)
  })
  it('no encuentra lo que no está', () => {
    expect(coincide(receta, 'chocolate')).toBe(false)
  })
  it('búsqueda vacía coincide con todo', () => {
    expect(coincide(receta, '')).toBe(true)
  })
  it('receta sin ingredientes no revienta', () => {
    expect(coincide({ nombre: 'X' }, 'harina')).toBe(false)
  })
})
