import { useNavigate } from 'react-router-dom'

// Guía de servicio para empleados: normas, porciones, higiene y atención.
// Tomada del "Manual de Preparación de Bebidas y Café" de Italo.
// Es solo lectura — referencia rápida para que todos hagan las cosas igual.

const PORCIONES = [
  { nombre: 'Copa Pícola', detalle: '120 g de gelato' },
  { nombre: 'Copa Clásica', detalle: '170 g de gelato' },
  { nombre: 'Copa Grande', detalle: '250 g de gelato' },
  { nombre: 'Copa Waffle', detalle: '230 g de gelato' },
  { nombre: 'Banana Split', detalle: '250 g (3 sabores)' },
  { nombre: 'Basqueta To Go', detalle: '400 g de gelato' },
  { nombre: 'Basqueta 1 kg', detalle: '1 kilogramo' },
  { nombre: 'Basqueta 1.5 kg', detalle: '1.5 kilogramos' },
  { nombre: 'Cono Pícolo', detalle: '1 bolita' },
  { nombre: 'Cono Clásico', detalle: '2 bolitas' },
  { nombre: 'Cono Grande', detalle: '3 bolitas' },
]

function Seccion({ icono, titulo, children }) {
  return (
    <div className="section">
      <h2>{icono} {titulo}</h2>
      {children}
    </div>
  )
}

export default function Guia() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-head">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Atrás">←</button>
        <h1 style={{ fontSize: '1.4rem' }}>📖 Guía de servicio</h1>
      </div>

      <div className="container">
        <p style={{ color: 'var(--texto-suave)', fontWeight: 600, marginTop: 0 }}>
          Referencia rápida para que todos sirvamos igual de bien. Si tienes una
          duda, revísala aquí antes de servir.
        </p>

        <Seccion icono="✅" titulo="Normas generales">
          <ul className="ingredients">
            <li><span className="name">Lávate las manos antes de manipular ingredientes.</span></li>
            <li><span className="name">Usa utensilios y equipos limpios.</span></li>
            <li><span className="name">Sigue las recetas con precisión (mismas cantidades siempre).</span></li>
            <li><span className="name">Mantén el área de trabajo ordenada.</span></li>
            <li><span className="name">Usa siempre productos frescos y en buen estado.</span></li>
          </ul>
        </Seccion>

        <Seccion icono="🍨" titulo="Porciones de gelato">
          <p style={{ color: 'var(--texto-suave)', marginTop: 0 }}>
            Cuánto gelato lleva cada presentación. Pesa siempre que puedas.
          </p>
          <ul className="ingredients">
            {PORCIONES.map((p) => (
              <li key={p.nombre}>
                <span className="qty" style={{ minWidth: 130 }}>{p.nombre}</span>
                <span className="name">{p.detalle}</span>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion icono="🧼" titulo="Higiene y seguridad">
          <ul className="ingredients">
            <li><span className="name">Limpia a diario las áreas y equipos (máquina de espresso, vaporizador, licuadora).</span></li>
            <li><span className="name">Cambia filtros y haz el mantenimiento básico según el fabricante.</span></li>
            <li><span className="name">Almacena bien los insumos para evitar contaminación y conservar la calidad.</span></li>
          </ul>
        </Seccion>

        <Seccion icono="🎨" titulo="Presentación y decoración">
          <ul className="ingredients">
            <li><span className="name">Sirve cada bebida y gelato con presentación atractiva y uniforme.</span></li>
            <li><span className="name">Usa toppings o decoraciones (arte latte, salsas, frutas) según el producto.</span></li>
            <li><span className="name">Cuida el empaque y la estética del producto.</span></li>
          </ul>
        </Seccion>

        <Seccion icono="🤝" titulo="Atención al cliente">
          <ul className="ingredients">
            <li><span className="name">Trato cordial, atento y profesional en todo momento.</span></li>
            <li><span className="name">Pregunta las preferencias (por ejemplo, si quieren saborizante en el Ice Latte).</span></li>
            <li><span className="name">Sugiere combinaciones y anota observaciones para mejorar la experiencia.</span></li>
          </ul>
        </Seccion>

        <div className="notes" style={{ marginTop: 8 }}>
          <div className="lbl">💡 ¿Dudas con una receta?</div>
          <p style={{ margin: '8px 0 0' }}>
            Busca el producto en Inicio y abre su receta. Usa el botón
            <b> "Modo cocina" </b> para ver los pasos grandes, uno por uno.
          </p>
        </div>
      </div>
    </div>
  )
}
