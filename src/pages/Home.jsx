import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { useRecipes } from '../context/RecipesContext'
import { CATEGORIAS, coincide } from '../utils/format'
import { getRecientesIds } from '../utils/recientes'

export default function Home() {
  const { recetas, cargando } = useRecipes()
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const resultados = useMemo(() => {
    if (!busqueda.trim()) return []
    return recetas
      .filter((r) => coincide(r, busqueda))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [busqueda, recetas])

  // Últimas 4 recetas abiertas que todavía existen
  const recientes = useMemo(() => {
    if (cargando) return []
    return getRecientesIds(4)
      .map((id) => recetas.find((r) => r.id === id))
      .filter(Boolean)
  }, [recetas, cargando])

  const conteo = (catId) => recetas.filter((r) => r.categoria === catId).length

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: '2rem' }}>Italo Gelateria</h1>
        <p style={{ color: 'var(--texto-suave)', fontWeight: 600, marginTop: 4 }}>
          Recetario de producción
        </p>
      </div>

      <SearchBar valor={busqueda} onChange={setBusqueda} placeholder="Buscar receta o ingrediente…" />

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
          {recientes.length > 0 && (
            <div className="section" style={{ marginTop: 18 }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                🕘 Usadas recientemente
              </h2>
              <div className="recipe-grid">
                {recientes.map((r) => (
                  <RecipeCard key={r.id} receta={r} />
                ))}
              </div>
            </div>
          )}

          <div className="section" style={{ marginTop: 22 }}>
            <h2 style={{ marginBottom: 12 }}>📂 Categorías</h2>
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
