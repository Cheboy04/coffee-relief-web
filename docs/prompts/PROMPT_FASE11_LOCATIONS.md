# Fase 11 — Locations (Mapa Leaflet + 2 sedes)
# Sección de cierre informativo del home — dónde encontrar Coffee Relief físicamente
# Mapa interactivo Leaflet/OpenStreetMap con marcadores personalizados · 100% open-source · sin API key

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–8 completadas y verificadas. Saltamos las fases 9–10 (pospuestas).
Avanzamos a la **Fase 11 — Locations**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto narrativo

Locations es la última sección de contenido del home antes del Footer.
El usuario ya conoce el café (OriginStory), las experiencias (ExperienceCards),
los productos (ShopCoffee) y el menú (MenuVisual). Ahora sabe cómo llegar.

No es una página de contacto. Es el **cierre físico del journey**:
después de todo lo sensorial y editorial, la marca le dice al usuario
exactamente dónde existe en el mundo real.

Coffee Relief tiene **2 sedes en Quito**. Cada una tiene su propia
identidad dentro de la marca (misma experiencia, distinta ubicación y horario).

---

## Decisión técnica: Leaflet.js + OpenStreetMap

**Por qué Leaflet:**
- Sin API key, sin billing, sin dependencia de Google
- Marcadores y estilos 100% controlables — pueden usar la paleta espresso/cream
- `npm i leaflet` + `@types/leaflet` — librería madura, ~42KB gzip
- Requiere `'use client'` y dynamic import (`next/dynamic` con `ssr: false`)
  porque Leaflet necesita `window` y `document` al montar

**Restricción crítica de Leaflet en Next.js:**
Leaflet importa CSS internamente y asume un entorno de browser.
El componente del mapa DEBE cargarse con `next/dynamic({ ssr: false })`.
El import de `leaflet/dist/leaflet.css` debe ir en el Client Component,
no en un Server Component ni en `layout.tsx`.

**Restricción de código limpio (instrucción explícita del usuario):**
- Cero código duplicado entre las dos sedes
- Solo los datos difieren entre sedes — la lógica y el markup son compartidos
- El mapa se instancia una sola vez, no uno por sede

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De Fase 6 (ExperienceCards):**
- Touch detection: lazy initializer `useState(() => matchMedia('(hover:none)').matches)`
  nunca en `useEffect`. Aplicar si hay interacción touch vs. desktop en el mapa.
- `aria-expanded` no válido en `<article>` — respetar semántica de roles ARIA.

**De Fase 3/5 (Client Components con DOM):**
- Cualquier librería que accede a `window`/`document` al importar:
  dynamic import con `{ ssr: false }` o importar dentro de `useEffect`.
- Cleanup obligatorio en `useEffect` return: Leaflet tiene `map.remove()`.
- `useRef` para la instancia del mapa — nunca estado React para objetos imperativos.

**De Fase 8 (MenuVisual):**
- Separación limpia datos/presentación: los datos de las 2 sedes viven en
  `src/data/locations.ts`, cero datos hardcodeados en componentes.
- 100% Server Component donde no haya DOM imperativo — solo el mapa es Client.

**Tailwind v4:**
- Sin `tailwind.config.ts`. Tokens nuevos en `globals.css @theme {}`/`@utility`.
- Sin valores arbitrarios `[]` en className.
- `IntersectionObserver threshold` máximo `0.1`.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 11A — Arquitectura de archivos

Lista exacta de archivos a crear/modificar. Para cada uno:
ruta, responsabilidad, Server vs. Client Component, y justificación.

Considera:
- El mapa es Client (`'use client'`) — Leaflet necesita el DOM.
- El panel de información de cada sede (nombre, dirección, horarios, CTA)
  puede ser Server Component si no tiene interacción.
- ¿Hay alguna interacción entre el panel de sedes y el mapa?
  (ej: al hacer click en una sede, el mapa centra en ese marcador)
  Si sí → ¿cómo se coordina el estado entre Server y Client?
  Define la frontera exacta.
- Los datos de las 2 sedes viven en `src/data/locations.ts`.
- `next/dynamic` se usa en el componente que importa el mapa,
  no necesariamente en el componente raíz de la sección.

