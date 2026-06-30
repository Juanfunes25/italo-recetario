// ===========================================================
// Portadas ilustradas POR PRODUCTO (SVG embebido como data URL).
// Cada bebida/comida tiene una forma y color distintos para que
// los empleados las distingan de un vistazo y no se confundan.
// Son livianas y funcionan offline. Lo ideal: reemplazarlas con
// una FOTO REAL del producto desde la cámara (botón en cada receta).
// ===========================================================
function svg(markup) {
  return 'data:image/svg+xml,' + encodeURIComponent(markup)
}

// Fondos reutilizables (cada SVG es su propio documento, los ids no chocan)
const BG_CAFE = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E7CE"/><stop offset="1" stop-color="#DEC79A"/></linearGradient>`
const BG_FRIO = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF0DC"/><stop offset="1" stop-color="#C9D6A6"/></linearGradient>`
const BG_COMIDA = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEDCBE"/><stop offset="1" stop-color="#CFA86C"/></linearGradient>`
const rect = `<rect width="320" height="200" fill="url(#bg)"/>`

// ---------- CAFÉ Y BEBIDAS CALIENTES ----------

// Espresso — taza pequeña (demitasse), café muy oscuro
export const COVER_ESPRESSO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"><path d="M150 70 q-6 -10 0 -18"/><path d="M170 70 q-6 -10 0 -18"/></g>
  <ellipse cx="160" cy="158" rx="58" ry="11" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M134 104 H186 L181 138 Q179 148 168 148 H152 Q141 148 139 138 Z" fill="#FBF6EC" stroke="#9c4a2d" stroke-width="3"/>
  <ellipse cx="160" cy="106" rx="26" ry="7" fill="#3a2418"/>
  <path d="M186 110 q22 2 20 18 q-2 12 -20 11" fill="none" stroke="#9c4a2d" stroke-width="5"/>
</svg>`)

// Americano — taza mediana, café negro largo
export const COVER_AMERICANO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"><path d="M150 58 q-7 -12 0 -22"/><path d="M172 58 q-7 -12 0 -22"/></g>
  <ellipse cx="160" cy="166" rx="70" ry="12" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M118 88 H202 L194 150 Q192 160 178 160 H142 Q128 160 126 150 Z" fill="#FBF6EC" stroke="#7a4a22" stroke-width="3"/>
  <ellipse cx="160" cy="90" rx="42" ry="10" fill="#43291a"/>
  <path d="M202 98 q30 3 27 26 q-3 18 -27 15" fill="none" stroke="#7a4a22" stroke-width="6"/>
</svg>`)

// Cappuccino — taza con domo de espuma y cacao
export const COVER_CAPPUCCINO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <ellipse cx="160" cy="170" rx="74" ry="12" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M116 92 H204 L196 152 Q194 162 180 162 H140 Q126 162 124 152 Z" fill="#FBF6EC" stroke="#9c6a2e" stroke-width="3"/>
  <path d="M118 96 q42 -28 84 0 q-42 16 -84 0 Z" fill="#FCF4E4" stroke="#caa15c" stroke-width="2.5"/>
  <g fill="#8a5a2e" opacity=".6"><circle cx="160" cy="86" r="3"/><circle cx="144" cy="92" r="2.5"/><circle cx="176" cy="92" r="2.5"/></g>
  <path d="M204 100 q28 3 25 24 q-3 17 -25 14" fill="none" stroke="#9c6a2e" stroke-width="6"/>
</svg>`)

// Latte — vaso alto con capas y arte (corazón)
export const COVER_LATTE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <path d="M126 44 H194 L186 174 H134 Z" fill="#FFFDF8" opacity=".5"/>
  <path d="M126 44 H194 L186 174 H134 Z" fill="none" stroke="#9c6a2e" stroke-width="3" stroke-linejoin="round"/>
  <path d="M132 96 H188 L184 150 H136 Z" fill="#C39A63"/>
  <path d="M129 70 H191 L189 96 H131 Z" fill="#8a5a32"/>
  <path d="M128 50 H192 L190 70 H130 Z" fill="#FCF4E4"/>
  <path d="M160 54 q-9 -7 -14 1 q-4 7 14 16 q18 -9 14 -16 q-5 -8 -14 -1 Z" fill="#b07a45"/>
</svg>`)

