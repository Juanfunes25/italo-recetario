import { Component } from 'react'

// Evita la "pantalla en blanco": si algo revienta al renderizar,
// muestra un mensaje claro con opción de recargar.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="empty" style={{ marginTop: '25vh', padding: 24 }}>
        <div className="ico">😵</div>
        <h2 style={{ marginBottom: 8 }}>Algo salió mal</h2>
        <p>Tus recetas e inventario están a salvo. Recarga la app para continuar.</p>
        <button className="btn btn--lg" onClick={() => window.location.reload()}>
          🔄 Recargar
        </button>
      </div>
    )
  }
}
