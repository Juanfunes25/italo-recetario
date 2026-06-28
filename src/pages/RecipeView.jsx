import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { useRecipes } from '../context/RecipesContext'
import { useAdmin } from '../context/AdminContext'
import { categoriaInfo, formatQty, formatTime } from '../utils/format'

export default function RecipeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, registrarUso, remove } = useRecipes()
  const { esAdmin } = useAdmin()
  const receta = getById(id)

  // Porciones deseadas (parte del rendimiento base de la receta)
  const [objetivo, setObjetivo] = useState(receta?.rendimiento || 1)
  const [confirmarBorrar, setConfirmarBorrar] = useState(false)

  // Cuenta el uso una sola vez al abrir
  useEffect(() => {
    if (receta) registrarUso(receta.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (receta) setObjetivo(receta.rendimiento || 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receta?.id])

  const factor = useMemo(() => {
    if (!receta || !receta.rendimiento) return 1
    return objetivo / receta.rendimiento
  }, [objetivo, receta])

  if (!receta) {
    return (
      <div className="container">
        <div className="empty">
          <div className="ico">🔎</div>
          <p>Receta no encontrada.</p>
          <button className="btn btn--ghost" onClick={() => navigate('/')}>Ir al inicio</button>
        </div>
      </div>
    )
  }

  const cat = categoriaInfo(receta.categoria)
  // El paso del escalado depende de si el rendimiento es entero o decimal
  const paso = receta.rendimiento >= 1 && Number.isInteger(receta.rendimiento) ? 1 : 0.5
  const bajar = () => setObjetivo((v) => Math.max(paso, Math.round((v - paso) * 100) / 100))
  const subir = () => setObjetivo((v) => Math.round((v + paso) * 100) / 100)

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.3rem' }}>{cat.emoji} {cat.nombre}</h1>
        {esAdmin && (
          <button className="icon-btn" onClick={() => navigate(`/editar/${receta.id}`)} aria-label="Editar">✏️</button>
        )}
      </div>

      {receta.cover ? (
        <img className="hero" src={receta.cover} alt={receta.nombre} />
      ) : (
        <div className={`hero placeholder ph-${receta.categoria}`} aria-hidden>{cat.emoji}</div>
      )}

      <div className="container">
        <h1 style={{ marginTop: 14 }}>{receta.nombre}</h1>
        <div className="meta" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span className="chip">⏱ {formatTime(receta.minutos)}</span>
          <span className="chip">
            🥄 Rinde {formatQty(receta.rendimiento)} {receta.unidadRendimiento}
          </span>
        </div>

        {/* Modo cocina */}
        <button
          className="btn btn--full btn--lg"
          style={{ marginTop: 18 }}
          onClick={() => navigate(`/cocina/${receta.id}`)}
        >
          👨‍🍳 Modo cocina (pasos grandes)
        </button>

        {/* Escalado */}
        <div className="section">
          <h2>⚖️ Porciones</h2>
          <div className="scaler">
            <span className="label">
              Quiero preparar para:
            </span>
            <div className="stepper">
              <button onClick={bajar} aria-label="Menos">−</button>
              <span className="value">{formatQty(objetivo)} {receta.unidadRendimiento}</span>
              <button onClick={subir} aria-label="Más">＋</button>
            </div>
          </div>
          {Math.abs(factor - 1) > 0.001 && (
            <p style={{ color: 'var(--texto-suave)', fontWeight: 600, marginTop: 8 }}>
              Cantidades ajustadas ×{formatQty(factor)} (receta base: {formatQty(receta.rendimiento)} {receta.unidadRendimiento})
            </p>
          )}
        </div>

        {/* Ingredientes */}
        <div className="section">
          <h2>🧺 Ingredientes</h2>
          <ul className="ingredients">
            {receta.ingredientes.map((ing) => (
              <li key={ing.id}>
                <span className="qty">
                  {formatQty(ing.cantidad * factor)} {ing.unidad}
                </span>
                <span className="name">{ing.nombre}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pasos */}
        <div className="section">
          <h2>📋 Preparación</h2>
          <ol className="steps">
            {receta.pasos.map((p) => (
              <li key={p.id}>
                <span className="num" aria-hidden />
                <div className="step-body">
                  <p>{p.texto}</p>
                  {p.img && <img className="step-img" src={p.img} alt="" />}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Notas */}
        {receta.notas && (
          <div className="section">
            <div className="notes">
              <div className="lbl">💡 Tips / Notas</div>
              <p style={{ margin: '8px 0 0' }}>{receta.notas}</p>
            </div>
          </div>
        )}

        {/* Acciones admin */}
        {esAdmin && (
          <div className="section" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn--gold btn--full" onClick={() => navigate(`/editar/${receta.id}`)}>
              ✏️ Editar receta
            </button>
            <button className="btn btn--danger btn--full" onClick={() => setConfirmarBorrar(true)}>
              🗑 Eliminar receta
            </button>
          </div>
        )}
      </div>

      {confirmarBorrar && (
        <ConfirmModal
          titulo="¿Eliminar receta?"
          mensaje={`Se borrará «${receta.nombre}» permanentemente.`}
          confirmar="Sí, eliminar"
          peligro
          onCancel={() => setConfirmarBorrar(false)}
          onConfirm={async () => {
            await remove(receta.id)
            navigate(`/categoria/${receta.categoria}`)
          }}
        />
      )}
    </div>
  )
}
