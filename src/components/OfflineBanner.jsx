import { useEffect, useState } from 'react'

// Banner discreto cuando no hay internet. La app funciona igual (offline),
// esto solo informa que se está viendo la versión guardada.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(() => !navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (!offline) return null
  return (
    <div className="offline-banner" role="status">
      📵 Sin conexión — estás viendo la versión guardada
    </div>
  )
}
