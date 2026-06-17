# Coffee Relief Web — Documento de Handoff
> Para retomar el proyecto en una sesión fresca con contexto completo.
> Última actualización: 2026-06-16 · Fases completadas: 0, 1, 2, 3, 4, 5, 6, 7, 7.1, 8, 11, 12

---

## 1. Identidad y objetivo del proyecto

**Coffee Relief** es una marca premium de café de especialidad ecuatoriano.
Características clave de la marca:
- Tostado en origen (Quito, Ecuador) — comercio directo con productores
- Cafetería física + brunch + ecommerce + experiencias de tasting
- Reconocimiento internacional: **Sprudge Awards**, **SCA** (Specialty Coffee Association)
- Audiencia dual: local (Quito) + turistas internacionales + compradores online

**El sitio web** no es una tienda básica. Es una **destination brand experience**:
editorial, sensorial, minimalista y cálida. El home es un **journey scroll-based**
que narra: taza de café → remolino → granos → funda kraft → compra.
El video hero controla esta narrativa con un scrub de scroll GSAP.

**Personalidad visual:**
- Editorial · Minimalista · Cálida · Artesanal · Sostenible
- Paleta: espresso `#26170c` · cream `#fcf9f8` · kraft `#f6f3f2` · roast `#755a34`
- Tipografía: Libre Caslon Text (display) + Hanken Grotesk (body)

---

## 2. Archivos del proyecto

| Qué | Dónde |
|---|---|
| Repositorio GitHub | https://github.com/Cheboy04/coffee-relief-web |
| Código fuente local | `C:\Projects\ClaudeCode\coffee-relief-web` |
| Directorio de trabajo (assets, docs) | `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief` |
| DESIGN.md (fuente de verdad visual) | `docs/DESIGN.md` (en el repo) |
| CLAUDE.md del proyecto | `C:\Projects\ClaudeCode\coffee-relief-web\CLAUDE.md` |

**Comandos esenciales** (ejecutar desde `C:\Projects\ClaudeCode\coffee-relief-web`):
```bash
pnpm dev          # servidor de desarrollo en localhost:3000
pnpm build        # build de producción (debe ser 0 errores)
pnpm lint         # ESLint (debe ser 0 warnings)
npx tsc --noEmit  # TypeScript check (debe ser 0 errores)
```

---

## 3. Metodología de trabajo: SDD (Specification-Driven Development)

```
SPEC  →  REVIEW  →  BUILD  →  VERIFY
```

1. **SPEC:** Claude propone tipos, contratos, API de componentes, estructura de archivos — sin escribir código
2. **REVIEW:** El usuario aprueba, corrige o rechaza la spec
3. **BUILD:** Claude implementa en el orden exacto definido en la SPEC
4. **VERIFY:** Build limpio + types + lint + screenshots

**Regla crítica:** Si durante BUILD se encuentra un problema en la spec, Claude para y notifica. No se salta SPEC→BUILD sin aprobación explícita.

---

## 4. Stack tecnológico — versiones reales instaladas

| Paquete | Versión real | Estado |
|---|---|---|
| Next.js | 16.2.7 | ✅ |
| React | 19.2.4 | ✅ |
| Tailwind CSS | v4 (config en globals.css) | ✅ |
| TypeScript | 5 strict | ✅ |
| GSAP | 3.15.0 + @gsap/react 2.1.2 | ✅ en uso (Fases 3, 5) |
| Framer Motion | 12.40.0 | ✅ (MobileMenu + ExperienceCards) |
| Zustand | 5.0.14 | pendiente |
| React Hook Form | 7.77.0 | pendiente |
| Zod | 4.4.3 | pendiente |
| next-intl | 4.13.0 | ✅ en uso (Fase 12) |
| leaflet | 1.9.4 | ✅ (Fase 11) |
| @types/leaflet | 1.9.21 | ✅ (Fase 11, dev) |

### Tailwind v4 — regla crítica

**No existe `tailwind.config.ts`**. Todo el design system vive en `src/app/globals.css`:
- `@theme {}` — tokens (colores, spacing, tipografía, animaciones)
- `@utility` — clases compuestas
- Sin valores arbitrarios `[]` en className — si no existe el token, se crea en globals.css

---

## 5. Arquitectura del proyecto

