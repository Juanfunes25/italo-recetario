import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { useRecipes } from '../context/RecipesContext'
import { useAdmin } from '../context/AdminContext'
import { categoriaInfo, coincide } from '../utils/format'

export default function CategoryList() {
  const { catId } = useParams()
  const navigate = useNavigate()
  const { recetas } = useRecipes()
  const { esAdmin } = useAdmin()
  const [orden, setOrden] = useState('alfabetico') // alfabetico | usadas
  const [busqueda, setBusqueda] = useState('')
  const cat = categoriaInfo(catId)

  const lista = useMemo(() => {
    let r = recetas.filter((x) => x.categoria === catId)
    if (busqueda.trim()) r = r.filter((x) => coincide(x, busqueda))
    if (orden === 'usadas') {
      r = [...r].sort((a, b) => (b.usos || 0) - (a.usos || 0) || a.nombre.localeCompare(b.nombre))
    } else {
      r = [...r].sort((a, b) => a.nombre.localeCompare(b.nombre))
    }
    return r
  }, [recetas, catId, orden, busqueda])

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate('/')} aria-label="Atrás">←</button>
        <h1>{cat.emoji} {cat.nombre}</h1>
      </div>

      <div className="container" style={{ paddingTop: 4 }}>
        <SearchBar valor={busqueda} onChange={setBusqueda} placeholder={`Buscar en ${cat.nombre}…`} />

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            className={`chip ${orden === 'alfabetico' ? '' : ''}`}
            onClick={() => setOrden('alfabetico')}
            style={{
              padding: '10px 16px', fontSize: '.95rem', cursor: 'pointer', border: 'none',
              background: orden === 'alfabetico' ? 'var(--oliva)' : 'var(--crema-2)',
              color: orden === 'alfabetico' ? '#fff' : 'var(--texto)',
            }}
          >
            A–Z
          </button>
          <button
            className="chip"
            onClick={() => setOrden('usadas')}
            style={{
              padding: '10px 16px', fontSize: '.95rem', cursor: 'pointer', border: 'none',
              background: orden === 'usadas' ? 'var(--oliva)' : 'var(--crema-2)',
              color: orden === 'usadas' ? '#fff' : 'var(--texto)',
            }}
          >
            ⭐ Más usadas
          </button>
        </div>

        {lista.length === 0 ? (
          <div className="empty">
            <div className="ico">{cat.emoji}</div>
            <p>Aún no hay recetas de {cat.nombre.toLowerCase()}.</p>
            {esAdmin && <p>Toca el botón + para crear la primera.</p>}
          </div>
        ) : (
          <div className="recipe-grid">
            {lista.map((r) => (
              <RecipeCard key={r.id} receta={r} />
            ))}
          </div>
        )}
      </div>

      {esAdmin && (
        <button
          className="fab"
          onClick={() => navigate(`/nueva?cat=${catId}`)}
          aria-label="Nueva receta"
        >
          ＋
        </button>
      )}
    </div>
  )
}
