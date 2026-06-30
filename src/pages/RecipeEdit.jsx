import { useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import ImagePicker from '../components/ImagePicker'
import { useRecipes } from '../context/RecipesContext'
import { CATEGORIAS, UNIDADES, uid } from '../utils/format'

function recetaVacia(cat) {
  return {
    id: uid(),
    nombre: '',
    categoria: cat || 'helados',
    cover: null,
    minutos: 30,
    rendimiento: 1,
    unidadRendimiento: 'kg',
    ingredientes: [{ id: uid('i'), nombre: '', cantidad: '', unidad: 'g' }],
    pasos: [{ id: uid('p'), texto: '', img: null }],
    notas: '',
    usos: 0,
    creado: Date.now(),
    actualizado: Date.now(),
  }
}

export default function RecipeEdit() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { getById, upsert } = useRecipes()

  const esNueva = !id
  const original = id ? getById(id) : null

  const [r, setR] = useState(() => original ? structuredClone(original) : recetaVacia(params.get('cat')))
  const [guardando, setGuardando] = useState(false)
  const [intentado, setIntentado] = useState(false)

  const valido = useMemo(() => {
    return (
      r.nombre.trim() &&
      r.ingredientes.some((i) => i.nombre.trim()) &&
      r.pasos.some((p) => p.texto.trim())
    )
  }, [r])

  // Si editaban una receta que ya no existe
  if (id && !original) {
    return (
      <div className="container">
        <div className="empty">
          <div className="ico">🔎</div>
          <p>Esa receta ya no existe.</p>
          <button className="btn btn--ghost" onClick={() => navigate('/')}>Inicio</button>
        </div>
      </div>
    )
  }

  const set = (campo, valor) => setR((prev) => ({ ...prev, [campo]: valor }))

  // ---- Ingredientes ----
  const setIng = (idx, campo, valor) =>
    setR((prev) => {
      const arr = [...prev.ingredientes]
      arr[idx] = { ...arr[idx], [campo]: valor }
      return { ...prev, ingredientes: arr }
    })
  const addIng = () =>
    setR((prev) => ({ ...prev, ingredientes: [...prev.ingredientes, { id: uid('i'), nombre: '', cantidad: '', unidad: 'g' }] }))
  const delIng = (idx) =>
    setR((prev) => ({ ...prev, ingredientes: prev.ingredientes.filter((_, i) => i !== idx) }))

  // ---- Pasos ----
  const setPaso = (idx, campo, valor) =>
    setR((prev) => {
      const arr = [...prev.pasos]
      arr[idx] = { ...arr[idx], [campo]: valor }
      return { ...prev, pasos: arr }
    })
  const addPaso = () =>
    setR((prev) => ({ ...prev, pasos: [...prev.pasos, { id: uid('p'), texto: '', img: null }] }))
  const delPaso = (idx) =>
    setR((prev) => ({ ...prev, pasos: prev.pasos.filter((_, i) => i !== idx) }))

  async function guardar() {
    setIntentado(true)
    if (!valido) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setGuardando(true)
    // Limpia filas vacías y normaliza números
    const limpia = {
      ...r,
      nombre: r.nombre.trim(),
      minutos: Number(r.minutos) || 0,
      rendimiento: Number(r.rendimiento) || 1,
      ingredientes: r.ingredientes
        .filter((i) => i.nombre.trim())
        .map((i) => ({ ...i, nombre: i.nombre.trim(), cantidad: Number(i.cantidad) || 0 })),
      pasos: r.pasos.filter((p) => p.texto.trim() || p.img).map((p) => ({ ...p, texto: p.texto.trim() })),
      notas: r.notas.trim(),
    }
    await upsert(limpia)
    setGuardando(false)
    navigate(`/receta/${limpia.id}`)
  }

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Cancelar">←</button>
        <h1 style={{ fontSize: '1.4rem' }}>{esNueva ? 'Nueva receta' : 'Editar receta'}</h1>
      </div>

      <div className="container">
        {intentado && !valido && (
          <div className="notes" style={{ borderColor: 'var(--error)', background: '#fdecea', marginBottom: 16 }}>
            <div className="lbl" style={{ color: 'var(--error)' }}>⚠️ Faltan datos</div>
            <p style={{ margin: '6px 0 0' }}>Pon al menos: nombre, un ingrediente y un paso.</p>
          </div>
        )}

        {/* Nombre */}
        <div className="field">
          <label>Nombre de la receta *</label>
          <input className="input" value={r.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: Gelato de pistacho" />
        </div>

        {/* Categoría */}
        <div className="field">
          <label>Categoría</label>
          <div className="row">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set('categoria', c.id)}
                className="btn"
                style={{
                  background: r.categoria === c.id ? `var(--cat-${c.id})` : 'var(--crema-2)',
                  color: r.categoria === c.id ? '#fff' : 'var(--texto)',
                  boxShadow: 'none', flexDirection: 'column', gap: 4, padding: '12px 4px',
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>{c.emoji}</span>
                <span style={{ fontSize: '.85rem' }}>{c.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Foto de portada */}
        <div className="field">
          <label>Foto de portada</label>
          <ImagePicker valor={r.cover} onChange={(v) => set('cover', v)} etiqueta="Tomar o elegir foto de portada" />
        </div>

        {/* Tiempo + rendimiento */}
        <div className="field">
          <label>Tiempo de preparación (minutos)</label>
          <input className="input" type="number" inputMode="numeric" min="0" value={r.minutos} onChange={(e) => set('minutos', e.target.value)} />
        </div>

        <div className="field">
          <label>Rendimiento de la receta base</label>
          <div className="row">
            <input
              className="input" type="number" inputMode="decimal" min="0" step="0.1"
              value={r.rendimiento}
              onChange={(e) => set('rendimiento', e.target.value)}
              placeholder="Cantidad"
            />
            <select className="select" value={r.unidadRendimiento} onChange={(e) => set('unidadRendimiento', e.target.value)}>
              {['kg', 'g', 'L', 'ml', 'unidad', 'porciones', 'tanda'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <p style={{ color: 'var(--texto-suave)', fontSize: '.9rem', marginTop: 6 }}>
            Ej: 5 kg. Esto permite escalar las cantidades automáticamente.
          </p>
        </div>

        {/* Ingredientes */}
        <div className="field">
          <label>Ingredientes *</label>
          {r.ingredientes.map((ing, idx) => (
            <div className="edit-row" key={ing.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  className="input" style={{ flex: 2 }}
                  value={ing.nombre}
                  onChange={(e) => setIng(idx, 'nombre', e.target.value)}
                  placeholder="Ingrediente"
                />
                <button className="del" type="button" onClick={() => delIng(idx)} aria-label="Quitar">🗑</button>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <input
                  className="input" type="number" inputMode="decimal" min="0" step="0.01"
                  value={ing.cantidad}
                  onChange={(e) => setIng(idx, 'cantidad', e.target.value)}
                  placeholder="Cantidad"
                />
                <select className="select" value={ing.unidad} onChange={(e) => setIng(idx, 'unidad', e.target.value)}>
                  {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          ))}
          <button className="btn btn--ghost btn--full" type="button" onClick={addIng} style={{ marginTop: 6 }}>
            ＋ Agregar ingrediente
          </button>
        </div>

        {/* Pasos */}
        <div className="field">
          <label>Pasos de preparación *</label>
          {r.pasos.map((p, idx) => (
            <div className="edit-row" key={p.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="handle" style={{ paddingTop: 12 }}>{idx + 1}.</span>
                <textarea
                  className="textarea" style={{ minHeight: 70 }}
                  value={p.texto}
                  onChange={(e) => setPaso(idx, 'texto', e.target.value)}
                  placeholder={`Describe el paso ${idx + 1}…`}
                />
                <button className="del" type="button" onClick={() => delPaso(idx)} aria-label="Quitar">🗑</button>
              </div>
              <div style={{ marginTop: 8, paddingLeft: 26 }}>
                <ImagePicker
                  valor={p.img}
                  onChange={(v) => setPaso(idx, 'img', v)}
                  etiqueta="Foto del paso (opcional)"
                  compacto
                />
              </div>
            </div>
          ))}
          <button className="btn btn--ghost btn--full" type="button" onClick={addPaso} style={{ marginTop: 6 }}>
            ＋ Agregar paso
          </button>
        </div>

        {/* Notas */}
        <div className="field">
          <label>Notas / Tips (opcional)</label>
          <textarea
            className="textarea"
            value={r.notas}
            onChange={(e) => set('notas', e.target.value)}
            placeholder="Ej: si queda muy líquido, agregar más leche en polvo."
          />
        </div>

        {/* Guardar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button className="btn btn--full btn--lg" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando…' : '💾 Guardar receta'}
          </button>
          <button className="btn btn--ghost btn--full" onClick={() => navigate(-1)} disabled={guardando}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