// Chai caliente — taza ámbar con canela
export const COVER_CHAI = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"><path d="M150 56 q-7 -12 0 -22"/><path d="M172 56 q-7 -12 0 -22"/></g>
  <ellipse cx="158" cy="168" rx="70" ry="12" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M114 90 H202 L194 152 Q192 162 178 162 H138 Q124 162 122 152 Z" fill="#FBF6EC" stroke="#9c6a2e" stroke-width="3"/>
  <ellipse cx="158" cy="92" rx="44" ry="10" fill="#C9853B"/>
  <rect x="150" y="64" width="7" height="34" rx="3" fill="#8a4a22" transform="rotate(14 153 80)"/>
  <path d="M202 100 q28 3 25 24 q-3 17 -25 14" fill="none" stroke="#9c6a2e" stroke-width="6"/>
</svg>`)

// Macchiato — taza pequeña con punto de espuma
export const COVER_MACCHIATO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <ellipse cx="160" cy="158" rx="58" ry="11" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M134 102 H186 L181 138 Q179 148 168 148 H152 Q141 148 139 138 Z" fill="#FBF6EC" stroke="#9c4a2d" stroke-width="3"/>
  <ellipse cx="160" cy="104" rx="26" ry="7" fill="#43291a"/>
  <ellipse cx="160" cy="101" rx="11" ry="6" fill="#FCF4E4"/>
  <path d="M186 108 q22 2 20 18 q-2 12 -20 11" fill="none" stroke="#9c4a2d" stroke-width="5"/>
</svg>`)

// Mocha — taza con crema batida y chorrito de chocolate
export const COVER_MOCHA = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <ellipse cx="158" cy="172" rx="72" ry="12" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M116 96 H200 L193 156 Q191 166 178 166 H138 Q125 166 123 156 Z" fill="#FBF6EC" stroke="#6b431f" stroke-width="3"/>
  <ellipse cx="158" cy="98" rx="42" ry="10" fill="#5a3a22"/>
  <path d="M122 92 q18 -22 36 -6 q18 -16 36 6 q-36 14 -72 0 Z" fill="#FCF4E4" stroke="#d8c19a" stroke-width="2"/>
  <path d="M140 80 q18 8 36 0" fill="none" stroke="#5a3320" stroke-width="3" stroke-linecap="round"/>
  <path d="M200 104 q26 3 23 23 q-3 16 -23 13" fill="none" stroke="#6b431f" stroke-width="6"/>
</svg>`)

// Chocolate caliente — taza chocolate con crema y malvaviscos
export const COVER_CHOCOLATE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_CAFE}</defs>${rect}
  <ellipse cx="158" cy="172" rx="74" ry="12" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <path d="M114 94 H202 L194 156 Q192 166 178 166 H138 Q124 166 122 156 Z" fill="#7a4a28" stroke="#4d2c14" stroke-width="3"/>
  <ellipse cx="158" cy="96" rx="44" ry="10" fill="#3d2415"/>
  <path d="M120 90 q19 -20 38 -5 q19 -15 38 5 q-38 14 -76 0 Z" fill="#FCF4E4" stroke="#d8c19a" stroke-width="2"/>
  <rect x="146" y="74" width="13" height="11" rx="2" fill="#fff" stroke="#e6d3b0" stroke-width="1.5"/>
  <rect x="163" y="78" width="12" height="10" rx="2" fill="#fff" stroke="#e6d3b0" stroke-width="1.5"/>
  <path d="M202 102 q26 3 23 23 q-3 16 -23 13" fill="none" stroke="#4d2c14" stroke-width="6"/>
</svg>`)

// ---------- BEBIDAS FRÍAS ----------

// Ice Latte — vaso alto con hielo y capas
export const COVER_ICE_LATTE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_FRIO}</defs>${rect}
  <rect x="206" y="36" width="8" height="70" rx="4" fill="#C5603C" transform="rotate(10 210 70)"/>
  <path d="M128 54 H192 L184 176 H136 Z" fill="#fff" opacity=".4"/>
  <path d="M132 96 H188 L184 150 H136 Z" fill="#a87b4c"/>
  <path d="M129 70 H191 L188 100 H132 Z" fill="#e7d3b4"/>
  <g fill="#fff" opacity=".75" stroke="#bcd0e0" stroke-width="1.5"><rect x="140" y="74" width="20" height="20" rx="4" transform="rotate(-12 150 84)"/><rect x="162" y="82" width="18" height="18" rx="4" transform="rotate(15 171 91)"/></g>
  <path d="M128 54 H192 L184 176 H136 Z" fill="none" stroke="#5d6638" stroke-width="3" stroke-linejoin="round"/>
