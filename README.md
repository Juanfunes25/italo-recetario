# Italo Recetario 🍦🍞🥤

Recetario digital (PWA) para producción de **Italo Gelateria**. Pensado para tablet
y teléfono, con botones grandes y uso offline en cocina.

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo en http://localhost:3200
npm run build    # versión de producción (carpeta dist/)
npm run preview  # previsualizar el build
```

Para usarlo en la tablet desde la misma red WiFi: corre `npm run dev` y abre
`http://IP-DE-TU-PC:3200` en la tablet. Luego "Agregar a pantalla de inicio".

## Cómo funciona

- **Sin backend.** Todo se guarda en el dispositivo con **IndexedDB** (recetas + fotos).
  Es persistente: no se pierde al cerrar la app ni sin internet.
- **PWA instalable + offline.** Una vez abierta, funciona sin WiFi.
- **PIN de administrador** (por defecto `1234`, cambiable en ⚙️ Ajustes).
  Los empleados ven todo en solo-lectura; solo con PIN se crea/edita/borra.
  La sesión de admin se reinicia al cerrar la app (modo seguro).

## Estructura

```
src/
├─ components/   RecipeCard, SearchBar, ImagePicker, PinModal, BottomNav…
├─ pages/        Home, CategoryList, RecipeView, RecipeEdit, CookMode, Settings
├─ context/      RecipesContext (datos), AdminContext (PIN/sesión)
├─ db/           idb.js (IndexedDB), seed.js (recetas de ejemplo)
├─ hooks/        useWakeLock (pantalla encendida en modo cocina)
├─ utils/        format.js, imageCompress.js
└─ styles/       theme.css (paleta crema/dorado/oliva/terracota)
```

## Próximos pasos fáciles de agregar (preparado para esto)

- **Sincronización con la nube:** la capa `src/db/idb.js` es el único punto de
  lectura/escritura. Basta crear un módulo que haga push/pull contra un backend.
- **Exportar a PDF:** la `RecipeView` ya tiene los datos estructurados; se puede
  generar PDF desde ahí.
- **Multi-idioma:** los textos están en español en cada componente; se pueden
  extraer a un archivo de traducciones.

## Íconos

Los íconos de la PWA se generan desde `scripts/icon-source.svg`:

```bash
node scripts/gen-icons.js
```
