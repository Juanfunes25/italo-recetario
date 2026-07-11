import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import { RecipesProvider } from './context/RecipesContext'
import { InventarioProvider } from './context/InventarioContext'

// Actualización automática: cuando el service worker instala una versión
// nueva y toma el control, recargamos la página una vez para que el usuario
// vea los cambios sin tener que limpiar caché a mano.
if ('serviceWorker' in navigator) {
  let recargando = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargando) return
    recargando = true
    window.location.reload()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AdminProvider>
        <RecipesProvider>
          <InventarioProvider>
            <App />
          </InventarioProvider>
        </RecipesProvider>
      </AdminProvider>
    </HashRouter>
  </StrictMode>,
)
