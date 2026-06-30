import { NavLink } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

// Navegación inferior fija con accesos grandes.
export default function BottomNav({ onAdminClick }) {
  const { esAdmin, logout } = useAdmin()

  const item = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <nav className="bottom-nav no-sel">
      <NavLink to="/" className={item} end>
        <span className="ico">🏠</span>
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/categoria/pan" className={item}>
        <span className="ico">🍞</span>
        <span>Pan</span>
      </NavLink>
      <NavLink to="/categoria/bebidas" className={item}>
        <span className="ico">🥤</span>
        <span>Bebidas</span>
      </NavLink>
      <NavLink to="/categoria/comidas" className={item}>
        <span className="ico">🍽️</span>
        <span>Comidas</span>
      </NavLink>
      {esAdmin ? (
        <a role="button" onClick={logout} className="active">
          <span className="ico">🔓</span>
          <span>Salir</span>
        </a>
      ) : (
        <a role="button" onClick={onAdminClick}>
          <span className="ico">🔒</span>
          <span>Admin</span>
        </a>
      )}
    </nav>
  )
}
