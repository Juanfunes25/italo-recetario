// ===========================================================
// RECETARIO BASE de Italo Gelateria.
// Recetas tomadas del "Manual de Preparación de Bebidas y Café"
// y de los productos del sistema de facturación (WizPOS).
// Los sabores de gelato los agrega Juan manualmente.
//
// Cada receta tiene un ID ESTABLE (base_*) para poder:
//  - cargarlas la primera vez,
//  - agregar nuevas en futuras versiones sin duplicar,
//  - restaurarlas si se borran por accidente.
// ===========================================================
import { COVER_GELATO, COVER_FOCACCIA, COVER_CAFE, COVER_FRAPPE, COVER_COMIDA } from './covers'

const now = Date.now()

// Constructor: rellena ids estables y campos por defecto.
function receta(id, data) {
  return {
    cover: null,
    minutos: 5,
    rendimiento: 1,
    unidadRendimiento: 'unidad',
    notas: '',
    usos: 0,
    creado: now,
    actualizado: now,
    ...data,
    id,
    ingredientes: (data.ingredientes || []).map((x, i) => ({ id: `${id}-i${i}`, ...x })),
    pasos: (data.pasos || []).map((p, i) => ({
      id: `${id}-p${i}`,
      texto: typeof p === 'string' ? p : p.texto,
      img: (typeof p === 'object' && p.img) || null,
    })),
  }
}
const ing = (nombre, cantidad, unidad) => ({ nombre, cantidad, unidad })

