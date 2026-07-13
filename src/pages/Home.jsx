import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { useRecipes } from '../context/RecipesContext'
import { useInventario } from '../context/InventarioContext'
import { CATEGORIAS, coincide } from '../utils/format'

export default function Home() {
  const { recetas, cargando } = useRecipes()
  const { bajoMinimo } = useInventario()
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const resultados = useMemo(() => {
    if (!busqueda.trim()) return []
    return recetas
      .filter((r) => coincide(r, busqueda))
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
          <div className="section" style={{ marginTop: 18 }}>
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
            className="btn btn--olive btn--full btn--lg no-sel"
            style={{ marginTop: 16, position: 'relative' }}
            onClick={() => navigate('/inventario')}
          >
            📦 Inventario e insumos
            {bajoMinimo.length > 0 && (
              <span className="nav-badge" aria-label={`${bajoMinimo.length} insumos bajos`}>
                {bajoMinimo.length}
              </span>
            )}
          </button>

          <button
            className="btn btn--gold btn--full btn--lg no-sel"
            style={{ marginTop: 12 }}
            onClick={() => navigate('/guia')}
          >
            📖 Guía de servicio y normas
          </button>
        </>
      )}
    </div>
  )
}
