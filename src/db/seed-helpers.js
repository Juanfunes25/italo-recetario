// Ayudantes compartidos para construir las recetas base.
export const SEED_NOW = Date.now()

// Constructor: rellena ids estables y campos por defecto.
export function receta(id, data) {
  return {
    cover: null,
    minutos: 0,
    rendimiento: 1,
    unidadRendimiento: 'unidad',
    notas: '',
    usos: 0,
    creado: SEED_NOW,
    actualizado: SEED_NOW,
    ...data,
    id,
    ingredientes: (data.ingredientes || []).map((x, i) => ({ id: `${id}-i${i}`, ...x })),
    pasos: (data.pasos || []).map((p, i) => ({
      id: `${id}-p${i}`,
      texto: typeof p === 'string' ? p : p.texto,
      img: (typeof p === 'object' && p.img) || null,
    })),
  }
}

export const ing = (nombre, cantidad, unidad) => ({ nombre, cantidad, unidad })
// Ingrediente sin cantidad fija (se muestra "al gusto").
export const ingAg = (nombre) => ({ nombre, cantidad: undefined, unidad: 'al gusto' })
