import { useNavigate } from 'react-router-dom'
import { categoriaInfo, formatTime } from '../utils/format'

// Tarjeta de receta: foto de portada, nombre y tiempo de preparación.
export default function RecipeCard({ receta }) {
  const navigate = useNavigate()
  const cat = categoriaInfo(receta.categoria)

  return (
    <button className="recipe-card" onClick={() => navigate(`/receta/${receta.id}`)}>
      {receta.cover ? (
        <img className="thumb" src={receta.cover} alt={receta.nombre} loading="lazy" />
      ) : (
        <div className={`thumb placeholder ph-${receta.categoria}`} aria-hidden>
          {cat.emoji}
        </div>
      )}
      <div className="body">
        <div className="title">{receta.nombre}</div>
        <div className="meta">
          <span className="chip">⏱ {formatTime(receta.minutos)}</span>
          <span className="chip">{cat.emoji} {cat.nombre}</span>
        </div>
      </div>
    </button>
  )
}