```
src/
  app/
    [[...locale]]/      ← catch-all opcional i18n — / (en) y /es (Fase 12)
      layout.tsx        ← root layout: fuentes, Navbar, Footer, NextIntlClientProvider, skip nav
      page.tsx          ← home page (todas las secciones) + getTranslations para HeroScroll
    globals.css         ← TODA la config Tailwind v4 + base styles + tokens
  i18n/
    routing.ts          ← defineRouting: locales ['en','es'], defaultLocale 'en', localePrefix 'as-needed'
    request.ts          ← getRequestConfig: carga messages/[locale].json
    navigation.ts       ← createNavigation(routing): Link, useRouter, usePathname, redirect
  components/
    layout/
      Navbar/           ← index.tsx (Server) + NavLinks.tsx (Server) + MobileMenu.tsx (Client) + LanguageSwitcher.tsx (Client)
      Footer/           ← index.tsx (Server) + FooterLinks.tsx (Server) + icons.tsx
      types.ts          ← NavLinkItem, NavbarProps, FooterProps, etc.
      index.ts          ← barrel
    sections/
      HeroScroll/       ← Fase 3 (ver §8)
      TrustBar/         ← Fase 4 (ver §9)
      OriginStory/      ← Fase 5 (ver §10)
      ExperienceCards/  ← Fase 6 (ver §11)
      ShopCoffee/       ← Fase 7 (ver §12)
      Locations/        ← Fase 11 (ver §12.2)
      index.ts          ← barrel: HeroScroll, TrustBar, OriginStory, ExperienceCards, ShopCoffee, MenuVisual
    ui/
      Button.tsx        ← Client — 6 variantes, 3 tamaños, polimórfico a/button
      SectionTitle.tsx  ← Server — h1-h4, 3 tamaños, eyebrow, alineación, id opcional
  data/
    locations.ts        ← LOCATIONS: LocationData[] (sin neighborhood/label — en messages)
    navigation.ts       ← NAV_LINKS (sin labels — ahora en messages/[locale].json nav namespace)
    experienceCards.ts  ← EXPERIENCE_CARDS: ExperienceCardData[] (sin texto — en messages)
    originStory.ts      ← ORIGIN_BEATS: BeatConfig[] (sin texto — en messages)
    products.ts         ← PRODUCTS: Product[] (3 productos — imageAlt/flavorNotes vienen de messages)
  lib/utils/cn.ts       ← clsx + twMerge helper
  types/index.ts        ← Product, ProductSize, Review, Location, Award

messages/
  en.json               ← todas las cadenas EN (nav, hero, shop, quiz, menu, locations, etc.)
  es.json               ← todas las cadenas ES

middleware.ts           ← next-intl middleware (raíz del proyecto)

public/
  frames/               ← hero canvas scrub (161 frames WebP, frame_000000.webp)
  images/
    hero/
      hero-poster.webp  ← placeholder del hero (usado en HeroCanvas + HeroVideo)
    experience/
      cafeteria.webp    ← ExperienceCards (imágenes reales, ratio portrait)
      tienda.webp
      tasting.webp
      brunch.webp
    origin/
      beat-1-origen/    ← frames canvas OriginStory (60 frames/beat, frame_000000.webp)
      beat-2-seleccion/
      beat-3-tueste/    ← carpeta vacía — frames pendientes de entrega
      beat-4-comercio/  ← carpeta vacía — frames pendientes de entrega
    products/           ← ⏳ pendiente — imágenes de ProductCard (ver §12 nomenclatura)
  video/
    hero.mp4            ← loop mobile (se mantiene)
    .gitkeep
```

---

## 6. Design System — tokens en globals.css

### Colores frecuentes
```
bg-surface              #fcf9f8  ← fondo principal cream
bg-surface-low          #f6f3f2  ← kraft, TrustBar, cards
bg-primary              #26170c  ← espresso (footer, botones primarios)
bg-primary-container    #3d2b1f  ← placeholder Beat 1 / ProductCard Valle del Chota
bg-secondary-container  #fdd7a7  ← placeholder Beat 3 / ProductCard Valle del Chota imagen
bg-tertiary-container   #2f2f2c  ← placeholder Beat 4 / ProductCard Zamora Kraft
text-on-surface         #1c1b1b
text-on-surface-variant #4f453f
text-secondary          #755a34  ← roast (acentos, eyebrows)
```

### Tipografía (utilities @utility)
```
text-display-lg       64px / 72px / -0.02em / 400
text-display-lg-mob   40px / 48px / -0.01em / 400
text-headline-md      32px / 40px / 400
text-headline-sm      24px / 32px / 400
text-body-lg          18px / 28px / 400
text-body-md          16px / 24px / 400
text-label-md         14px / 20px / +0.05em / 600  ← siempre uppercase en labels
text-caption          12px / 16px / 400

font-display → Libre Caslon Text  (solo headings, nunca body)
font-sans    → Hanken Grotesk
```

### Espaciado y layout
```
py-section      120px  ← gap entre secciones del home (nunca menos)
px-5 / px-16    20px / 64px  ← margin mobile / desktop
max-w-content   1280px  ← contenedor máximo
max-w-prose     ~680px  ← columnas de texto
```

### Utilities de secciones
```
h-locations-map       520px  ← altura mapa desktop — Locations
h-locations-map-mob   320px  ← altura mapa mobile — Locations
cr-marker-wrap        24×24px  ← contenedor divIcon Leaflet
cr-marker-dot         12px dot espresso — marcador inactivo
cr-marker-dot-active  16px dot + ring secondary/40 — marcador activo
h-experience-card     520px  ← altura card desktop — ExperienceCards
h-experience-card-mob 420px  ← altura card mobile — ExperienceCards
h-beat-track-mob  150vh  ← scroll track por beat (mobile) — OriginStory
h-beat-track      200vh  ← scroll track por beat (desktop) — OriginStory
h-beat-canvas-mob 56vw   ← altura canvas en mobile — OriginStory
w-canvas-col      55%    ← columna canvas (desktop) — OriginStory
w-text-col        45%    ← columna texto (desktop) — OriginStory
h-navbar          var(--navbar-height)  ← 60px mobile / 72px desktop
z-video           5
z-raised          10
z-dropdown        20   ← HeroTransition morph layer
z-sticky          30   ← Navbar
aspect-product    ratio para funda kraft y card preview en HeroTransition
aspect-menu-item  4/3 — fotografía de menú (paisaje) — MenuItemCard
```

### Animaciones
```css
--animate-fade-up:      fade-up 0.6s cubic-bezier(0.19,1,0.22,1) both
--animate-fade-in:      fade-in 0.4s ease both
--animate-trust-scroll: trust-scroll 30s linear infinite
--animate-hint-pulse:   hint-pulse 2s ease-in-out 3   ← badge tap ExperienceCards

@keyframes trust-scroll { to { transform: translateX(calc(-100% / 3)); } }
@keyframes hint-pulse { 50% { opacity: 0.45; transform: scale(0.88); } }
```

### Utilities flip 3D — ExperienceCards
```
card-wrapper      perspective: 1200px
card-inner        transform-style:preserve-3d + transition 450ms  ← NO overflow:hidden aquí
card-face         absolute inset-0 + backface-visibility:hidden + overflow:hidden + rounded-lg
card-back-face    rotateY(180deg)
card-front-overlay gradiente espresso ascendente
```

