import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import { RecipesProvider } from './context/RecipesContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AdminProvider>
        <RecipesProvider>
          <App />
        </RecipesProvider>
      </AdminProvider>
    </HashRouter>
  </StrictMode>,
)