Formato esperado:
```
src/components/sections/Locations/
  index.tsx           — [Server|Client] — razón
  LocationCard.tsx    — [Server|Client] — razón
  LeafletMap.tsx      — Client — razón (Leaflet + DOM)
  useLeafletMap.ts    — hook — razón
  types.ts            — tipos locales
src/data/locations.ts — datos de las 2 sedes
```

¿Cuántos archivos son realmente necesarios? Justifica cada uno.
Si algo puede colapsar sin sacrificar separación de responsabilidades, hazlo.

### SPEC 11B — Tipos y contratos

Define los tipos TypeScript completos. Sin TODOs ni `any`.

```typescript
interface LocationData {
  id: string
  name: string          // nombre de la sede — ej: "La Floresta" / "Cumbayá"
  address: string       // dirección completa
  neighborhood: string  // barrio/zona — para el eyebrow
  hours: {
    weekdays: string    // ej: "Lun–Vie · 7:00–19:00"
    weekends: string    // ej: "Sáb–Dom · 8:00–18:00"
  }
  coords: {
    lat: number
    lng: number
  }
  googleMapsUrl: string // URL para el CTA "Cómo llegar" → abre Google Maps en nueva pestaña
  // ¿algo más? ¿phone? ¿email? ¿feature especial de esa sede?
}

// Contrato del hook del mapa
function useLeafletMap(
  containerRef: RefObject<HTMLDivElement>,
  locations: LocationData[]
): {
  // ¿qué retorna? ¿flyTo(id)? ¿activeId?
  // Define la API mínima que necesitan los componentes que usan el hook
}

// Props del componente mapa
interface LeafletMapProps {
  locations: LocationData[]
  // ¿algo más?
}
```

Define también:
- ¿El mapa tiene una sede "activa" que se resalta visualmente?
  Si hay click en panel → mapa centra: ¿el estado `activeId` vive en el
  componente padre compartido, o el hook expone un `flyTo(id)` imperativo
  que el panel llama directamente?
- ¿Cómo se coordina el click del panel (puede ser Server) con el mapa (Client)?

### SPEC 11C — Datos de las 2 sedes

Propón los datos completos de ambas sedes. Para las coordenadas GPS, usa
valores plausibles para Quito (lat ≈ -0.18, lng ≈ -78.48) — el usuario
los reemplazará con los reales antes de hacer deploy.

```typescript
export const LOCATIONS: LocationData[] = [
  {
    id: 'la-floresta',          // ejemplo — definir ids reales
    name: '',                   // nombre de la sede
    address: '',                // dirección completa en Quito
    neighborhood: '',           // barrio — usado como eyebrow
    hours: {
      weekdays: '',
      weekends: '',
    },
    coords: { lat: -0.????, lng: -78.???? },
    googleMapsUrl: '',          // https://maps.google.com/...
    // ¿qué más necesita la UI?
  },
  // sede 2
]
```

Tono de copy para el nombre/barrio: coherente con la marca — conciso,
sin "sucursal" ni "local" (lenguaje de cadena). Cada sede es una experiencia
en sí misma, no una copia de la otra.

### SPEC 11D — El mapa Leaflet: configuración y estilo

Define exactamente cómo se configura el mapa:

**1. Tiles (capa base del mapa):**
OpenStreetMap tiene varios proveedores de tiles gratuitos. Los más usados:
- `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` — estilo estándar OSM
- `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` — CartoDB Positron (muy limpio, casi monocromático, encaja mejor con estética editorial)
- `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` — CartoDB Dark Matter

¿Cuál propones y por qué? Considera la paleta cream/espresso del sitio.
CartoDB Positron o una variante cálida encajan mejor que el OSM estándar.
Incluye la `attribution` correcta requerida por la licencia del tile provider.

**2. Vista inicial del mapa:**
Con 2 sedes en Quito, el mapa debe mostrar ambas al cargar.
¿Usas `fitBounds()` con las coordenadas de ambas sedes + padding,
o defines un centro/zoom fijo para Quito?
Define el zoom inicial y el padding recomendado.