### Variantes Button
```
primary      bg-espresso, text-cream
secondary    border espresso, text-espresso
ghost        text-espresso, hover:bg-surface-low
ghost-light  border white/40, text-white, hover:bg-white/10
inverse      bg-surface, text-primary
link         text-secondary underline
```

### Variables CSS runtime
```css
--navbar-height: 60px (mobile) / 72px (desktop)
--navbar-fg-color: var(--color-on-surface)  ← HeroScroll lo overridea a white
```

---

## 7. Navbar y Footer — reglas críticas

1. **Navbar transparente en hero, frosted glass post-hero** — nunca `bg-surface` sólido
2. **`--navbar-fg-color`** — color de texto via CSS variable; HeroScroll lo cambia con IntersectionObserver
3. **`html.navbar-scrolled`** — clase que activa el frosted glass; gestionada por el IO de HeroScroll
4. **Frosted glass**: `backdrop-blur(12px) saturate(1.2) + bg-surface/78` con transición 350ms ease
5. **Z-index Navbar: `z-sticky` (30)** — el hero usa z-index menores
6. **Sin `pt-navbar` en `<main>`** — el hero es full-bleed; páginas interiores lo agregan ellas mismas
7. **MobileMenu.tsx** es el único Client Component del Navbar

---

## 8. Fase 3 — HeroScroll

**Ruta:** `src/components/sections/HeroScroll/`

```
index.tsx           ← orchestrador, detecta modo (scrub/loop/static)
HeroCanvas.tsx      ← canvas frame sequence (Client)
HeroVideo.tsx       ← video fallback legacy (Client)
HeroOverlay.tsx     ← texto + CTA overlay (Client)
HeroTransition.tsx  ← morph funda→card completado en Fase 7 (ver §12)
useHeroScrub.ts     ← GSAP timeline + ScrollTrigger (morph 0.88→1.0 ya implementado)
useHeroMode.ts      ← detecta scrub/loop/static según device
useHeroTransition.ts← estado derivado puro: active (≥0.9) + settled (≥0.97)
messages.ts         ← 3 beats de texto del overlay
types.ts
```

**3 modos de operación:**
- `scrub` — desktop con motion: canvas frame sequence + morph GSAP
- `loop` — mobile: video autoplay muted loop (sin morph)
- `static` — reduced-motion / saveData / no-JS: solo poster PNG

**Assets:**
- `/public/frames/frame_000000.webp` ... `frame_000160.webp` — 161 frames WebP (canvas mode)
- `/public/video/hero.mp4` — video loop mobile
- `/public/images/hero/hero-poster.webp` — poster WebP (usado en HeroCanvas + HeroVideo)

**Navbar integration:**
```typescript
// IntersectionObserver threshold: 0 (no 0.5)
// Al entrar: '--navbar-fg-color' → 'white'
// Al salir:  '--navbar-fg-color' → 'var(--color-on-surface)'
```

**Morph funda → card (useHeroScrub, líneas 82-90):**
```typescript
tl.to(bag,    { opacity: 1, duration: 0.02 },                                  0.88)
tl.fromTo(bag, { scale: 1 }, { scale: 0.5, ease: 'power2.inOut', duration: 0.08 }, 0.9)
tl.to(video ?? bag, { opacity: 0, duration: 0.04 },                            0.92)
tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.04 },             0.95)
tl.to(bag,    { opacity: 0, duration: 0.02 },                                  0.98)
```

**Bugs corregidos en Fase 3:**
- `threshold: 0.5` → `threshold: 0`
- Poster z-index `z-raised` → `z-video`
- GSAP `scrub: 1` → `scrub: 0.3`

---

## 9. Fase 4 — TrustBar

**Ruta:** `src/components/sections/TrustBar/`

**Patrón marquee — lección crítica:**
- ❌ `flex w-max` — computa ancho incorrecto dentro de `overflow:hidden`
- ✅ `inline-flex` + **3 copias** + `calc(-100% / 3)` + `pr-12` (gap cierre)

---

## 10. Fase 5 — OriginStory

**Ruta:** `src/components/sections/OriginStory/`

Canvas frame scrub — mismo patrón del HeroScroll. 4 beats × 60 frames WebP.

**Naming assets:**
```
public/images/origin/beat-N-nombre/frame_000000.webp   ← 0-indexed, 6 dígitos, guion bajo
```

**Todos los beats tienen frames reales:** 60 frames WebP × 4 beats (beat-3-tueste y beat-4-comercio confirmados 2026-06-12).

**Patrón framesRef** — ScrollTrigger con deps `[]` vacías; framesRef actualizado por useEffect separado para evitar re-registro.

---

## 11. Fase 6 — ExperienceCards

**Ruta:** `src/components/sections/ExperienceCards/`

Flip cards CSS 3D × 4 experiencias. Imágenes reales en `public/images/experience/`.

**`imageSrc?: string`** en ExperienceCardData — opcional: si existe muestra `<Image>`, si no muestra placeholder de color. Las 4 cards tienen imagen real.

**Mecánica de flip:**
- Desktop: hover → flip / unhover → unflip
- Mobile: onClick toggle. Touch detection via lazy initializer `useState(() => matchMedia('(hover: none)').matches)`

**Regla CSS 3D:** `overflow:hidden` va en `card-face`, nunca en `card-inner` (rompe `transform-style:preserve-3d`).

---

## 12. Fase 7 — ShopCoffee + ProductCard + CoffeeQuiz + HeroTransition

**Ruta:** `src/components/sections/ShopCoffee/`

