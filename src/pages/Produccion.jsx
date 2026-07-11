import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventario } from '../context/InventarioContext'
import { useRecipes } from '../context/RecipesContext'
import { formatQty } from '../utils/format'

export default function Produccion() {
  const navigate = useNavigate()
  const { recetas } = useRecipes()
  const { plan, agregarAlPlan, quitarDelPlan, limpiarPlan, necesidadesDe, confirmarProduccion } = useInventario()

  const [recetaSel, setRecetaSel] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [confirmando, setConfirmando] = useState(false)
  const [resultado, setResultado] = useState(null)

  const recetasOrden = useMemo(
    () => [...recetas].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [recetas]
  )
  const getReceta = (id) => recetas.find((r) => r.id === id)

  // Necesidades del plan actual
  const { necesidades, sinInsumo, incompatibles, sinCantidad } = useMemo(
    () => necesidadesDe(plan),
    [plan, necesidadesDe]
  )

  const hayFaltantes = necesidades.some((n) => n.falta > 0)

  function agregar() {
    if (!recetaSel || !(Number(cantidad) > 0)) return
    agregarAlPlan(recetaSel, Number(cantidad))
    setCantidad('1')
    setResultado(null)
  }

  async function confirmar() {
    setConfirmando(true)
    try {
      const { updates } = await confirmarProduccion(plan)
      setResultado({
        descontados: updates.filter((u) => u.descontado > 0).length,
        faltantes: updates.filter((u) => u.faltante > 0),
      })
      limpiarPlan()
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate('/inventario')} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.3rem' }}>🧮 Planificar producción</h1>
      </div>

      <div className="container" style={{ paddingTop: 4 }}>
        {resultado && (
          <div className="notes" style={{ borderColor: 'var(--ok)', background: '#eef6ea', marginBottom: 16 }}>
            <div className="lbl" style={{ color: 'var(--ok)' }}>✅ Producción confirmada</div>
            <p style={{ margin: '6px 0 0' }}>
              Se descontó el stock de {resultado.descontados} insumo(s).
              {resultado.faltantes.length > 0 && ' Ojo: algunos no alcanzaron (revisa compras).'}
            </p>
          </div>
        )}

        {/* Agregar receta al plan */}
        <div className="field">
          <label>¿Qué vas a producir?</label>
          <select className="select" value={recetaSel} onChange={(e) => setRecetaSel(e.target.value)}>
            <option value="">Elige una receta…</option>
            {recetasOrden.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Cantidad a producir {recetaSel && `(en ${getReceta(recetaSel)?.unidadRendimiento || 'unidades'})`}</label>
          <div className="row">
            <input
              className="input" type="number" inputMode="decimal" min="0" step="0.5"
              value={cantidad} onChange={(e) => setCantidad(e.target.value)}
            />
            <button className="btn" style={{ flex: '0 0 auto' }} onClick={agregar} disabled={!recetaSel}>
              ＋ Agregar
            </button>
          </div>
        </div>

        {/* Plan actual */}
        {plan.length > 0 && (
          <div className="section">
            <h2>📝 Plan del día</h2>
            <ul className="plan-list">
              {plan.map((p) => {
                const r = getReceta(p.recetaId)
                return (
                  <li key={p.recetaId} className="edit-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 1 }}>
                      <b>{formatQty(p.cantidad)} {r?.unidadRendimiento || ''}</b> de {r ? r.nombre : '(receta borrada)'}
                    </span>
                    <button className="del" onClick={() => quitarDelPlan(p.recetaId)} aria-label="Quitar">🗑</button>
                  </li>
                )
              })}
            </ul>
            <button className="btn btn--ghost" onClick={limpiarPlan} style={{ marginTop: 4 }}>Vaciar plan</button>
          </div>
        )}

        {/* Necesidades consolidadas */}
        {necesidades.length > 0 && (
          <div className="section">
            <h2>🧺 Insumos necesarios</h2>
            <ul className="insumo-list">
              {necesidades.map((n) => (
                <li key={n.insumo.id} className={`insumo-row ${n.alcanza ? '' : 'alerta'}`}>
                  <div className="insumo-info" style={{ cursor: 'default' }}>
                    <span className="insumo-nombre">
                      {n.alcanza ? '✅ ' : '⚠️ '}{n.insumo.nombre}
                    </span>
                    <span className="insumo-stock">
                      <b>Necesitas {formatQty(n.necesario)} {n.insumo.unidad}</b>
                      <span className="insumo-min">
                        tienes {formatQty(n.stock)}
                        {n.falta > 0 ? ` · falta ${formatQty(n.falta)}` : ' · alcanza'}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Avisos */}
        {(sinInsumo.length > 0 || incompatibles.length > 0 || sinCantidad.length > 0) && (
          <div className="notes" style={{ marginTop: 12 }}>
            <div className="lbl">ℹ️ Avisos</div>
            {sinInsumo.length > 0 && (
              <p style={{ margin: '8px 0 0' }}>
                Sin insumo en inventario (no se descuentan): {sinInsumo.map((s) => s.nombre).join(', ')}.
              </p>
            )}
            {incompatibles.length > 0 && (
              <p style={{ margin: '8px 0 0' }}>
                Unidades que no coinciden con su insumo: {incompatibles.map((i) => `${i.nombre} (${i.unidad}≠${i.insumoUnidad})`).join(', ')}.
              </p>
            )}
            {sinCantidad.length > 0 && (
              <p style={{ margin: '8px 0 0' }}>Ingredientes "al gusto" (no se calculan): {sinCantidad.join(', ')}.</p>
            )}
          </div>
        )}

        {/* Acciones */}
        {plan.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <button className="btn btn--gold btn--full" onClick={() => navigate('/compras')}>
              🛒 Ver lista de compras
            </button>
            <button
              className="btn btn--full btn--lg"
              onClick={confirmar}
              disabled={confirmando}
              style={hayFaltantes ? { background: 'var(--dorado-oscuro)' } : undefined}
            >
              {confirmando ? 'Confirmando…' : '✅ Confirmé la producción (descontar stock)'}
            </button>
            {hayFaltantes && (
              <p style={{ color: 'var(--texto-suave)', fontSize: '.9rem', textAlign: 'center', margin: 0 }}>
                Faltan insumos: se descontará lo que haya (el stock no queda negativo).
              </p>
            )}
          </div>
        )}

        {plan.length === 0 && !resultado && (
          <div className="empty">
            <div className="ico">🧮</div>
            <p>Agrega recetas para calcular los insumos que necesitas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
