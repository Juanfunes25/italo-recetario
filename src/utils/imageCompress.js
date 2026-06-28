// Comprime/redimensiona una imagen (File o Blob) antes de guardarla.
// Devuelve un data URL (string) listo para guardar en IndexedDB.
// Evita llenar la memoria de la tablet con fotos enormes de la cámara.
export function compressImage(file, { maxSize = 1280, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Imagen inválida'))
      img.onload = () => {
        let { width, height } = img
        // Escala manteniendo proporción
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // JPEG comprimido (las fotos de comida no necesitan PNG)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