```
index.tsx                  ← Server — section#shop, SectionTitle "Nuestro café", CTA /tienda
ProductGrid.tsx            ← Server — grid 1/1/3 cols (mobile/tablet/desktop)
ProductCard/
  index.tsx                ← Client — selectedSizeId, added state, CTA temporal
  SizeSelector.tsx         ← Client — fieldset+legend+radio pills
  types.ts
CoffeeQuiz/
  index.tsx                ← Client — wizard: currentStep, answers, result + highlight
  QuizQuestion.tsx         ← Client — fieldset+legend+radio opciones estilizadas
  useQuizLogic.ts          ← hook puro: scoring por puntos, recomendación, reset
  questions.ts             ← QUIZ_QUESTIONS: 3 preguntas
  types.ts                 ← QuizQuestion, QuizOption, QuizResult, IntensityKey
types.ts
```

### Los 3 productos (`src/data/products.ts`) — catálogo real

| id | name | sku | intensity | roastLevel | origin | flavorNotes | precio |
|---|---|---|---|---|---|---|---|
| `bold` | Bold Relief | CR-US-1LB-B-2026 | intenso | medium-dark | Zamora Chinchipe | Chocolate · Dulzura estructurada · Cuerpo pleno | $36.50 / 1 lb |
| `tropical` | Tropical Relief | CR-US-1LB-T-2026 | suave | medium | Valle del Chota, Carchi | Floral · Cítrico · Acidez brillante | $36.50 / 1 lb |
| `immersive` | Immersive Relief | CR-US-1LB-I-2026 | medio | medium | Nanegal, Pichincha | Suave · Balanceado · Dulzura accesible | $36.50 / 1 lb |

**Imágenes reales recibidas:**
```
public/images/products/bold.webp       ← ~1075×1463px, ratio 3:4
public/images/products/tropical.webp   ← ~1075×1463px, ratio 3:4
public/images/products/immersive.webp  ← ~1104×1424px, ratio 3:4
```

**Bundles pendientes para `/tienda`** (fuera de alcance del home):
- Origin Collection
- Roaster Selection (2.2 lb)
- Roaster's Bulk (5 lb)

Estos 3 bundles sí tendrán variantes de tamaño/precio — `sizes: ProductSize[]` sigue siendo la estructura correcta.

### ProductCard
- **Sin SizeSelector** — precio fijo $36.50 / 1 lb. `SizeSelector.tsx` eliminado (Fase 7.1).
- Precio: texto estático `$36.50 / 1 lb` — sin `aria-live` (precio no cambia).
- CTA: estado local `added` → "Agregar" → "Agregado ✓" → revierte tras 2s vía `setTimeout`. Sin carrito (Zustand pendiente).
- `data-product-id={product.id}` — usado por CoffeeQuiz para el highlight.
- `data-hero-target="first"` — en `isFirst` card, hook semántico para futura integración.

### CoffeeQuiz — algoritmo de scoring

Cada opción suma puntos a `{ suave, medio, intenso }`. Al final de 3 preguntas, la intensidad con mayor total determina el producto. **Empate → `medio` (Immersive Relief) siempre gana.**

```
intensidad ganadora → producto:
  suave   → tropical   (Tropical Relief)
  medio   → immersive  (Immersive Relief)
  intenso → bold       (Bold Relief)
```

**Preguntas:**
1. ¿Cuándo sueles tomar tu café? (4 opciones)
2. ¿Qué buscas en una taza? (3 opciones)
3. ¿Cómo preparas tu café en casa? (4 opciones)

**Resultado:**
- Texto: "Tu café es [nombre]" + mensaje personalizado por producto
- Scroll: `scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })`
- Highlight: añade `ring-2 ring-primary ring-offset-2` al `[data-product-id]` durante 3s, luego la remueve
- Reset: botón "Volver a intentar" → estado inicial

**Accesibilidad:** cada pregunta en `<fieldset>/<legend>`, resultado en `<div role="status" aria-live="polite">`.

### HeroTransition completado

`targetRef` muestra datos reales del primer producto al `settled` (progress ≥ 0.97):
- Fondo: `product.placeholderColor`
- Gradiente de legibilidad encima
- Contenido (visible con `transition-opacity` al settled): origin label + name display + "Desde $X"

`HeroScroll/index.tsx` importa `PRODUCTS[0]` de `src/data/products.ts` y lo pasa a `HeroTransition` en modo `scrub`. Modos `loop` y `static` no renderizan `HeroTransition`.

**Coordinación HeroScroll ↔ ShopCoffee:** no hay posicionamiento físico compartido. El morph es visual dentro del hero. ShopCoffee es independiente y renderiza `PRODUCTS` directamente. El conexto narrativo lo da el copy y la transición visual.

### CTA "See full catalogue"
`Button href="#shop" variant="secondary"` — apunta al ancla de la misma sección mientras `/tienda` no existe. Cambiar a `/tienda` cuando se construya el catálogo completo.

---

## 12.1 Fase 8 — MenuVisual

**Ruta:** `src/components/sections/MenuVisual/`

```
index.tsx                ← Server — section#menu + SectionTitle + categorías + CTA
MenuCategorySection.tsx  ← Server — h3 + grid de cards por categoría
MenuItemCard.tsx         ← Server — imagen/placeholder + nombre + descripción + precio + tag
types.ts                 ← MenuCategory, MenuItem, MenuItemTag
```

**Datos:** `src/data/menu.ts` — 3 categorías + 11 ítems.

```
Cafés de especialidad (La taza)   — 4 ítems — grid 2 cols
Brunch              (La mesa)     — 4 ítems — grid 2 cols
Bebidas frías       (La pausa)    — 3 ítems — grid 3 cols (lg)
```

**Tags:**
- `signature` → `bg-primary-container` + `text-on-primary-container` (espresso/cream)
- `vegano` → `bg-secondary-container` + `text-on-secondary-container` (arena/marrón)
- `sin-gluten` → `bg-surface-high` + `text-on-surface-variant` (gris/grafito)

