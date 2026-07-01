import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import { useWakeLock } from '../hooks/useWakeLock'
import { formatQty } from '../utils/format'

// Modo cocina para producción: pantalla completa, fondo oscuro, un paso a la
// vez con letra enorme, botones gigantes, swipe entre pasos y la pantalla no
// se apaga (Wake Lock). Muestra los ingredientes al inicio.
export default function CookMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById } = useRecipes()
  const receta = getById(id)

  const [i, setI] = useState(0)
  const [verIngredientes, setVerIngredientes] = useState(true) // se muestra al inicio
  const contRef = useRef(null)
  const touchX = useRef(null)

  const soportaWakeLock = useWakeLock(true)

  // Pantalla completa real (best-effort; si el navegador no deja, se ignora)
  useEffect(() => {
    const el = contRef.current
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {})
    }
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  if (!receta) {
    return (
      <div className="container">
        <div className="empty">
          <div className="ico">🔎</div>
          <p>Receta no encontrada.</p>
          <button className="btn" onClick={() => navigate('/')}>Inicio</button>
        </div>
      </div>
    )
  }

  const pasos = receta.pasos
  const total = pasos.length
  const paso = pasos[i]
  const esUltimo = i === total - 1
  const ir = (d) => setI((v) => Math.min(total - 1, Math.max(0, v + d)))

  // Swipe horizontal entre pasos
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null || verIngredientes) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 55) ir(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <div
      className="cook cook--dark"
      ref={contRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="cook-head">
        <button className="icon-btn cook-x" onClick={() => navigate(-1)} aria-label="Salir">✕</button>
        <div className="t">{receta.nombre}</div>
        <button
          className="icon-btn cook-x"
          onClick={() => setVerIngredientes(true)}
          aria-label="Ver ingredientes"
        >
          🧺
        </button>
      </div>

      <div className="cook-progress">
        {pasos.map((p, idx) => (
          <span key={p.id} className={`seg ${idx < i ? 'done' : ''} ${idx === i ? 'current' : ''}`} />
        ))}
      </div>

      <div className="cook-body">
        <div className="cook-step-num">Paso {i + 1} de {total}</div>
        <div className="cook-step-text">{paso.texto}</div>
        {paso.img && <img className="cook-step-img" src={paso.img} alt="" />}
      </div>

      {soportaWakeLock && (
        <div className="wakelock-note">🔆 La pantalla se mantendrá encendida</div>
      )}

      <div className="cook-foot">
        <button className="btn btn--ghost" onClick={() => ir(-1)} disabled={i === 0}>
          ← Anterior
        </button>
        {esUltimo ? (
          <button className="btn btn--olive" onClick={() => navigate(-1)}>✓ Terminar</button>
        ) : (
          <button className="btn" onClick={() => ir(1)}>Siguiente →</button>
        )}
      </div>

      {/* Resumen de ingredientes (se muestra al inicio y con el botón 🧺) */}
      {verIngredientes && (
        <div className="cook-ing-overlay">
          <div className="cook-ing-head">
            <button className="icon-btn cook-x" onClick={() => navigate(-1)} aria-label="Salir">✕</button>
            <h2 style={{ flex: 1 }}>🧺 Ingredientes</h2>
            <span className="cook-ing-rinde">
              Rinde {formatQty(receta.rendimiento)} {receta.unidadRendimiento}
            </span>
          </div>
          <ul className="cook-ing-list">
            {receta.ingredientes.map((ing) => (
              <li key={ing.id}>
                <b>{formatQty(ing.cantidad)} {ing.unidad}</b>
                <span>{ing.nombre}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn--lg" onClick={() => setVerIngredientes(false)}>
            {i === 0 ? 'Empezar ▶' : 'Volver a los pasos ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
