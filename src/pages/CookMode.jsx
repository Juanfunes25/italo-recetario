import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import { useWakeLock } from '../hooks/useWakeLock'

// Pantalla completa para producción: un paso a la vez, letra grande,
// botones enormes, y la pantalla no se apaga (Wake Lock).
export default function CookMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById } = useRecipes()
  const receta = getById(id)
  const [i, setI] = useState(0)

  const soportaWakeLock = useWakeLock(true)

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

  return (
    <div className="cook">
      <div className="cook-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Salir">✕</button>
        <div className="t">{receta.nombre}</div>
      </div>

      <div className="cook-progress">
        {pasos.map((p, idx) => (
          <span
            key={p.id}
            className={`seg ${idx < i ? 'done' : ''} ${idx === i ? 'current' : ''}`}
          />
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
        <button
          className="btn btn--ghost"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
        >
          ← Anterior
        </button>
        {esUltimo ? (
          <button className="btn btn--olive" onClick={() => navigate(-1)}>
            ✓ Terminar
          </button>
        ) : (
          <button className="btn" onClick={() => setI((v) => Math.min(total - 1, v + 1))}>
            Siguiente →
          </button>
        )}
      </div>
    </div>
  )
}
