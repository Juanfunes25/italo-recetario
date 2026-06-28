// Barra de búsqueda grande y simple.
export default function SearchBar({ valor, onChange, placeholder = 'Buscar receta…' }) {
  return (
    <div className="search">
      <span className="ico" aria-hidden>🔍</span>
      <input
        type="search"
        inputMode="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {valor && (
        <button
          className="icon-btn"
          style={{ width: 40, height: 40, minWidth: 40, fontSize: '1.1rem', boxShadow: 'none' }}
          onClick={() => onChange('')}
          aria-label="Limpiar"
        >
          ✕
        </button>
      )}
    </div>
  )
}
