import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { useRecipes } from '../context/RecipesContext'

// Ajustes de administrador: cambiar el PIN y restaurar el recetario base.
export default function Settings() {
  const navigate = useNavigate()
  const { cambiarPin } = useAdmin()
  const { restaurarBase } = useRecipes()
  const [nuevo, setNuevo] = useState('')
  const [confirma, setConfirma] = useState('')
  const [msg, setMsg] = useState(null)
  const [restaurando, setRestaurando] = useState(false)

  async function alRestaurar() {
    setRestaurando(true)
    try {
      const n = await restaurarBase()
      setMsg({
        tipo: 'ok',
        txt: n > 0 ? `Se restauraron ${n} receta(s) base.` : 'No faltaba ninguna receta base.',
      })
    } finally {
      setRestaurando(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function guardar() {
    if (!/^\d{4}$/.test(nuevo)) {
      setMsg({ tipo: 'error', txt: 'El PIN debe tener 4 números.' })
      return
    }
    if (nuevo !== confirma) {
      setMsg({ tipo: 'error', txt: 'Los PIN no coinciden.' })
      return
    }
    cambiarPin(nuevo)
    setMsg({ tipo: 'ok', txt: 'PIN actualizado correctamente.' })
    setNuevo('')
    setConfirma('')
  }

  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.4rem' }}>⚙️ Ajustes</h1>
      </div>
      <div className="container">
        <div className="field">
          <label>Cambiar PIN de administrador</label>
          <p style={{ color: 'var(--texto-suave)', fontSize: '.95rem', marginTop: 0 }}>
            El PIN protege crear, editar y borrar recetas.
          </p>
        </div>

        {msg && (
          <div
            className="notes"
            style={{
              marginBottom: 16,
              borderColor: msg.tipo === 'error' ? 'var(--error)' : 'var(--ok)',
              background: msg.tipo === 'error' ? '#fdecea' : '#eef6ea',
            }}
          >
            <p style={{ margin: 0, fontWeight: 700 }}>{msg.txt}</p>
          </div>
        )}

        <div className="field">
          <label>Nuevo PIN (4 números)</label>
          <input
            className="input" type="password" inputMode="numeric" maxLength={4}
            value={nuevo} onChange={(e) => setNuevo(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
          />
        </div>
        <div className="field">
          <label>Repetir nuevo PIN</label>
          <input
            className="input" type="password" inputMode="numeric" maxLength={4}
            value={confirma} onChange={(e) => setConfirma(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
          />
        </div>

        <button className="btn btn--full btn--lg" onClick={guardar}>💾 Guardar nuevo PIN</button>

        <hr style={{ border: 'none', borderTop: '2px solid var(--crema-2)', margin: '28px 0 20px' }} />

        <div className="field">
          <label>Recetario base</label>
          <p style={{ color: 'var(--texto-suave)', fontSize: '.95rem', marginTop: 0 }}>
            Vuelve a agregar las recetas de fábrica (café, bebidas y comidas) que se hayan
            borrado. No toca ni modifica tus recetas propias.
          </p>
        </div>
        <button className="btn btn--olive btn--full" onClick={alRestaurar} disabled={restaurando}>
          {restaurando ? 'Restaurando…' : '♻️ Restaurar recetario base'}
        </button>
      </div>
    </div>
  )
}
