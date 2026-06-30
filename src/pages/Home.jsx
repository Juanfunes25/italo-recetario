import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { useRecipes } from '../context/RecipesContext'
import { CATEGORIAS, normalize } from '../utils/format'

export default function Home() {
  const { recetas, cargando } = useRecipes()
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const resultados = useMemo(() => {
    const q = normalize(busqueda)
    if (!q) return []
    return recetas
      .filter((r) => normalize(r.nombre).includes(q))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [busqueda, recetas])

  const conteo = (catId) => recetas.filter((r) => r.categoria === catId).length

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: '2rem' }}>Italo Gelateria</h1>
        <p style={{ color: 'var(--texto-suave)', fontWeight: 600, marginTop: 4 }}>
          Recetario de producción
        </p>
      </div>

      <SearchBar valor={busqueda} onChange={setBusqueda} />

      {busqueda ? (
        <div className="recipe-grid">
          {resultados.length === 0 ? (
            <div className="empty" style={{ gridColumn: '1 / -1' }}>
              <div className="ico">🤷</div>
              <p>No encontramos «{busqueda}»</p>
            </div>
          ) : (
            resultados.map((r) => <RecipeCard key={r.id} receta={r} />)
          )}
        </div>
      ) : (
        <>
          <div className="cat-grid">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                className={`cat-card ${c.color} no-sel`}
                onClick={() => navigate(`/categoria/${c.id}`)}
              >
                <span className="emoji" aria-hidden>{c.emoji}</span>
                <div>
                  <div className="label">{c.nombre}</div>
                  <div className="count">
                    {cargando ? '…' : `${conteo(c.id)} receta${conteo(c.id) === 1 ? '' : 's'}`}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            className="btn btn--gold btn--full btn--lg no-sel"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/guia')}
          >
            📖 Guía de servicio y normas
          </button>
        </>
      )}
    </div>
  )
}
