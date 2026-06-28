// Portadas ilustradas (SVG embebido como data URL) para las recetas de ejemplo.
// Son livianas y offline. El usuario puede reemplazarlas con fotos reales.
function svg(markup) {
  return 'data:image/svg+xml,' + encodeURIComponent(markup)
}

// Gelato — tonos terracota/crema
export const COVER_GELATO = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FBEAD2"/><stop offset="1" stop-color="#F2CBA0"/>
    </linearGradient>
    <linearGradient id="cono" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E8B96B"/><stop offset="1" stop-color="#B5772E"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bg)"/>
  <circle cx="60" cy="40" r="6" fill="#fff" opacity=".5"/>
  <circle cx="280" cy="60" r="9" fill="#fff" opacity=".4"/>
  <path d="M160 188 L132 96 L188 96 Z" fill="url(#cono)" stroke="#8A5A22" stroke-width="3" stroke-linejoin="round"/>
  <path d="M142 116 H178 M148 138 H172 M154 160 H166" stroke="#8A5A22" stroke-width="2.5" opacity=".55" stroke-linecap="round"/>
  <circle cx="138" cy="86" r="26" fill="#FBF6EC" stroke="#C5603C" stroke-width="3"/>
  <circle cx="182" cy="86" r="26" fill="#9FAE6A" stroke="#5d6638" stroke-width="3"/>
  <circle cx="160" cy="58" r="28" fill="#C5603C" stroke="#9c4a2d" stroke-width="3"/>
  <circle cx="160" cy="26" r="9" fill="#B83232"/>
  <path d="M160 18 Q170 6 182 9" stroke="#6B7A3F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</svg>`)

// Focaccia / pan — tonos dorados
export const COVER_FOCACCIA = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F6E7C4"/><stop offset="1" stop-color="#E3BE6E"/>
    </linearGradient>
    <radialGradient id="pan" cx="50%" cy="40%" r="65%">
      <stop offset="0" stop-color="#E8B45A"/><stop offset="1" stop-color="#B97E2E"/>
    </radialGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bg2)"/>
  <ellipse cx="160" cy="118" rx="118" ry="60" fill="#8A5A22" opacity=".18"/>
  <ellipse cx="160" cy="108" rx="116" ry="58" fill="url(#pan)" stroke="#8A5A22" stroke-width="3"/>
  <g fill="#8A5A22" opacity=".45">
    <circle cx="110" cy="92" r="4"/><circle cx="150" cy="108" r="4"/><circle cx="195" cy="90" r="4"/>
    <circle cx="130" cy="125" r="4"/><circle cx="180" cy="128" r="4"/><circle cx="215" cy="115" r="4"/>
    <circle cx="95" cy="118" r="4"/>
  </g>
  <g stroke="#5d6638" stroke-width="2.5" stroke-linecap="round" opacity=".8">
    <path d="M120 80 l10 -16 M125 82 l16 -8 M128 86 l18 2"/>
    <path d="M200 120 l12 -14 M205 124 l17 -6 M206 128 l18 3"/>
  </g>
</svg>`)

// Café caliente — taza con vapor, tonos crema/café
export const COVER_CAFE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="bgc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F1E3CB"/><stop offset="1" stop-color="#D9C19A"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bgc)"/>
  <!-- vapor -->
  <g stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55">
    <path d="M146 50 q-8 -12 0 -24 q8 -12 0 -24"/>
    <path d="M174 50 q-8 -12 0 -24 q8 -12 0 -24"/>
  </g>
  <!-- plato -->
  <ellipse cx="160" cy="168" rx="92" ry="16" fill="#8A5A22" opacity=".25"/>
  <ellipse cx="160" cy="160" rx="90" ry="16" fill="#FBF6EC" stroke="#C9A24A" stroke-width="3"/>
  <!-- taza -->
  <path d="M108 96 H212 L202 140 Q200 152 186 152 H134 Q120 152 118 140 Z" fill="#FBF6EC" stroke="#9c4a2d" stroke-width="3"/>
  <ellipse cx="160" cy="98" rx="52" ry="12" fill="#6F4528"/>
  <ellipse cx="160" cy="96" rx="52" ry="12" fill="none" stroke="#9c4a2d" stroke-width="3"/>
  <!-- asa -->
  <path d="M212 104 q30 4 26 28 q-3 18 -26 16" fill="none" stroke="#9c4a2d" stroke-width="6"/>
  <!-- grano decorativo -->
  <ellipse cx="160" cy="96" rx="14" ry="7" fill="#4a2e1a"/>
  <path d="M160 90 V102" stroke="#6F4528" stroke-width="2"/>
</svg>`)

// Comida en tabla de madera — tonos caramelo
export const COVER_COMIDA = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="bgm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EBD9BE"/><stop offset="1" stop-color="#CDA86F"/>
    </linearGradient>
    <linearGradient id="tabla" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#B07D49"/><stop offset="1" stop-color="#8A5A2E"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bgm)"/>
  <!-- tabla de madera -->
  <ellipse cx="160" cy="120" rx="124" ry="56" fill="#6b441f" opacity=".25"/>
  <ellipse cx="160" cy="112" rx="122" ry="54" fill="url(#tabla)" stroke="#6b441f" stroke-width="3"/>
  <g stroke="#6b441f" stroke-width="1.5" opacity=".35">
    <path d="M60 92 H260 M55 112 H265 M62 132 H258"/>
  </g>
  <!-- mango de la tabla -->
  <rect x="250" y="104" width="46" height="16" rx="8" fill="url(#tabla)" stroke="#6b441f" stroke-width="3"/>
  <!-- arancino partido -->
  <circle cx="132" cy="108" r="30" fill="#E0A24B" stroke="#9c6a25" stroke-width="3"/>
  <circle cx="132" cy="108" r="16" fill="#F2C879"/>
  <g fill="#9c6a25" opacity=".5"><circle cx="120" cy="100" r="2.5"/><circle cx="142" cy="98" r="2.5"/><circle cx="126" cy="118" r="2.5"/><circle cx="144" cy="116" r="2.5"/></g>
  <!-- bowl de salsa -->
  <ellipse cx="198" cy="116" rx="26" ry="16" fill="#FBF6EC" stroke="#9c4a2d" stroke-width="3"/>
  <ellipse cx="198" cy="114" rx="18" ry="10" fill="#C5402c"/>
</svg>`)

// Frappé de café — tonos oliva/verde
export const COVER_FRAPPE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E7EDD2"/><stop offset="1" stop-color="#B6C089"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bg3)"/>
  <circle cx="250" cy="50" r="10" fill="#fff" opacity=".4"/>
  <circle cx="70" cy="40" r="6" fill="#fff" opacity=".5"/>
  <!-- vaso -->
  <path d="M128 60 H192 L184 178 H136 Z" fill="#fff" opacity=".35"/>
  <path d="M128 60 H192 L184 178 H136 Z" fill="none" stroke="#5d6638" stroke-width="3" stroke-linejoin="round"/>
  <!-- capas -->
  <path d="M133 96 H187 L184 132 H136 Z" fill="#6F4E2E"/>
  <path d="M136 132 H184 L181 168 H139 Z" fill="#A87B4C"/>
  <!-- crema -->
  <path d="M130 62 q30 -26 60 0 q-30 14 -60 0 Z" fill="#FBF6EC" stroke="#5d6638" stroke-width="2"/>
  <circle cx="160" cy="44" r="6" fill="#B83232"/>
  <!-- pajilla -->
  <rect x="168" y="20" width="8" height="60" rx="4" fill="#C5603C" transform="rotate(12 172 50)"/>
</svg>`)