**Animación de entrada:** CSS `animate-fade-up` con `animation-delay` inline × 80ms por ítem. Stagger reiniciado por categoría. 100% Server Component — cero JS para la sección.

**Fondo:** `bg-surface-low` — alterna con ShopCoffee (`bg-surface`).

**CTA:** `Button href="#reservas" variant="secondary"` — anchor pendiente (sin sistema de reservas aún).

**Navbar:** links anclados al home: `#menu`, `#shop`, `#locations`. `origin` (`/about`) y `blog` (`/blog`) mantienen rutas futuras.

**Imágenes del menú:** ✅ 11/11 recibidas y activas (`/public/images/menu/`)

---

## 12.2 Fase 11 — Locations

**Ruta:** `src/components/sections/Locations/`

```
index.tsx              ← Server — section#locations, heading "Encuéntranos", pasa LOCATIONS a LocationsClient
LocationsClient.tsx    ← Client — activeId state, lazy-loads LeafletMap via next/dynamic ssr:false
LocationCard.tsx       ← Client — panel de sede: eyebrow, h3, address, horarios, CTA ghost-light
LeafletMap.tsx         ← Client — div ref + useLeafletMap hook + import 'leaflet/dist/leaflet.css'
useLeafletMap.ts       ← Hook — toda lógica Leaflet: L.map(), CartoDB tiles, L.divIcon, flyTo, cleanup
types.ts               ← LocationData, LeafletMapProps, LocationCardProps, UseLeafletMapReturn
```

**Datos:** `src/data/locations.ts` — 2 sedes con datos y coordenadas reales ✅

| campo | La Whymper | Tumbaco |
|---|---|---|
| `id` | `la-whymper` | `tumbaco` |
| `name` | La Whymper | Tumbaco |
| `address` | Whymper 269, Quito 170517 | C. Boyacá y Pje. Santa Rosa 4-01, Quito 170902 |
| `neighborhood` | La Whymper · cerca a La Floresta | La Morita · Tumbaco |
| `coords` | `{ lat: -0.1989775, lng: -78.4816834 }` | `{ lat: -0.2130695, lng: -78.3909015 }` |
| `googleMapsUrl` | `maps.google.com/?q=-0.1989775,-78.4816834` | `maps.google.com/?q=-0.2130695,-78.3909015` |

**Horarios — tipo `LocationHours[]`** (array de filas `{ hoursKey, time }` — soporta horarios partidos, texto en messages):

```
La Whymper:
  { hoursKey: 'monFri',   time: '8:30–20:00' }
  { hoursKey: 'saturday', time: '9:30–14:00 · 15:00–19:00' }
  { hoursKey: 'sunday',   time: '10:00–13:00 · 14:00–19:00' }

Tumbaco:
  { hoursKey: 'monFri', time: '8:00–13:00 · 15:00–20:00' }
  { hoursKey: 'satSun', time: '8:30–13:00 · 15:00–20:00' }
```
Claves de días en `messages/[locale].json` → `locations.days.{monFri|saturday|sunday|satSun}`

`neighborhood` removido de `LocationData` — ahora en `messages.[locale].locations.venues.{id}.neighborhood`

**Bug resuelto post-build:** "Map container is already initialized" en dev (React StrictMode monta/desmonta/remonta). Fix: flag `isMounted` sincrónico en `useLeafletMap.ts` — la cleanup lo pone en `false` antes de que el primer `await import('leaflet')` resuelva en el segundo mount.

**Mapa:**
- Tile: CartoDB Positron (`light_all`) — monocromático, encaja con paleta cream/espresso
- Vista inicial: `map.fitBounds()` con `padding: [60, 60]` — muestra ambas sedes sin recortar
- Marcadores: `L.divIcon` custom — dot espresso 12px / 16px activo con ring secondary/40
- Sin popup — click en marcador → `onMarkerClick(id)` → `setActiveId` → card se resalta + `flyTo`
- `scrollWheelZoom: false` — nunca atrapa el scroll de página

**Layout:** `bg-primary` (espresso), panel 2/5 izquierda · mapa 3/5 derecha (desktop); mapa arriba · cards abajo (mobile).

**Interacción:** click en card o marcador → `activeId` cambia → card recibe `border-l-secondary` + mapa hace `flyTo(coords, zoom:15)`.

**Accesibilidad:**
- `role="application"` + `aria-label` en el contenedor del mapa
- `<noscript>` con `<address>` de cada sede
- CTA con `target="_blank"` + `rel="noopener noreferrer"` + `aria-label` descriptivo
- `h2` visible "Encuéntranos" · `h3` por cada sede

---

## 12.3 Fase 12 — i18n (next-intl v4)

**Arquitectura:**
- `localePrefix: 'as-needed'` — EN sin prefijo (`/`), ES con prefijo (`/es`)
- Middleware reescribe todas las rutas a `[locale]` internamente
- SSG: `generateStaticParams` en layout Y page → pre-genera `/en` y `/es`
- `setRequestLocale(locale)` en layout Y page → SSG mantenido con Server Components async

**Archivos nuevos:**
```
src/i18n/routing.ts      ← defineRouting({ locales: ['en','es'], defaultLocale: 'en', localePrefix: 'as-needed' })
src/i18n/request.ts      ← getRequestConfig: carga messages/[locale].json
src/i18n/navigation.ts   ← createNavigation(routing): Link, useRouter, usePathname, redirect
middleware.ts             ← next-intl middleware (raíz del proyecto)
messages/en.json          ← todas las cadenas EN
messages/es.json          ← todas las cadenas ES
src/app/[[...locale]]/layout.tsx  ← root layout con NextIntlClientProvider (catch-all opcional)
src/app/[[...locale]]/page.tsx    ← home page async con getTranslations('hero')
```

