import { useState, useEffect } from 'react'

// Teclado numérico grande para ingresar el PIN de administrador.
export default function PinModal({ titulo = 'PIN de administrador', onOk, onCancel }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const LARGO = 4

  // Valida cuando se completan los 4 dígitos. Usar useEffect evita
  // problemas con toques muy rápidos (el estado siempre está al día).
  useEffect(() => {
    if (pin.length !== LARGO) return
    const t = setTimeout(() => {
      const ok = onOk(pin)
      if (!ok) {
        setError(true)
        setPin('')
      }
    }, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  function pulsar(n) {
    setError(false)
    setPin((p) => (p.length >= LARGO ? p : p + n))
  }

  function borrar() {
    setError(false)
    setPin((p) => p.slice(0, -1))
  }

  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>🔒 {titulo}</h2>
        <p>{error ? 'PIN incorrecto, intenta de nuevo' : 'Ingresa el PIN para editar'}</p>
        <div className="pin-dots">
          {Array.from({ length: LARGO }).map((_, i) => (
            <span key={i} className={`dot ${i < pin.length ? 'on' : ''}`} />
          ))}
        </div>
        <div className="keypad">
          {teclas.map((t) => (
            <button key={t} onClick={() => pulsar(t)}>
              {t}
            </button>
          ))}
          <button onClick={borrar} aria-label="Borrar">⌫</button>
          <button onClick={() => pulsar('0')}>0</button>
          <button onClick={onCancel} aria-label="Cancelar" style={{ fontSize: '1rem' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
