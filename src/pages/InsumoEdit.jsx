import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { useInventario } from '../context/InventarioContext'
import { UNIDADES, formatQty } from '../utils/format'

function insumoVacio() {
  return { nombre: '', unidad: 'g', stock: '', minimo: '', costo: '', proveedor: '' }
}

const fmtFecha = (ts) => new Date(ts).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: '2-digit' })

export default function InsumoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getInsumoById, crearInsumo, actualizarInsumo, eliminarInsumo, movimientosDe } = useInventario()

  const esNuevo = !id
  const original = id ? getInsumoById(id) : null
  const [f, setF] = useState(() =>
    original
      ? { ...original, stock: original.stock ?? '', minimo: original.minimo ?? '', costo: original.costo ?? '', proveedor: original.proveedor ?? '' }
      : insumoVacio()
  )
  const [confirmar, setConfirmar] = useState(false)
  const [guardando, setGuardando] = useState(false)

  if (id && !original) {
    return (
      <div className="container">
        <div className="empty"><div className="ico">🔎</div><p>Ese insumo ya no existe.</p>
          <button className="btn btn--ghost" onClick={() => navigate('/inventario')}>Inventario</button>
        </div>
      </div>
    )
  }

  const set = (campo, valor) => setF((p) => ({ ...p, [campo]: valor }))
  const valido = f.nombre.trim() && f.unidad

  async function guardar() {
    if (!valido) return
    setGuardando(true)
    if (esNuevo) await crearInsumo(f)
    else await actualizarInsumo(id, f)
    setGuardando(false)
    navigate('/inventario')
  }

  const movs = id ? movimientosDe(id).slice(0, 10) : []

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.4rem' }}>{esNuevo ? 'Nuevo insumo' : 'Editar insumo'}</h1>
      </div>

      <div className="container">
        <div className="field">
          <label>Nombre del insumo *</label>
          <input className="input" value={f.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej: Harina" />
        </div>

        <div className="field">
          <label>Unidad de medida</label>
          <select className="select" value={f.unidad} onChange={(e) => set('unidad', e.target.value)}>
            {UNIDADES.filter((u) => u !== 'al gusto').map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="field">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Stock actual</label>
              <input className="input" type="number" inputMode="decimal" min="0" step="0.01"
                value={f.stock} onChange={(e) => set('stock', e.target.value)} placeholder="0" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Mínimo deseado</label>
              <input className="input" type="number" inputMode="decimal" min="0" step="0.01"
                value={f.minimo} onChange={(e) => set('minimo', e.target.value)} placeholder="0" />
            </div>
          </div>
          <p style={{ color: 'var(--texto-suave)', fontSize: '.9rem', marginTop: 6 }}>
            Cuando el stock baje del mínimo, saldrá una alerta y entrará a la lista de compras.
          </p>
        </div>

        <div className="field">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Costo por {f.unidad} (Lps, opcional)</label>
              <input className="input" type="number" inputMode="decimal" min="0" step="0.01"
                value={f.costo} onChange={(e) => set('costo', e.target.value)} placeholder="—" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Proveedor (opcional)</label>
              <input className="input" value={f.proveedor} onChange={(e) => set('proveedor', e.target.value)} placeholder="—" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button className="btn btn--full btn--lg" onClick={guardar} disabled={guardando || !valido}>
            {guardando ? 'Guardando…' : '💾 Guardar insumo'}
          </button>
          {!esNuevo && (
            <button className="btn btn--danger btn--full" onClick={() => setConfirmar(true)}>🗑 Eliminar insumo</button>
          )}
          <button className="btn btn--ghost btn--full" onClick={() => navigate(-1)}>Cancelar</button>
        </div>

        {!esNuevo && movs.length > 0 && (
          <div className="section">
            <h2>🧾 Últimos movimientos</h2>
            <ul className="mov-list">
              {movs.map((m) => (
                <li key={m.id}>
                  <span className={`mov-tipo ${m.tipo}`}>
                    {m.tipo === 'entrada' ? '＋ Entrada' : m.tipo === 'salida' ? '－ Salida' : '✎ Ajuste'}
                  </span>
                  <span className="mov-cant">{formatQty(m.cantidad)} {m.unidad}</span>
                  <span className="mov-fecha">{fmtFecha(m.fecha)}{m.motivo ? ` · ${m.motivo}` : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {confirmar && (
        <ConfirmModal
          titulo="¿Eliminar insumo?"
          mensaje={`Se borrará «${original.nombre}» del inventario.`}
          confirmar="Sí, eliminar"
          peligro
          onCancel={() => setConfirmar(false)}
          onConfirm={async () => { await eliminarInsumo(id); navigate('/inventario') }}
        />
      )}
    </div>
  )
}
