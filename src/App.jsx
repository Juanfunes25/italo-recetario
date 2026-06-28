import { useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CategoryList from './pages/CategoryList'
import RecipeView from './pages/RecipeView'
import RecipeEdit from './pages/RecipeEdit'
import CookMode from './pages/CookMode'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'
import PinModal from './components/PinModal'
import InstallPrompt from './components/InstallPrompt'
import { useAdmin } from './context/AdminContext'
import { useRecipes } from './context/RecipesContext'

// Bloquea rutas de edición a quien no es admin.
function SoloAdmin({ children }) {
  const { esAdmin, listo } = useAdmin()
  if (!listo) return null
  return esAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  const { esAdmin, login } = useAdmin()
  const { cargando } = useRecipes()
  const [pedirPin, setPedirPin] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // El modo cocina ocupa toda la pantalla (sin nav inferior)
  const enModoCocina = location.pathname.startsWith('/cocina/')

  if (cargando) {
    return (
      <div className="app">
        <div className="empty" style={{ marginTop: '30vh' }}>
          <div className="ico">🍦</div>
          <p>Cargando recetario…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:catId" element={<CategoryList />} />
        <Route path="/receta/:id" element={<RecipeView />} />
        <Route path="/cocina/:id" element={<CookMode />} />
        <Route path="/nueva" element={<SoloAdmin><RecipeEdit /></SoloAdmin>} />
        <Route path="/editar/:id" element={<SoloAdmin><RecipeEdit /></SoloAdmin>} />
        <Route path="/ajustes" element={<SoloAdmin><Settings /></SoloAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Acceso rápido a ajustes para el admin */}
      {esAdmin && location.pathname === '/' && (
        <button
          className="icon-btn"
          style={{ position: 'fixed', top: 'calc(14px + var(--safe-top))', right: 16, zIndex: 25 }}
          onClick={() => navigate('/ajustes')}
          aria-label="Ajustes"
        >
          ⚙️
        </button>
      )}

      {!enModoCocina && <BottomNav onAdminClick={() => setPedirPin(true)} />}

      {pedirPin && (
        <PinModal
          onCancel={() => setPedirPin(false)}
          onOk={(intento) => {
            const ok = login(intento)
            if (ok) setPedirPin(false)
            return ok
          }}
        />
      )}

      {!enModoCocina && <InstallPrompt />}
    </div>
  )
}