**⚠️ Trampa crítica — `[[...locale]]` vs `[locale]`:**
```
localePrefix: 'as-needed' + [locale]         → / da 404 ← INCORRECTO
localePrefix: 'as-needed' + [[...locale]]    → / funciona ← CORRECTO
localePrefix: 'always'    + [locale]         → / redirige a /en ← alternativa válida
```
Con `[[...locale]]`, params es `{ locale?: string[] }`:
- `/`  → `locale = undefined` → `locale = defaultLocale = 'en'`
- `/es` → `locale = ['es']` → `locale = 'es'`

`generateStaticParams`: `[{ locale: [] }, { locale: ['es'] }]`

```
src/components/layout/LanguageSwitcher.tsx  ← EN | ES via router.replace(pathname, { locale })
```

**Patrón Server Component:**
```typescript
const t = await getTranslations('namespace')   // getTranslations de 'next-intl/server'
```

**Patrón Client Component:**
```typescript
const t = useTranslations('namespace')          // useTranslations de 'next-intl'
```

**Patrón HeroScroll (Client que necesita texto traducido):**
```typescript
// page.tsx (Server) construye overlayMessages y los pasa como prop
const overlayMessages = OVERLAY_STRUCTURE.map((s, i) => ({ ...s, headline: t(...), subline: t(...) }))
<HeroScroll overlayMessages={overlayMessages} ariaLabel={t('ariaLabel')} />
```

**Namespaces de mensajes:**
| namespace | secciones |
|---|---|
| `meta` | título, description |
| `nav` | links, CTA, aria-labels, skip-to-content |
| `footer` | tagline, copyright, grupos, legal, social |
| `hero` | ariaLabel + 3 beats (headline/subline/cta) |
| `trustBar` | 5 items (volcanic/producer/roasted/shipping/eco) |
| `originStory` | sectionLabel + 4 beats (eyebrow/headline/body/imageAlt) |
| `experienceCards` | sectionLabel + 4 cards (title/eyebrow/summary/imageAlt/ctaFront/ctaBack) |
| `shop` | heading/eyebrow/cta/addCta/addedCta + 3 productos (intensity/origin/flavorNotes/description/imageAlt) |
| `quiz` | eyebrow/heading/step/back/next/recommend/retry/resultLabel + 3q + 3 results |
| `menu` | eyebrow/heading/cta + 3 categorías + 11 ítems + 3 tags |
| `locations` | eyebrow/heading/hoursLabel/directionsLabel + days + 2 venues neighborhoods |
| `common` | openInNewTab |

**Regla TypeScript para claves dinámicas:**
```typescript
// ✅ Tipo literal union para satisfacer next-intl key inference
t(`products.${p.id as 'bold' | 'tropical' | 'immersive'}.imageAlt`)

// ✅ Para arrays de claves explícitas
const quizText = { q1: { question: t('q1.question'), options: { manana: t('q1.options.manana'), ... } } }
```

---

## 13. page.tsx — estado actual (`src/app/[locale]/page.tsx`)

```tsx
// Server Component — async — recibe params.locale
// Llama getTranslations('hero'), construye overlayMessages, pasa a HeroScroll como prop
export default async function HomePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('hero')
  // overlayMessages: OverlayMessage[] mergeado de OVERLAY_STRUCTURE + traducciones
  return (
    <>
      <HeroScroll overlayMessages={overlayMessages} ariaLabel={t('ariaLabel')} />
      <TrustBar />             {/* Server async — getTranslations('trustBar') */}
      <OriginStory />          {/* Server async — getTranslations('originStory') */}
      <ExperienceCards />      {/* Server async — getTranslations('experienceCards') */}
      <ShopCoffee />           {/* Server async — getTranslations('shop') */}
      <MenuVisual />           {/* Server async — getTranslations('menu') */}
      <Locations />            {/* Server async — getTranslations('locations') */}
    </>
  )
}
```

---

## 14. Estado de verificación

| Fase | Componente | Estado | Build | Types | Lint |
|---|---|---|---|---|---|
| 0 | Setup + estructura | ✅ | ✓ | ✓ | ✓ |
| 1 | Design tokens + Button + SectionTitle | ✅ | ✓ | ✓ | ✓ |
| 2 | Navbar + Footer | ✅ | ✓ | ✓ | ✓ |
| 3 | HeroScroll (canvas frame sequence) | ✅ | ✓ | ✓ | ✓ |
| 4 | TrustBar (marquee infinito) | ✅ | ✓ | ✓ | ✓ |
| 5 | OriginStory (canvas frame scrub × 4 beats) | ✅ | ✓ | ✓ | ✓ |
| 6 | ExperienceCards (flip cards + imágenes reales) | ✅ | ✓ | ✓ | ✓ |
| 7 | ShopCoffee + ProductCard + CoffeeQuiz + HeroTransition | ✅ | ✓ | ✓ | ✓ |
| 7.1 | Catálogo real (Bold / Tropical / Immersive) + imágenes | ✅ | ✓ | ✓ | ✓ |
| 8 | MenuVisual (3 categorías · 11 ítems · 100% Server) | ✅ | ✓ | ✓ | ✓ |
| 11 | Locations (Leaflet · 2 sedes · mapa CartoDB · flyTo) | ✅ | ✓ | ✓ | ✓ |
| 12 | i18n (next-intl v4 · en/es · SSG · [locale] segment) | ✅ | ✓ | ✓ | ✓ |

---

## 15. Bugs encontrados y resueltos

