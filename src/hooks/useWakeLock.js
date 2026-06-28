import { useEffect, useRef, useState } from 'react'

// Mantiene la pantalla encendida mientras el modo cocina está activo.
// Reintenta automáticamente si el sistema libera el bloqueo (ej: al volver
// de segundo plano). Si el navegador no soporta Wake Lock, falla en silencio.
export function useWakeLock(active) {
  const lockRef = useRef(null)
  const [supported] = useState(() => 'wakeLock' in navigator)

  useEffect(() => {
    if (!active || !supported) return
    let cancelled = false

    async function request() {
      try {
        lockRef.current = await navigator.wakeLock.request('screen')
        lockRef.current.addEventListener?.('release', () => {
          lockRef.current = null
        })
      } catch {
        /* ignorar: no es crítico */
      }
    }

    function onVisibility() {
      if (!cancelled && document.visibilityState === 'visible' && !lockRef.current) {
        request()
      }
    }

    request()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      lockRef.current?.release?.().catch(() => {})
      lockRef.current = null
    }
  }, [active, supported])

  return supported
}