</svg>`)

// Chai helado — vaso alto ámbar con hielo y pajilla
export const COVER_CHAI_HELADO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_FRIO}</defs>${rect}
  <rect x="206" y="36" width="8" height="70" rx="4" fill="#7A8450" transform="rotate(10 210 70)"/>
  <path d="M128 54 H192 L184 176 H136 Z" fill="#D69A4E" opacity=".85"/>
  <g fill="#fff" opacity=".7" stroke="#e6c98f" stroke-width="1.5"><rect x="138" y="78" width="20" height="20" rx="4" transform="rotate(-14 148 88)"/><rect x="160" y="92" width="18" height="18" rx="4" transform="rotate(12 169 101)"/><rect x="150" y="120" width="17" height="17" rx="4" transform="rotate(8 158 128)"/></g>
  <path d="M128 54 H192 L184 176 H136 Z" fill="none" stroke="#5d6638" stroke-width="3" stroke-linejoin="round"/>
</svg>`)

// Affogato — copa baja con bola de gelato y espresso
export const COVER_AFFOGATO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_FRIO}</defs>${rect}
  <path d="M118 96 Q120 150 160 150 Q200 150 202 96 Z" fill="#6F4528" opacity=".9"/>
  <path d="M118 96 H202 L198 110 Q160 122 122 110 Z" fill="#FBF6EC"/>
  <circle cx="160" cy="84" r="34" fill="#FBF1DC" stroke="#e6d3b0" stroke-width="2"/>
  <path d="M118 96 Q120 152 160 152 Q200 152 202 96" fill="none" stroke="#5d6638" stroke-width="3"/>
  <rect x="150" y="150" width="20" height="14" fill="#FBF6EC" stroke="#5d6638" stroke-width="3"/>
  <ellipse cx="160" cy="170" rx="34" ry="8" fill="#FBF6EC" stroke="#5d6638" stroke-width="3"/>
</svg>`)

// Malteada (Frullato) — vaso alto, crema batida y cereza
export const COVER_MALTEADA = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_FRIO}</defs>${rect}
  <rect x="186" y="22" width="8" height="64" rx="4" fill="#C5603C" transform="rotate(12 190 54)"/>
  <path d="M126 70 H194 L184 176 H136 Z" fill="#F3E4C9" stroke="#5d6638" stroke-width="3" stroke-linejoin="round"/>
  <path d="M124 72 q35 -30 70 0 q-12 18 -35 18 q-23 0 -35 -18 Z" fill="#FCF4E4" stroke="#d8c19a" stroke-width="2"/>
  <path d="M150 50 q10 -16 22 -6 q-2 10 -10 14 q-8 2 -12 -8 Z" fill="#FBF6EC" stroke="#d8c19a" stroke-width="2"/>
  <circle cx="160" cy="44" r="9" fill="#C0392B"/>
  <path d="M160 36 q8 -10 18 -8" fill="none" stroke="#6B7A3F" stroke-width="3" stroke-linecap="round"/>
</svg>`)

// ---------- COMIDAS ----------

// Arancino — bola dorada empanizada partida, con salsa, en tabla
export const COVER_ARANCINO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_COMIDA}</defs>${rect}
  <ellipse cx="160" cy="120" rx="124" ry="54" fill="#6b441f" opacity=".22"/>
  <ellipse cx="160" cy="112" rx="122" ry="52" fill="#A6743F" stroke="#6b441f" stroke-width="3"/>
  <rect x="252" y="104" width="46" height="16" rx="8" fill="#A6743F" stroke="#6b441f" stroke-width="3"/>
  <circle cx="128" cy="104" r="34" fill="#E0A24B" stroke="#9c6a25" stroke-width="3"/>
  <circle cx="128" cy="104" r="17" fill="#F2C879"/>
  <ellipse cx="128" cy="104" rx="9" ry="6" fill="#E8B04C"/>
  <g fill="#9c6a25" opacity=".5"><circle cx="114" cy="96" r="2.5"/><circle cx="140" cy="94" r="2.5"/><circle cx="118" cy="116" r="2.5"/><circle cx="142" cy="116" r="2.5"/></g>
  <ellipse cx="200" cy="118" rx="28" ry="17" fill="#FBF6EC" stroke="#9c4a2d" stroke-width="3"/>
  <ellipse cx="200" cy="116" rx="19" ry="10" fill="#C0392B"/>