| Bug | Causa | Resolución |
|---|---|---|
| Hero IntersectionObserver nunca disparaba | threshold: 0.5 en sección 300vh | threshold: 0 |
| Poster del hero tapando texto overlay | z-raised (10) = z-index del overlay | Cambiado a z-video (5) |
| Video scrub con lag excesivo | scrub: 1 | Cambiado a scrub: 0.3 |
| TrustBar no era infinita | `flex w-max` computa ancho incorrecto | `inline-flex` + 3 copias + `calc(-100% / 3)` |
| `setIsTouch` en `useEffect` violaba ESLint | setState síncrono en body de effect | Lazy initializer en `useState` |
| `aria-expanded` en `<article>` | El rol implícito article no soporta aria-expanded | Eliminado — usar `aria-hidden` en hijos |
| ScrollTrigger re-registraba en loop | `frames` como dependencia directa | Patrón `framesRef` + deps `[]` vacías |
| Canvas sin resolución al resize | `canvas.width/height` no se actualizaban | `ResizeObserver` en useCanvasScrub |
| `prefers-reduced-motion` mostraba frame 0 | `progressRef.current = 0` en modo reducido | `Math.floor(frameCount / 2)` |
| Frames cargándose en data-saver mode | Sin guard `saveData` en CanvasScrub | Guard antes del IntersectionObserver |
| Canvas vacío sin JavaScript | `<canvas>` sin contenido sin JS | `style={{ backgroundColor }}` + `<noscript>` |
| OriginStory imágenes 400 | data.ts usaba `.jpg`, archivos son `.jpeg` | data.ts actualizado a `.jpeg` |
| HeroTransition no mostraba imagen del producto | `targetRef` slot solo usaba `placeholderColor` — `<Image>` nunca se añadió al componente | Añadido `<Image fill object-cover>` condicional en `HeroTransition.tsx`, mismo patrón que `ProductCard` |
| Leaflet "Map container is already initialized" | React StrictMode monta/desmonta/remonta: la cleanup corre cuando `mapRef` es null (async no resuelto), así el segundo mount también entra al bloque de init | Flag `isMounted` sincrónico en `useLeafletMap.ts` — cleanup lo pone en `false` antes de que el primer `await import('leaflet')` resuelva |
| `tap` no existe en `MapOptions` de @types/leaflet 1.9 | La opción `tap` fue eliminada en Leaflet 1.9+ | Removida del objeto de opciones del mapa |

---

## 16. Decisiones de diseño — no revertir sin consultar

1. **Navbar siempre transparente** — nunca bg-surface ni color de fondo
2. **`--navbar-fg-color` CSS variable** — color texto navbar via CSS var
3. **Z-index Navbar: z-sticky (30)** — hero usa z-index menores
4. **Sin `pt-navbar` en `<main>`** — hero full-bleed
5. **`font-display` solo en headings** — nunca en body ni labels
6. **`text-label-md uppercase`** en todos los labels, chips, eyebrows
7. **`py-section` (120px)** entre secciones — nunca menos
8. **Sin valores arbitrarios `[]`** — agregar @utility a globals.css
9. **GSAP dynamic import** — siempre `await import('gsap')` dentro de useEffect
10. **CSS `scale` (no `transform: scale`)** — en elementos que también anima GSAP
11. **Canvas frame scrub en OriginStory** — coherencia visual con el hero
12. **`framesRef` pattern en useCanvasScrub** — deps `[]` vacías, ref actualizado por useEffect separado
13. **Frame naming: `frame_000000.webp`** — guion bajo, 6 dígitos, 0-indexado, WebP
14. **`saveData` guard** — no cargar frames/assets pesados si saveData activo
15. **Touch detection: lazy initializer** — `useState(() => matchMedia('(hover: none)').matches)` nunca en useEffect
16. **Flip card CSS 3D** — `overflow:hidden` en `card-face`, nunca en `card-inner`
17. **`aria-expanded` no válido en `<article>`** — usar `aria-hidden` en hijos
18. **Framer Motion `whileInView` para stagger** — FM ya cargado, preferible a GSAP para staggers simples
19. **ProductCard CTA sin carrito** — "Agregado ✓" temporal 2s, sin Zustand todavía
20. **CoffeeQuiz empate → `medio`** — Pichincha 2850 gana siempre en empate de puntos
21. **HeroTransition morph dentro del hero** — no usa getBoundingClientRect cross-section; el morph es narrativa visual contenida en el hero. ShopCoffee es independiente.
22. **SectionTitle acepta `id` opcional** — para `aria-labelledby` en secciones de conversión con h2 visible
23. **ShopCoffee h2 visible** — sección de conversión; a diferencia de OriginStory/ExperienceCards que usan sr-only
24. **`LocationHours[]` en lugar de `{ weekdays, weekends }`** — array de filas `{ label, time }` para soportar horarios partidos (pausa al mediodía) sin cambios de tipo
25. **Leaflet `isMounted` flag** — único patrón correcto para async effects con librerías imperativas en StrictMode; `mapRef.current` no es suficiente porque puede ser null cuando cleanup corre
26. **Navbar `#locations`** — anchor directo desde el home, en línea con `#menu`
27. **i18n: `localePrefix: 'as-needed'` requiere `[[...locale]]`** — Con `[locale]` (required), `/` da 404 porque no hay locale en la URL. Con `[[...locale]]` (catch-all opcional), `/` captura locale vacío → `defaultLocale = 'en'`. ES tiene prefijo (`/es`).
28. **i18n: SSG mantenido** — `setRequestLocale` en layout Y page. `generateStaticParams` genera `{ locale: [] }` para `/` y `{ locale: ['es'] }` para `/es`.
29. **i18n: Server Components llaman `getTranslations()`** — Client Components usan `useTranslations()`. HeroScroll es Client → page.tsx (Server) le pasa `overlayMessages` como prop.
30. **i18n: datos sin texto** — `locations.ts`, `questions.ts`, `messages.ts` del hero solo tienen estructura/IDs/coords/scores. Todo texto en `messages/[locale].json`.
31. **Navbar frosted glass post-hero** — CSS-driven via `html.navbar-scrolled`. Default (sin clase) es transparente: correcto para SSR sin flash. El glass crea su propio panel visual crema, haciendo el texto oscuro legible sobre cualquier fondo de sección (incluyendo Locations `bg-primary` y ExperienceCards dark). No usar `bg-surface` sólido.
32. **Links single-landing** — mientras solo existe el home, todos los links de Navbar y Footer apuntan a anclas `#section`. Rutas `/about` y `/blog` en Navbar se dejan apuntando a sus rutas futuras. Social links del Footer pendientes de URLs reales del cliente. Legal (`#privacy`, `#terms`) son placeholders.