const _BASE = [
  // ============ HELADOS (ejemplo — los demás los agrega Juan) ============
  receta('base_gelato_vainilla', {
    nombre: 'Gelato de Vainilla',
    categoria: 'helados',
    cover: COVER_GELATO,
    minutos: 40,
    rendimiento: 5,
    unidadRendimiento: 'kg',
    ingredientes: [
      ing('Leche entera', 3, 'L'),
      ing('Crema de leche', 1, 'L'),
      ing('Azúcar', 0.9, 'kg'),
      ing('Yemas de huevo', 12, 'unidad'),
      ing('Vaina de vainilla', 2, 'unidad'),
      ing('Leche en polvo', 120, 'g'),
    ],
    pasos: [
      'Calentar la leche y la crema con la vainilla abierta hasta que empiece a humear (no hervir).',
      'Batir las yemas con el azúcar y la leche en polvo hasta que aclaren.',
      'Verter poco a poco la leche caliente sobre las yemas, revolviendo siempre para que no se cocinen.',
      'Regresar todo a la olla y cocinar a fuego bajo hasta 82°C (napa la cuchara).',
      'Enfriar rápido en baño de hielo y madurar la mezcla en frío 4 horas.',
      'Mantecar en la máquina hasta textura cremosa y llevar a congelador.',
    ],
    notas: 'Si queda muy duro al servir, sacar 5 min antes. Para más cremosidad, agregar 20 g de dextrosa al azúcar.',
  }),

  // ============ PAN ============
  receta('base_focaccia', {
    nombre: 'Focaccia Artesanal',
    categoria: 'pan',
    cover: COVER_FOCACCIA,
    minutos: 180,
    rendimiento: 2,
    unidadRendimiento: 'unidad',
    ingredientes: [
      ing('Harina de fuerza', 1, 'kg'),
      ing('Agua tibia', 700, 'ml'),
      ing('Levadura seca', 10, 'g'),
      ing('Sal', 20, 'g'),
      ing('Aceite de oliva', 80, 'ml'),
      ing('Romero fresco', 2, 'cda'),
    ],
    pasos: [
      'Mezclar harina, levadura y agua. Reposar 15 min (autólisis).',
      'Agregar la sal y la mitad del aceite. Amasar hasta masa lisa y elástica.',
      'Fermentar tapado 1.5 h hasta que doble el tamaño.',
      'Estirar en bandeja aceitada, marcar con los dedos los hoyitos típicos.',
      'Rociar aceite, sal gruesa y romero. Segunda fermentación 45 min.',
      'Hornear a 220°C por 20-25 min hasta dorar.',
    ],
    notas: 'El secreto está en la hidratación alta: la masa debe quedar pegajosa. No agregar más harina de la cuenta.',
  }),

  // ============ BEBIDAS / CAFÉ ============
  receta('base_espresso', {
    nombre: 'Espresso',
    categoria: 'bebidas',
    minutos: 3,
    ingredientes: [ing('Café molido', 9, 'g')],
    pasos: [
      'Moler 9 g de café fino para espresso.',
      'Cargar y prensar (tampar) el café en el portafiltro.',
      'Extraer hasta obtener 1 onza (≈30 ml) de espresso.',
      'Servir de inmediato en taza pequeña.',
    ],
    notas: 'Base de casi todas las bebidas de café. 9 g de café = 1 onza de extracción.',
  }),
  receta('base_americano', {
    nombre: 'Americano',
    categoria: 'bebidas',
    minutos: 4,
    ingredientes: [
      ing('Café molido', 18, 'g'),
      ing('Agua caliente', 120, 'ml'),
      ing('Agua a temperatura ambiente (al gusto)', 60, 'ml'),
    ],
    pasos: [
      'Moler 18 g de café y hacer una extracción doble (2 onzas de café).',
      'En la taza o vaso, verter primero 120 ml (5-6 oz) de agua caliente.',
      'Agregar el café extraído SOBRE el agua caliente (así no se quema).',
      'Completar con agua a temperatura ambiente hasta el volumen deseado, según el cliente.',
    ],
    notas: 'El café siempre va sobre el agua, nunca al revés, para que no se queme.',
  }),
  receta('base_cappuccino', {
    nombre: 'Cappuccino',
    categoria: 'bebidas',
    minutos: 5,
    ingredientes: [
      ing('Café molido', 18, 'g'),
      ing('Leche vaporizada', 150, 'ml'),
    ],
    pasos: [
      'Moler 18 g de café y extraer 1.5 onzas de espresso.',
      'Vaporizar 150 ml de leche hasta lograr una espuma cremosa.',
      'Verter el espresso en la taza.',
      'Agregar la leche vaporizada dejando una buena capa de espuma.',
    ],
    notas: 'Equilibrio clásico: 1/3 espresso, 1/3 leche, 1/3 espuma.',
  }),
  receta('base_latte', {
    nombre: 'Latte',
    categoria: 'bebidas',
    minutos: 5,
    ingredientes: [
      ing('Café molido', 9, 'g'),
      ing('Leche vaporizada', 200, 'ml'),
    ],
    pasos: [
      'Moler 9 g de café y extraer 1 onza de espresso.',
      'Vaporizar 200 ml de leche con poca espuma (más cremosa).',
      'Verter el espresso en el vaso.',
      'Agregar la leche vaporizada dejando una capa fina de espuma.',
    ],
    notas: 'El latte lleva más leche y menos espuma que el cappuccino.',
  }),
  receta('base_chai_caliente', {
    nombre: 'Chai Caliente',
    categoria: 'bebidas',
    minutos: 4,
    ingredientes: [
      ing('Polvo para chai', 15, 'g'),
      ing('Leche caliente', 175, 'ml'),
    ],
    pasos: [
      'Calentar o vaporizar 150–200 ml de leche, según la intensidad deseada.',
      'Disolver 15 g de polvo para chai en un poco de leche.',
      'Completar con el resto de la leche y mezclar bien.',
      'Servir caliente.',
    ],
    notas: 'Más leche = más suave. Menos leche = más intenso.',
  }),
  receta('base_chai_helado', {
    nombre: 'Chai Helado',
    categoria: 'bebidas',
    minutos: 4,
    ingredientes: [
      ing('Polvo para chai', 25, 'g'),
      ing('Leche fría', 6.5, 'oz'),
      ing('Hielo (al gusto)', 1, 'taza'),
    ],
    pasos: [
      'Disolver 25 g de polvo para chai en un poco de leche fría.',
      'Llenar un vaso con hielo.',
      'Agregar 6–7 onzas de leche fría.',
      'Incorporar el chai disuelto y mezclar bien.',
    ],
    notas: 'Lleva más polvo de chai que la versión caliente porque el hielo lo diluye.',
  }),
  receta('base_macchiato', {
    nombre: 'Macchiato',
    categoria: 'bebidas',
    minutos: 3,
    ingredientes: [
      ing('Café molido', 9, 'g'),
      ing('Leche cremada (espuma)', 1, 'oz'),
    ],
    pasos: [
      'Extraer 1 onza de espresso (9 g de café).',
      'Vaporizar leche hasta lograr una espuma densa.',
      'Coronar el espresso con 1 onza de leche cremada (sobre todo espuma).',
    ],
    notas: '"Macchiato" significa espresso "manchado" con un toque de espuma.',
  }),
  receta('base_mocha', {
    nombre: 'Mocha',
    categoria: 'bebidas',
    minutos: 5,
    ingredientes: [
      ing('Polvo para chocolate', 15, 'g'),
      ing('Café molido', 9, 'g'),
      ing('Leche vaporizada', 150, 'ml'),
    ],
    pasos: [
      'Disolver 15 g de polvo de chocolate con un poco de leche caliente en la taza.',
      'Extraer 1 onza de espresso (9 g de café) y agregar.',
      'Vaporizar 150 ml de leche y verter sobre la mezcla.',
      'Mezclar y decorar al gusto.',
    ],
    notas: 'Mezcla de espresso con chocolate y leche vaporizada.',
  }),
  receta('base_chocolate_caliente', {
    nombre: 'Chocolate Caliente',
    categoria: 'bebidas',
    minutos: 6,
    ingredientes: [
      ing('Leche', 7, 'oz'),
      ing('Cacao en polvo', 15, 'g'),
      ing('Chocolate líquido', 1, 'oz'),
    ],
    pasos: [
      'Calentar 7 onzas de leche sin que llegue a hervir.',
      'Añadir 15 g de cacao en polvo y batir hasta disolver completamente.',
      'Incorporar 1 onza de chocolate líquido y mezclar bien.',
      'Servir caliente en una taza.',
    ],
  }),
  receta('base_ice_latte', {
    nombre: 'Ice Latte',
    categoria: 'bebidas',
    minutos: 5,
    ingredientes: [
      ing('Café molido', 18, 'g'),
      ing('Leche fría', 6, 'oz'),
      ing('Hielo (al gusto)', 1, 'taza'),
      ing('Saborizante opcional (vainilla, chocolate o caramelo)', 1, 'oz'),
    ],
    pasos: [
      'Hacer una extracción doble con 18 g de café (2 onzas de café).',
      'En un vaso con hielo, verter 6 onzas de leche fría.',
      'Agregar las 2 onzas de café sobre la leche y el hielo.',
      'Preguntar al cliente si desea saborizante (vainilla, chocolate o caramelo) y añadirlo.',
      'Mezclar suavemente y servir.',
    ],
    notas: 'Saborizante opcional: 1 onza.',
  }),
  receta('base_affogato', {
    nombre: 'Affogato',
    categoria: 'bebidas',
    minutos: 3,
    ingredientes: [
      ing('Espresso', 1, 'unidad'),
      ing('Gelato (sabor a elección)', 150, 'g'),
    ],
    pasos: [
      'Colocar 150 g de gelato en una copa (se recomienda el sabor Straciatella).',
      'Extraer 1 espresso caliente.',
      'Verter el espresso sobre el gelato justo antes de servir.',
    ],
    notas: 'Se recomienda el sabor Straciatella. Servir de inmediato. En el sistema aparece como AFFOGATTO AL CAFE.',
  }),
  receta('base_malteada', {
    nombre: 'Malteada (Frullato)',
    categoria: 'bebidas',
    minutos: 5,
    ingredientes: [
      ing('Gelato', 220, 'g'),
      ing('Leche o agua (según preferencia)', 6, 'oz'),
    ],
    pasos: [
      'Colocar 220 g de gelato en el vaso de la licuadora.',
      'Añadir 6 onzas (≈180 ml) de leche o agua, según la preferencia del cliente.',
      'Licuar hasta obtener una mezcla homogénea y cremosa.',
      'Servir en vaso frío.',
    ],
    notas: 'En el sistema de facturación aparece como FRULLATO (Gelato Shake).',
  }),

  // ============ COMIDAS ============
  receta('base_arancino', {
    nombre: 'Arancino',
    categoria: 'comidas',
    minutos: 10,
    ingredientes: [
      ing('Arancino', 1, 'unidad'),
      ing('Salsa para acompañar', 1, 'unidad'),
    ],
    pasos: [
      'Sacar el arancino de la refrigeradora.',
      'Colocarlo en el airfryer a 160°C durante 7 minutos.',
      'Servir caliente, partido por la mitad, junto con su salsa en la tabla de madera.',
    ],
  }),
  receta('base_banana_split', {
    nombre: 'Banana Split',
    categoria: 'comidas',
    minutos: 8,
    ingredientes: [
      ing('Gelato (3 sabores distintos)', 250, 'g'),
      ing('Banano', 1, 'unidad'),
      ing('Toppings y salsas (al gusto)', 1, 'unidad'),
    ],
    pasos: [
      'Pelar y cortar el banano a lo largo, colocarlo en el plato alargado.',
      'Servir 250 g de gelato en 3 bolas de sabores distintos sobre el banano.',
      'Decorar con salsas, crema y toppings al gusto.',
      'Servir de inmediato.',
    ],
    notas: '250 g de gelato divididos en 3 sabores.',
  }),
  receta('base_crepa', {
    nombre: 'Crepa',
    categoria: 'comidas',
    minutos: 20,
    rendimiento: 4,
    unidadRendimiento: 'unidad',
    ingredientes: [
      ing('Harina', 100, 'g'),
      ing('Huevo', 2, 'unidad'),
      ing('Leche', 250, 'ml'),
      ing('Mantequilla derretida', 20, 'g'),
      ing('Azúcar', 1, 'cda'),
      ing('Sal', 1, 'pizca'),
      ing('Relleno (al gusto)', 1, 'unidad'),
    ],
    pasos: [
      'Mezclar la harina, los huevos, la leche, el azúcar y la sal hasta una masa líquida sin grumos.',
      'Agregar la mantequilla derretida y dejar reposar la masa 15 min.',
      'Engrasar un sartén o plancha caliente y verter una capa fina de masa.',
      'Cocinar ≈1 min por lado hasta dorar.',
      'Rellenar al gusto (Nutella, fruta, gelato) y doblar.',
    ],
    notas: '⚠️ Receta base sugerida — esta no venía en el manual. Ajusta cantidades y relleno a la preparación real de Italo.',
  }),
  receta('base_pan_servicio', {
    nombre: 'Pan caliente (servicio)',
    categoria: 'comidas',
    minutos: 5,
    ingredientes: [ing('Pan', 1, 'unidad')],
    pasos: [
      'Calentar el pan en el microondas durante 20 segundos.',
      'Pasarlo al airfryer y calentar 3 minutos, evitando que se queme.',
      'Servir caliente en la tabla de madera.',
    ],
    notas: 'Procedimiento de servicio para el pan ya horneado (no es la receta de horneado).',
  }),
]

// Portada ilustrada por defecto según el tipo de receta.
// (Si la receta ya trae cover propio —gelato, focaccia— se respeta.)
const COVERS = {
  base_espresso: COVER_CAFE,
  base_americano: COVER_CAFE,
  base_cappuccino: COVER_CAFE,
  base_latte: COVER_CAFE,
  base_chai_caliente: COVER_CAFE,
  base_macchiato: COVER_CAFE,
  base_mocha: COVER_CAFE,
  base_chocolate_caliente: COVER_CAFE,
  base_ice_latte: COVER_FRAPPE,
  base_chai_helado: COVER_FRAPPE,
  base_affogato: COVER_FRAPPE,
  base_malteada: COVER_FRAPPE,
  base_arancino: COVER_COMIDA,
  base_banana_split: COVER_COMIDA,
  base_crepa: COVER_COMIDA,
  base_pan_servicio: COVER_COMIDA,
}

export const RECETAS_BASE = _BASE.map((r) =>
  r.cover ? r : { ...r, cover: COVERS[r.id] || null }
)
