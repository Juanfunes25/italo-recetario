import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { useInventario } from '../context/InventarioContext'
import { useAdmin } from '../context/AdminContext'
import { formatQty, normalize } from '../utils/format'

// Modal simple para registrar una entrada de stock (compra).
function EntradaModal({ insumo, onCerrar, onGuardar }) {
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>＋ Entrada de stock</h2>
        <p>{insumo.nombre}</p>
        <div className="field" style={{ textAlign: 'left' }}>
          <label>Cantidad que entró ({insumo.unidad})</label>
          <input
            className="input" type="number" inputMode="decimal" min="0" step="0.01" autoFocus
            value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="0"
          />
        </div>
        <div className="field" style={{ textAlign: 'left' }}>
          <label>Nota (opcional)</label>
          <input className="input" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: compra proveedor" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button
            className="btn btn--olive btn--full"
            disabled={!(Number(cantidad) > 0)}
            onClick={() => onGuardar(Number(cantidad), motivo)}
          >
            Guardar entrada
          </button>
          <button className="btn btn--ghost btn--full" onClick={onCerrar}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default function Inventario() {
  const navigate = useNavigate()
  const { insumos, cargando, bajoMinimo, registrarMovimiento } = useInventario()
  const { esAdmin } = useAdmin()
  const [busqueda, setBusqueda] = useState('')
  const [entradaFor, setEntradaFor] = useState(null)

  const lista = useMemo(() => {
    const q = normalize(busqueda)
    let r = insumos
    if (q) r = r.filter((i) => normalize(i.nombre).includes(q))
    return [...r].sort((a, b) => {
      const ba = (Number(a.minimo) || 0) > 0 && (Number(a.stock) || 0) < a.minimo
      const bb = (Number(b.minimo) || 0) > 0 && (Number(b.stock) || 0) < b.minimo
      return Number(bb) - Number(ba) || a.nombre.localeCompare(b.nombre)
    })
  }, [insumos, busqueda])

  const bajo = (i) => (Number(i.minimo) || 0) > 0 && (Number(i.stock) || 0) < i.minimo

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate('/')} aria-label="Atrás">←</button>
        <h1>📦 Inventario</h1>
      </div>

      <div className="container" style={{ paddingTop: 4 }}>
        {bajoMinimo.length > 0 && (
          <div className="notes" style={{ borderColor: 'var(--error)', background: '#fdecea', marginBottom: 14 }}>
            <div className="lbl" style={{ color: 'var(--error)' }}>⚠️ {bajoMinimo.length} insumo(s) bajo el mínimo</div>
            <p style={{ margin: '6px 0 0' }}>Revisa la lista de compras para reponerlos.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button className="btn btn--olive" style={{ flex: 1 }} onClick={() => navigate('/produccion')}>
            🧮 Planificar
          </button>
          <button className="btn btn--gold" style={{ flex: 1 }} onClick={() => navigate('/compras')}>
            🛒 Compras
          </button>
        </div>

        <SearchBar valor={busqueda} onChange={setBusqueda} placeholder="Buscar insumo…" />

        {cargando ? (
          <div className="empty"><div className="ico">📦</div><p>Cargando inventario…</p></div>
        ) : lista.length === 0 ? (
          <div className="empty">
            <div className="ico">📦</div>
            <p>{busqueda ? `No hay insumos con «${busqueda}»` : 'Aún no hay insumos.'}</p>
            {esAdmin && !busqueda && <p>Toca ＋ para agregar el primero.</p>}
          </div>
        ) : (
          <ul className="insumo-list">
            {lista.map((i) => (
              <li key={i.id} className={`insumo-row ${bajo(i) ? 'alerta' : ''}`}>
                <button
                  className="insumo-info"
                  onClick={() => (esAdmin ? navigate(`/insumo/${i.id}`) : setEntradaFor(i))}
                >
                  <span className="insumo-nombre">
                    {bajo(i) && <span aria-hidden>⚠️ </span>}{i.nombre}
                  </span>
                  <span className="insumo-stock">
                    <b className={bajo(i) ? 'rojo' : ''}>{formatQty(i.stock)} {i.unidad}</b>
                    {(Number(i.minimo) || 0) > 0 && (
                      <span className="insumo-min">mín {formatQty(i.minimo)}</span>
                    )}
                  </span>
                </button>
                <button className="insumo-entrada" onClick={() => setEntradaFor(i)} aria-label={`Entrada de ${i.nombre}`}>
                  ＋
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {esAdmin && (
        <button className="fab" onClick={() => navigate('/insumo/nuevo')} aria-label="Nuevo insumo">＋</button>
      )}

      {entradaFor && (
        <EntradaModal
          insumo={entradaFor}
          onCerrar={() => setEntradaFor(null)}
          onGuardar={async (cantidad, motivo) => {
            await registrarMovimiento(entradaFor.id, { tipo: 'entrada', cantidad, motivo })
            setEntradaFor(null)
          }}
        />
      )}
    </div>
  )
}
