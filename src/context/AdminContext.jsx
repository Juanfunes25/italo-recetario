import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSetting, setSetting } from '../db/idb'

const AdminContext = createContext(null)
const PIN_POR_DEFECTO = '1234'

// Maneja el "modo administrador". Los empleados ven todo en solo-lectura;
// solo quien sabe el PIN puede crear/editar/borrar.
// La sesión de admin dura hasta cerrar o salir manualmente (no se persiste,
// así si cierran la app vuelve a modo seguro).
export function AdminProvider({ children }) {
  const [esAdmin, setEsAdmin] = useState(false)
  const [pin, setPin] = useState(PIN_POR_DEFECTO)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    ;(async () => {
      const guardado = await getSetting('pin_admin', PIN_POR_DEFECTO)
      setPin(guardado)
      setListo(true)
    })()
  }, [])

  // Intenta entrar como admin. Devuelve true/false.
  const login = useCallback(
    (intento) => {
      if (intento === pin) {
        setEsAdmin(true)
        return true
      }
      return false
    },
    [pin]
  )

  const logout = useCallback(() => setEsAdmin(false), [])

  const cambiarPin = useCallback(async (nuevo) => {
    await setSetting('pin_admin', nuevo)
    setPin(nuevo)
  }, [])

  return (
    <AdminContext.Provider value={{ esAdmin, login, logout, cambiarPin, listo }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin debe usarse dentro de AdminProvider')
  return ctx
}
