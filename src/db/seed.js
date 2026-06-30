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
import {
  COVER_FOCACCIA,
  COVER_ESPRESSO, COVER_AMERICANO, COVER_CAPPUCCINO, COVER_LATTE, COVER_CHAI,
  COVER_MACCHIATO, COVER_MOCHA, COVER_CHOCOLATE,
  COVER_ICE_LATTE, COVER_CHAI_HELADO, COVER_AFFOGATO, COVER_MALTEADA,
  COVER_ARANCINO, COVER_BANANA_SPLIT, COVER_CREPA, COVER_PAN,
} from './covers'
import { receta, ing, ingAg } from './seed-helpers'
import { RECETAS_PAN } from './seed-pan'

const _BASE = [
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
    minutos: 60,
    rendimiento: 1,
    unidadRendimiento: 'tanda',
    ingredientes: [
      ing('Agua', 2000, 'ml'),
      ing('Arroz risotto', 1000, 'g'),
      ing('Consomé de pollo (Maggi)', 2, 'cda'),
      ing('Consomé sazón', 1, 'cda'),
      ing('Consomé colorante', 0.5, 'cda'),
      ing('Mantequilla amarilla (¼ de barra por olla)', 0.25, 'unidad'),
      ingAg('Aceite de bacon (para la olla)'),
      ingAg('Queso parmesano Bel Gioioso (para unir el arroz)'),
      ingAg('Quesillo / mozzarella El Artesano (relleno)'),
      ingAg('Prosciutto Carando (relleno)'),
      ingAg('Empanizador 4C bread crumbs'),
    ],
    pasos: [
      'En una olla, poner el aceite del bacon y la mantequilla amarilla.',
      'Agregar el arroz risotto (1000 g) y sofreír un poco.',
      'Añadir los 2000 ml de agua con los consomés: 2 cda de pollo, 1 cda de sazón y ½ cda de colorante.',
      'Cocinar el risotto removiendo hasta que el arroz esté en su punto y absorba el líquido.',
      'Fuera del fuego, incorporar el queso parmesano para unir el arroz. Dejar enfriar.',
      'Formar bolas y rellenarlas al centro con mozzarella (quesillo) y prosciutto.',
      'Empanizar las bolas con el empanizador 4C bread crumbs.',
      'Freír (o airfryer) hasta dorar.',
      'Para servir desde refrigeración: airfryer a 160°C por 7 min. Servir partido por la mitad con su salsa en la tabla de madera.',
    ],
    notas: 'Receta de producción de Italo. El parmesano sirve para unir el arroz; el relleno es mozzarella y prosciutto.',
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
    minutos: 30,
    rendimiento: 1,
    unidadRendimiento: 'tanda',
    ingredientes: [
      ing('Harina', 600, 'g'),
      ing('Huevos', 250, 'g'),
      ing('Azúcar', 45, 'g'),
      ing('Leche', 1225, 'ml'),
      ing('Vainilla líquida', 30, 'ml'),
      ing('Mantequilla amarilla', 115, 'g'),
      ingAg('Relleno (Nutella, fruta, gelato…)'),
    ],
    pasos: [
      'Batir los huevos con el azúcar y la vainilla líquida.',
      'Agregar la harina alternando con la leche, batiendo hasta una masa líquida sin grumos.',
      'Derretir la mantequilla amarilla, incorporarla a la masa y mezclar bien.',
      'Dejar reposar la masa 15–30 min.',
      'En una plancha o sartén caliente y engrasada, verter una capa fina de masa.',
      'Cocinar ≈1 min por lado hasta dorar.',
      'Rellenar al gusto y doblar.',
    ],
    notas: 'Fórmula de producción de Italo. Una tanda rinde varias crepas.',
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

  // ============ REPOSTERÍA / PAN (del Excel Italo_Recetas_MEC3) ============
  ...RECETAS_PAN,
]

// Portada ilustrada por defecto según el tipo de receta.
// (Si la receta ya trae cover propio —gelato, focaccia— se respeta.)
const COVERS = {
  base_espresso: COVER_ESPRESSO,
  base_americano: COVER_AMERICANO,
  base_cappuccino: COVER_CAPPUCCINO,
  base_latte: COVER_LATTE,
  base_chai_caliente: COVER_CHAI,
  base_macchiato: COVER_MACCHIATO,
  base_mocha: COVER_MOCHA,
  base_chocolate_caliente: COVER_CHOCOLATE,
  base_ice_latte: COVER_ICE_LATTE,
  base_chai_helado: COVER_CHAI_HELADO,
  base_affogato: COVER_AFFOGATO,
  base_malteada: COVER_MALTEADA,
  base_arancino: COVER_ARANCINO,
  base_banana_split: COVER_BANANA_SPLIT,
  base_crepa: COVER_CREPA,
  base_pan_servicio: COVER_PAN,
}

export const RECETAS_BASE = _BASE.map((r) =>
  r.cover ? r : { ...r, cover: COVERS[r.id] || null }
)