---

## 17. Patrones de código establecidos

### GSAP en Client Components
```typescript
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let revert: (() => void) | undefined
  ;(async () => {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => { /* triggers aquí */ }, containerRef)
    revert = () => ctx.revert()
  })()
  return () => revert?.()
}, [])
```

### CSS Marquee infinito
```tsx
// inline-flex (NO flex w-max) · 3 copias · calc(-100% / 3) · pr-12 en cada grupo
```

### Canvas Frame Scrub
```typescript
// useFrameLoader: IntersectionObserver rootMargin:'600px 0px', batch updates en checkpoints
// useCanvasScrub: framesRef pattern, ResizeObserver, prefers-reduced-motion → frame medio
// drawBestFrame: object-fit cover equivalent, fallback al último frame cargado
const fi = Math.min(Math.floor(self.progress * frameCount), frameCount - 1)
const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
ctx.drawImage(img, (cw - img.naturalWidth*scale)/2, (ch - img.naturalHeight*scale)/2,
  img.naturalWidth*scale, img.naturalHeight*scale)
```

### Flip Card 3D
```
card-wrapper (perspective) → card-inner (preserve-3d, NO overflow:hidden)
→ card-face (backface-hidden, SÍ overflow:hidden)
```

### ProductCard SizeSelector
```tsx
// fieldset + legend sr-only + radio sr-only + label estilizado como pill
// Estado: useState(product.defaultSizeId) local a la card
// Precio: aria-live="polite" aria-atomic="true" en el contenedor
```

### CTA temporal sin carrito
```typescript
const [added, setAdded] = useState(false)
useEffect(() => {
  if (!added) return
  const id = setTimeout(() => setAdded(false), 2000)
  return () => clearTimeout(id)
}, [added])
// Reutilizar este patrón hasta que Zustand esté implementado
```

### CoffeeQuiz highlight de resultado
```typescript
// Añadir clases ring via classList (no state) para evitar re-render de todas las cards
card.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface')
const id = setTimeout(() => card.classList.remove(...), 3000)
return () => clearTimeout(id)
```

### Imágenes opcionales con fallback a placeholder
```tsx
{product.image ? (
  <Image src={product.image} alt={product.imageAlt} fill className="object-cover" sizes="..." />
) : (
  <div role="img" aria-label={product.imageAlt} className="absolute inset-0"
    style={{ backgroundColor: product.placeholderColor }} />
)}
// Mismo patrón en ExperienceCard (imageSrc), ProductCard (image) y MenuItemCard (image)
```

---

## 18. Roadmap

```
Fase 0   ✅ Setup + estructura + tokens
Fase 1   ✅ Design tokens + SectionTitle + Button
Fase 2   ✅ Navbar + Footer
Fase 3   ✅ HeroScroll (canvas frame sequence + GSAP scroll narrative)
Fase 4   ✅ TrustBar (CSS marquee infinito)
Fase 5   ✅ OriginStory (canvas frame scrub × 4 beats)
Fase 6   ✅ ExperienceCards (flip cards × 4 experiencias + imágenes reales)
Fase 7   ✅ ShopCoffee (ProductCard + CoffeeQuiz + HeroTransition)
Fase 7.1 ✅ Catálogo real — Bold / Tropical / Immersive + imágenes reales
Fase 8   ✅ MenuVisual (3 categorías · 11 ítems · 100% Server Components)
Fase 9      Sustainability + Awards (pospuesta)
Fase 10     Reviews + BlogPreview (pospuesta)
Fase 11  ✅ Locations (Leaflet · 2 sedes · CartoDB · flyTo)
Fase 12  ✅ i18n (next-intl v4 · en/es · SSG · [locale] segment · LanguageSwitcher)
Fase 13     Performance audit + accesibilidad
Fase 14     Deploy a Vercel
—           /tienda (catálogo completo) — pendiente sin número de fase asignado
```

---

## 19. Cómo continuar en sesión fresca

1. Leer este HANDOFF.md completo
2. Leer `docs/DESIGN.md` (fuente de verdad visual)
3. Ejecutar `pnpm build` — debe pasar limpio
4. Los prompts de cada fase están en `docs/prompts/`

**Para arrancar Fase 13 (Performance + Accesibilidad), decirle a Claude:**
> "Retomamos Coffee Relief Web. Lee el `HANDOFF.md` y `docs/DESIGN.md`. Fases 0–8, 11 y 12 completadas. Fases 9–10 pospuestas. Arrancamos la Fase 13 — Performance audit + accesibilidad. Ciclo SDD obligatorio: SPEC → aprobación → BUILD → VERIFY. Empieza con la SPEC completa."

**Estado de i18n (Fase 12 completada):**
- Locales: `en` (default, sin prefijo) y `es` (`/es`)
- LanguageSwitcher: EN | ES en Navbar (desktop + mobile)
- SSG: `/en` y `/es` pre-generados en build
- Todos los componentes: texto en `messages/en.json` y `messages/es.json`
- HeroScroll (Client): recibe `overlayMessages` como prop desde `page.tsx` (Server)
- CoffeeQuiz (Client): `useTranslations('quiz')` para todas las cadenas y preguntas

---

*Documento actualizado al finalizar la Fase 11 (Locations — mapa Leaflet + 2 sedes de Quito).*
*Repo: https://github.com/Cheboy04/coffee-relief-web*