**3. Marcadores personalizados:**
Leaflet usa `L.divIcon` para marcadores HTML personalizados.
Define el HTML/CSS del marcador de cada sede:
- ¿Color del marcador? (usa tokens — ej: `var(--color-primary)` para espresso)
- ¿Forma? (círculo con punto, pin clásico, ícono de café)
- ¿El marcador activo se ve diferente al inactivo?
- ¿Tamaño del hitbox (iconSize, iconAnchor)?

**4. Popup del marcador:**
Al hacer click en un marcador, ¿aparece un popup de Leaflet con información,
o la selección se refleja en el panel de la sección (fuera del mapa)?
Si es popup: define el contenido mínimo (nombre de sede, dirección).
Si no hay popup: ¿qué feedback visual da el marcador al hacer click?

**5. Interactividad:**
- ¿El mapa responde a click en el panel de sedes (fly to sede)?
- ¿El scroll del usuario dentro del mapa puede "robar" el scroll de la página?
  (Leaflet scrollWheelZoom: recomendar desactivarlo por defecto en mobile,
  o requerir Ctrl+scroll — evita que el mapa "atrape" el scroll del usuario)
- `dragging` en mobile: considera que en mobile, arrastrar el mapa compite
  con el scroll vertical. Define si se desactiva o se mantiene.

**6. Altura del mapa:**
¿Cuánto espacio vertical ocupa el mapa en desktop y mobile?
Define tokens si los valores no existen (sin `[]` arbitrarios).

### SPEC 11E — Layout y composición visual

Define la composición desktop y mobile de la sección completa:

**Desktop:**
```
¿Opción A: panel de sedes a la izquierda, mapa a la derecha?
  [sede 1 info] [                    ]
  [sede 2 info] [    mapa Leaflet    ]

¿Opción B: mapa arriba full-width, panel de sedes debajo?
  [         mapa Leaflet full-width        ]
  [sede 1 info]           [sede 2 info]

¿Opción C: mapa a la izquierda, panel a la derecha?
```

1. ¿Cuál opción encaja mejor con el ritmo visual del home?
   Considera: MenuVisual (bg-surface-low, grid de ítems) precede a Locations.
   ¿Cómo diferencia esta sección visualmente de la anterior?
2. ¿Fondo `bg-surface` o `bg-primary` (espresso oscuro) para crear contraste
   fuerte después del MenuVisual?
3. ¿`max-w-content` (1280px) o el mapa es full-bleed (100vw)?
4. ¿`py-section` (120px) como el resto, o esta sección como cierre puede
   tener padding diferente?

**Mobile:**
1. ¿El mapa va arriba o abajo del panel de sedes?
2. ¿Las 2 sedes se apilan verticalmente o hay algún selector/tab?
3. Altura del mapa en mobile.

### SPEC 11F — Panel de información de sede

Define la anatomía visual de un panel de sede:

```
[eyebrow: neighborhood — text-label-md uppercase]
[name — font-display text-headline-sm]
[address — font-sans text-body-md]
[horarios: weekdays + weekends — font-sans text-body-md]
[CTA: "Cómo llegar" → googleMapsUrl]
```

1. ¿El CTA "Cómo llegar" usa qué variante de Button?
   Considera: si el fondo de la sección es espresso (`bg-primary`),
   ¿`ghost-light` (borde blanco) o `inverse` (fondo cream)?
   Si el fondo es cream, ¿`secondary` (borde espresso)?
2. ¿Hay separador visual entre los dos paneles de sede?
3. ¿El panel de sede activa se resalta de alguna forma
   (borde, fondo distinto, tipografía más prominente)?
   ¿O los dos paneles tienen igual peso visual siempre?
4. ¿Los horarios tienen algún tratamiento especial?
   (ej: `text-secondary` para el rango de hora, `text-on-surface-variant`
   para los días)

### SPEC 11G — Accesibilidad

El mapa Leaflet es inherentemente complejo para accesibilidad.
Define el enfoque mínimo correcto:

1. **Contenedor del mapa:**
   `role="application"` + `aria-label="Mapa de ubicaciones de Coffee Relief"`
   ¿O `role="img"` con descripción alternativa en texto?
   Leaflet recomienda `role="application"` para mapas interactivos.

