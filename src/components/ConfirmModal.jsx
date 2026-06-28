// Modal de confirmación genérico (ej: borrar receta).
export default function ConfirmModal({ titulo, mensaje, confirmar = 'Confirmar', peligro = false, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {mensaje && <p>{mensaje}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          <button className={`btn ${peligro ? 'btn--danger' : ''} btn--full`} onClick={onConfirm}>
            {confirmar}
          </button>
          <button className="btn btn--ghost btn--full" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
