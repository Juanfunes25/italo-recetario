import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventario } from '../context/InventarioContext'
import { calcularListaCompras } from '../utils/inventario'
import { formatQty } from '../utils/format'

export default function Compras() {
  const navigate = useNavigate()
  const { insumos, plan, necesidadesDe } = useInventario()
  const [comprados, setComprados] = useState({}) // marcar como comprado (visual)

  const { necesidades } = useMemo(() => necesidadesDe(plan), [plan, necesidadesDe])
  const lista = useMemo(() => calcularListaCompras(insumos, necesidades), [insumos, necesidades])

  const toggle = (id) => setComprados((c) => ({ ...c, [id]: !c[id] }))

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate('/inventario')} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.3rem' }}>🛒 Lista de compras</h1>
      </div>

      <div className="container" style={{ paddingTop: 4 }}>
        <p style={{ color: 'var(--texto-suave)', fontWeight: 600, marginTop: 0 }}>
          Insumos bajo el mínimo{plan.length > 0 ? ' y faltantes de la producción planeada' : ''}.
        </p>

        {lista.length === 0 ? (
          <div className="empty">
            <div className="ico">✅</div>
            <p>Nada que comprar por ahora. Todo el inventario está bien.</p>
            <button className="btn btn--ghost" onClick={() => navigate('/produccion')}>🧮 Planificar producción</button>
          </div>
        ) : (
          <>
            <ul className="insumo-list">
              {lista.map((x) => (
                <li key={x.insumo.id} className="insumo-row">
                  <button
                    className="insumo-info"
                    onClick={() => toggle(x.insumo.id)}
                    style={{ opacity: comprados[x.insumo.id] ? 0.5 : 1 }}
                  >
                    <span className="insumo-nombre" style={comprados[x.insumo.id] ? { textDecoration: 'line-through' } : undefined}>
                      {comprados[x.insumo.id] ? '☑ ' : '☐ '}{x.insumo.nombre}
                    </span>
                    <span className="insumo-stock">
                      <b className="rojo">Comprar {formatQty(x.comprar)} {x.unidad}</b>
                      <span className="insumo-min">
                        tienes {formatQty(x.stock)}
                        {x.bajoMinimo ? ` · mín ${formatQty(x.minimo)}` : ''}
                        {x.porProduccion ? ' · para producir' : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p style={{ color: 'var(--texto-suave)', fontSize: '.9rem', marginTop: 10 }}>
              Toca un insumo para marcarlo como comprado. Cuando lo ingreses al inventario, se quita de la lista.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
