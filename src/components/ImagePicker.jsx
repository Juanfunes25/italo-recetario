import { useRef, useState } from 'react'
import { compressImage } from '../utils/imageCompress'

// Selector de imagen desde cámara o galería. Comprime antes de guardar.
// `valor` es un data URL (o null). `onChange(dataUrl|null)`.
export default function ImagePicker({ valor, onChange, etiqueta = 'Agregar foto', compacto = false }) {
  const inputRef = useRef(null)
  const [cargando, setCargando] = useState(false)

  async function alElegir(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir la misma foto
    if (!file) return
    setCargando(true)
    try {
      const dataUrl = await compressImage(file)
      onChange(dataUrl)
    } catch {
      alert('No se pudo procesar la imagen. Intenta con otra.')
    } finally {
      setCargando(false)
    }
  }

  if (valor) {
    return (
      <div className="img-preview">
        <img src={valor} alt="Vista previa" />
        <button type="button" className="remove" onClick={() => onChange(null)} aria-label="Quitar foto">
          ✕
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="img-picker"
        style={compacto ? { minHeight: 90, padding: 14 } : undefined}
        onClick={() => inputRef.current?.click()}
        disabled={cargando}
      >
        <span className="ico" aria-hidden>{cargando ? '⏳' : '📷'}</span>
        <span>{cargando ? 'Procesando…' : etiqueta}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={alElegir}
      />
    </>
  )
}