</svg>`)

// Banana Split — barquito con banano y 3 bolas
export const COVER_BANANA_SPLIT = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_COMIDA}</defs>${rect}
  <path d="M70 122 Q160 162 250 122 L244 134 Q160 168 76 134 Z" fill="#fff" opacity=".5"/>
  <path d="M64 116 Q160 150 256 116" fill="none" stroke="#E9D08A" stroke-width="8" stroke-linecap="round"/>
  <path d="M70 124 Q160 158 250 124" fill="none" stroke="#E9D08A" stroke-width="8" stroke-linecap="round"/>
  <circle cx="118" cy="96" r="26" fill="#FBF1DC" stroke="#e6d3b0" stroke-width="2"/>
  <circle cx="160" cy="90" r="27" fill="#C5603C" stroke="#9c4a2d" stroke-width="2"/>
  <circle cx="202" cy="96" r="26" fill="#9FAE6A" stroke="#5d6638" stroke-width="2"/>
  <circle cx="160" cy="60" r="9" fill="#C0392B"/>
  <path d="M160 52 q8 -8 16 -6" fill="none" stroke="#6B7A3F" stroke-width="3" stroke-linecap="round"/>
</svg>`)

// Crepa — crepa doblada en triángulo, con fresa y azúcar glass
export const COVER_CREPA = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_COMIDA}</defs>${rect}
  <ellipse cx="160" cy="150" rx="118" ry="34" fill="#fff" opacity=".55"/>
  <ellipse cx="160" cy="146" rx="116" ry="32" fill="#FBF6EC" stroke="#e0cda4" stroke-width="3"/>
  <path d="M84 150 L160 70 L236 150 Q160 168 84 150 Z" fill="#E8C277" stroke="#bf923f" stroke-width="3" stroke-linejoin="round"/>
  <path d="M120 150 L160 96 L200 150" fill="#D9A94E" opacity=".55"/>
  <g fill="#fff" opacity=".8"><circle cx="140" cy="128" r="2.2"/><circle cx="180" cy="124" r="2.2"/><circle cx="160" cy="140" r="2.2"/><circle cx="150" cy="112" r="2"/></g>
  <path d="M168 88 q10 -4 16 4 q-4 12 -16 10 q-6 -8 0 -14 Z" fill="#C0392B"/>
  <path d="M180 84 l4 -8" stroke="#6B7A3F" stroke-width="3" stroke-linecap="round"/>
</svg>`)

// Pan caliente (servicio) — pan en tabla de madera
export const COVER_PAN = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>${BG_COMIDA}</defs>${rect}
  <ellipse cx="160" cy="124" rx="124" ry="50" fill="#6b441f" opacity=".22"/>
  <ellipse cx="160" cy="116" rx="122" ry="48" fill="#A6743F" stroke="#6b441f" stroke-width="3"/>
  <rect x="252" y="108" width="46" height="16" rx="8" fill="#A6743F" stroke="#6b441f" stroke-width="3"/>
  <path d="M96 110 Q100 74 160 74 Q220 74 224 110 Q224 122 160 122 Q96 122 96 110 Z" fill="#D79B4E" stroke="#9c6a2e" stroke-width="3"/>
  <g stroke="#9c6a2e" stroke-width="2.5" opacity=".55" stroke-linecap="round"><path d="M126 86 l6 -10"/><path d="M152 82 l4 -10"/><path d="M180 84 l6 -10"/><path d="M206 90 l6 -8"/></g>
</svg>`)

// Focaccia (Pan) — pan rústico con romero (se mantiene)
export const COVER_FOCACCIA = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E7C4"/><stop offset="1" stop-color="#E3BE6E"/></linearGradient>
    <radialGradient id="pan" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#E8B45A"/><stop offset="1" stop-color="#B97E2E"/></radialGradient></defs>
  <rect width="320" height="200" fill="url(#bg2)"/>
  <ellipse cx="160" cy="118" rx="118" ry="60" fill="#8A5A22" opacity=".18"/>
  <ellipse cx="160" cy="108" rx="116" ry="58" fill="url(#pan)" stroke="#8A5A22" stroke-width="3"/>
  <g fill="#8A5A22" opacity=".45"><circle cx="110" cy="92" r="4"/><circle cx="150" cy="108" r="4"/><circle cx="195" cy="90" r="4"/><circle cx="130" cy="125" r="4"/><circle cx="180" cy="128" r="4"/><circle cx="215" cy="115" r="4"/><circle cx="95" cy="118" r="4"/></g>
  <g stroke="#5d6638" stroke-width="2.5" stroke-linecap="round" opacity=".8"><path d="M120 80 l10 -16 M125 82 l16 -8 M128 86 l18 2"/><path d="M200 120 l12 -14 M205 124 l17 -6 M206 128 l18 3"/></g>
</svg>`)