2. **Alternativa textual:**
   Si el mapa no carga (JS desactivado o Leaflet falla), ¿hay fallback?
   Considera: un `<noscript>` o un `<address>` con la info de las sedes.

3. **CTA "Cómo llegar":**
   Debe tener `target="_blank"` + `rel="noopener noreferrer"` +
   `aria-label="Cómo llegar a [nombre sede] (abre Google Maps en nueva pestaña)"`.

4. **Jerarquía de headings:**
   En el home: `h1` (hero) → `h2` (secciones) → `h3` (items/cards/sedes).
   ¿`h2` para "Encuéntranos" (o el título que se elija) y `h3` para cada sede?
   ¿El `h2` es visible o `sr-only`? (ShopCoffee usa h2 visible, OriginStory
   usa sr-only — ¿Locations qué encaja mejor?)

5. **Marcadores del mapa:**
   El `divIcon` de Leaflet puede recibir un `title` attribute en el HTML
   para lectores de pantalla. ¿Lo incluyes?

6. **Focus trap del mapa:**
   Leaflet puede atrapar el foco del teclado. ¿Hay algún mecanismo para
   que el usuario pueda salir del mapa con teclado (ej: tecla Escape)?

### SPEC 11H — Instalación de Leaflet

Define el proceso de instalación mínimo:

```bash
# ¿Qué instalar exactamente?
pnpm add leaflet
pnpm add -D @types/leaflet
```

1. ¿Dónde se importa el CSS de Leaflet?
   `leaflet/dist/leaflet.css` debe importarse en un Client Component.
   ¿En `LeafletMap.tsx` directamente, o en otro lugar?
   (En Next.js App Router, importar CSS en un Client Component es válido.)

2. ¿Se necesita alguna configuración adicional en `next.config` para
   que Next.js procese el CSS de Leaflet correctamente?
   Define si hay cambios en `next.config.ts` o si no son necesarios.

3. ¿Hay algún conflicto conocido entre Leaflet y Next.js 16 / React 19
   que la SPEC deba anticipar?
   Pista: el problema más común es que Leaflet intenta acceder a `window`
   al importar — se resuelve con `next/dynamic({ ssr: false })`.
   ¿Hay algún otro?

### SPEC 11I — Integración en page.tsx y Navbar

**page.tsx:**
```typescript
export default function HomePage() {
  return (
    <>
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />
      <MenuVisual />
      <Locations />      {/* Fase 11 — nueva */}
    </>
  )
}
```

