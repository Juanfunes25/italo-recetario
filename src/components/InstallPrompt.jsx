import { useEffect, useState } from 'react'

// Muestra un banner para instalar la app en la pantalla de inicio.
// Aparece cuando el navegador lo permite (Android/Chrome). Se puede ocultar.
export default function InstallPrompt() {
  const [evento, setEvento] = useState(null)
  const [oculto, setOculto] = useState(
    () => sessionStorage.getItem('ocultar-instalar') === '1'
  )

  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setEvento(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!evento || oculto) return null

  async function instalar() {
    evento.prompt()
    await evento.userChoice
    setEvento(null)
  }

  function descartar() {
    sessionStorage.setItem('ocultar-instalar', '1')
    setOculto(true)
  }

  return (
    <div className="install-banner">
      <span aria-hidden style={{ fontSize: '1.6rem' }}>📲</span>
      <span className="txt">Instala el recetario en la tablet para usarlo sin internet.</span>
      <button className="yes" onClick={instalar}>Instalar</button>
      <button className="no" onClick={descartar} aria-label="Ahora no">✕</button>
    </div>
  )
}