¿La sección necesita `id="locations"` para anchor desde el Navbar?
Si sí, ¿actualizar `src/data/navigation.ts` con un link a `#locations`?
Considera si ya hay links de anchor en el Navbar (MenuVisual usa `#menu`).

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Arquitectura justificada: mínimo de archivos, frontera Server/Client clara
- [ ] Tipos TypeScript completos: `LocationData`, props del mapa, API del hook
- [ ] Datos plausibles de las 2 sedes con coordenadas en Quito
- [ ] Decisión justificada de tile provider (CartoDB Positron u otro)
- [ ] Configuración del mapa: bounds/zoom inicial, scrollWheelZoom, dragging mobile
- [ ] Diseño del marcador: `L.divIcon` con HTML/CSS usando tokens del design system
- [ ] Decisión popup vs. reflejo en panel, con justificación
- [ ] Layout desktop elegido (A, B o C) con justificación
- [ ] Fondo de sección definido (cream vs. espresso) con justificación
- [ ] Panel de sede: anatomía completa con variante de Button correcta
- [ ] Accesibilidad: `role="application"`, fallback noscript, aria-label en CTA
- [ ] Jerarquía de headings definida
- [ ] Instalación de Leaflet: qué instalar, dónde importar el CSS, si hay config extra
- [ ] Integración en page.tsx + decisión sobre anchor en Navbar

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1  pnpm add leaflet && pnpm add -D @types/leaflet
Paso 2  globals.css                    ← tokens nuevos si aplica (altura mapa, etc.)
Paso 3  src/data/locations.ts          ← LocationData[] con datos de las 2 sedes
Paso 4  Locations/types.ts             ← tipos del componente
Paso 5  useLeafletMap.ts               ← hook: init mapa, marcadores, flyTo, cleanup
Paso 6  LeafletMap.tsx                 ← Client: contenedor del mapa + import CSS Leaflet
Paso 7  LocationCard.tsx               ← Server (o Client si coordina con mapa): panel sede
Paso 8  Locations/index.tsx            ← compone mapa + paneles + título + fondo
Paso 9  src/app/page.tsx               ← integrar Locations
Paso 10 src/data/navigation.ts         ← anchor #locations si se decidió en 11I
```

Reglas del BUILD:
- Después de cada paso: `npx tsc --noEmit` — 0 errores antes de continuar.
- `useLeafletMap` maneja **toda** la lógica imperativa de Leaflet:
  `L.map()`, `L.tileLayer()`, `L.marker()`, `map.remove()`.
  `LeafletMap.tsx` solo provee el `ref` del contenedor y llama al hook.
  Cero duplicación — el hook es la única fuente de verdad de la instancia.
- Los datos de las 2 sedes entran al hook como `LocationData[]` —
  el hook itera sobre ellos sin conocer cuántas sedes hay.
- `map.remove()` en el return del `useEffect` del hook — sin excepción.
- El CSS de Leaflet se importa una sola vez, en `LeafletMap.tsx`.
- No crear utilidades en `globals.css` que ya existan — verificar antes.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 11 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Mapa confirmado:**
- [ ] Desktop: mapa visible con ambos marcadores de las 2 sedes
- [ ] Desktop: zoom inicial muestra las 2 sedes sin recortar
- [ ] Desktop: click en marcador → feedback definido en spec (popup o panel)
- [ ] Desktop: scroll de página no queda atrapado en el mapa
- [ ] Mobile: mapa visible, altura correcta
- [ ] Mobile: comportamiento de dragging definido en spec
- [ ] Sin errores de Leaflet en consola (window undefined, etc.)
- [ ] Marcadores con estilo del design system (no el pin azul de Leaflet por defecto)

**Panel de sedes confirmado:**
- [ ] Nombre, dirección, horarios y CTA visibles para cada sede
- [ ] CTA "Cómo llegar" abre Google Maps en nueva pestaña
- [ ] Variante de Button correcta según el fondo de la sección

**Accesibilidad:**
- [ ] Contenedor mapa con role="application" + aria-label
- [ ] Fallback noscript con info de sedes en texto
- [ ] CTA con aria-label descriptivo + rel="noopener noreferrer"
- [ ] Jerarquía de headings correcta (h2 sección → h3 por sede)
- [ ] Sin errores en axe/Lighthouse accessibility

**Performance:**
- [ ] Leaflet cargado con next/dynamic({ ssr: false }) — sin errores SSR
- [ ] CSS de Leaflet importado solo en el Client Component del mapa
- [ ] map.remove() en cleanup — sin memory leaks al navegar
- [ ] Sin valores arbitrarios [] en ningún className
- [ ] Tokens nuevos documentados en HANDOFF.md sección 6 (si aplica)
```

---

## Nota sobre coordenadas reales

Las coordenadas en `src/data/locations.ts` serán plausibles para Quito
pero **no son las reales**. Antes de hacer deploy:

```
1. Abrir Google Maps → buscar cada sede → click derecho → "¿Qué hay aquí?"
2. Copiar lat/lng exactos
3. Actualizar coords en src/data/locations.ts
4. Actualizar googleMapsUrl con la URL real de cada sede
5. pnpm build — sin cambios de código
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 11 → ✅ en la tabla de verificación (sección 14)
- Nueva entrada en §5 (arquitectura): `Locations/` en `sections/`
  y `locations.ts` en `data/`
- Nueva sección `## 12.2 Fase 11 — Locations` con la descripción de archivos,
  datos, y la nota de coordenadas pendientes
- Tokens nuevos → sección 6 (o "ninguno")
- Dependencia nueva: `leaflet` + `@types/leaflet` → tabla de stack (sección 4)
- Bugs encontrados → sección 15
- Decisiones de diseño → sección 16
- page.tsx actualizado → sección 13
- Fase siguiente → **Fase 12 — i18n (es/en con next-intl)**

---

Empieza con la SPEC completa.
Responde cada sección (11A hasta 11I) antes de escribir código.
