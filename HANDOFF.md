# Coffee Relief Web — Documento de Handoff
> Para retomar el proyecto en una sesión fresca con contexto completo.
> Última actualización: 2026-06-11 · Fases completadas: 0, 1, 2, 3, 4, 5

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
| Framer Motion | 12.40.0 | ✅ (en uso en MobileMenu) |
| Zustand | 5.0.14 | pendiente |
| React Hook Form | 7.77.0 | pendiente |
| Zod | 4.4.3 | pendiente |
| next-intl | 4.13.0 | pendiente — Fase 12 |

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
    layout.tsx          ← root layout: fuentes, Navbar, Footer, skip nav
    page.tsx            ← home page (HeroScroll + TrustBar + OriginStory + placeholder shop)
    globals.css         ← TODA la config Tailwind v4 + base styles + tokens
  components/
    layout/
      Navbar/           ← index.tsx (Server) + NavLinks.tsx (Server) + MobileMenu.tsx (Client)
      Footer/           ← index.tsx (Server) + FooterLinks.tsx (Server) + icons.tsx
      types.ts          ← NavLinkItem, NavbarProps, FooterProps, etc.
      index.ts          ← barrel
    sections/
      HeroScroll/       ← Fase 3 (ver §8)
      TrustBar/         ← Fase 4 (ver §9)
      OriginStory/      ← Fase 5 (ver §10)
      ExperienceCards/  ← Fase 6 (ver §11)
      index.ts          ← barrel actualizado
      index.ts          ← barrel: HeroScroll, TrustBar, OriginStory, ExperienceCards
    ui/
      Button.tsx        ← Client — 6 variantes (primary, secondary, ghost, ghost-light, inverse, link), 3 tamaños, polimórfico a/button
      SectionTitle.tsx  ← Server — h1-h4, 3 tamaños, eyebrow, alineación
  data/
    navigation.ts       ← NAV_LINKS, NAV_CTA, FOOTER_DATA
    experienceCards.ts  ← EXPERIENCE_CARDS: ExperienceCardData[] (4 cards)
  lib/utils/cn.ts       ← clsx + twMerge helper
  types/index.ts        ← Product, Review, Location, Award, ProductSize
```

---

## 6. Design System — tokens en globals.css

### Colores frecuentes
```
bg-surface              #fcf9f8  ← fondo principal cream
bg-surface-low          #f6f3f2  ← kraft, TrustBar, cards
bg-primary              #26170c  ← espresso (footer, botones primarios)
bg-primary-container    #3d2b1f  ← placeholder Beat 1
bg-secondary-container  #fdd7a7  ← placeholder Beat 3
bg-tertiary-container   #2f2f2c  ← placeholder Beat 4
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

### Utilities específicos de secciones
```
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
z-sticky          30  ← Navbar
```

### Animaciones
```css
--animate-fade-up:      fade-up 0.6s cubic-bezier(0.19,1,0.22,1) both
--animate-fade-in:      fade-in 0.4s ease both
--animate-trust-scroll: trust-scroll 30s linear infinite
--animate-hint-pulse:   hint-pulse 2s ease-in-out 3   ← badge tap en ExperienceCards (pulsa 3× y para)

@keyframes trust-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% / 3)); }  /* 3 copias */
}
@keyframes hint-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.45; transform: scale(0.88); }
}
```

### Utilities flip 3D — ExperienceCards
```
card-wrapper          perspective: 1200px  ← contenedor externo (article)
card-inner            transform-style:preserve-3d + transition 450ms  ← rota
card-inner-flipped    rotateY(180deg)  ← estado volteado
card-face             absolute inset-0 + backface-visibility:hidden + overflow:hidden + rounded-lg
card-back-face        rotateY(180deg)  ← pre-rotado (cara trasera)
card-front-overlay    gradiente espresso ascendente para legibilidad del texto
```
⚠️ `card-inner` NO debe tener `overflow:hidden` — rompe `transform-style:preserve-3d`.
`overflow:hidden` va en `card-face` (hijos), no en el padre que rota.

### Variantes Button
```
primary      bg-espresso, text-cream  ← acción principal
secondary    border espresso, text-espresso  ← acción secundaria
ghost        text-espresso, hover:bg-surface-low  ← sobre fondos claros
ghost-light  border white/40, text-white, hover:bg-white/10  ← sobre fondos oscuros (card front overlay)
inverse      bg-surface, text-primary  ← sobre fondos espresso (card back)
link         text-secondary underline  ← links inline
```

### Variables CSS runtime
```css
--navbar-height: 60px (mobile) / 72px (desktop)
--navbar-fg-color: var(--color-on-surface)  ← HeroScroll lo overridea a white
```

---

## 7. Navbar y Footer — reglas críticas

1. **Navbar siempre transparente** — nunca `bg-surface` ni fondo de ningún tipo
2. **`--navbar-fg-color`** — color de texto via CSS variable; HeroScroll lo cambia con GSAP onEnter/onLeave
3. **Z-index Navbar: `z-sticky` (30)** — el hero usa z-index menores
4. **Sin `pt-navbar` en `<main>`** — el hero es full-bleed; páginas interiores lo agregan ellas mismas
5. **MobileMenu.tsx** es el único Client Component del Navbar

---

## 8. Fase 3 — HeroScroll

**Ruta:** `src/components/sections/HeroScroll/`

```
index.tsx           ← orchestrador, detecta modo (scrub/loop/static)
HeroCanvas.tsx      ← canvas frame sequence (Client)
HeroVideo.tsx       ← video fallback legacy (Client)
HeroOverlay.tsx     ← texto + CTA overlay (Client)
HeroTransition.tsx  ← slot para morph funda→card (Phase 7)
useHeroScrub.ts     ← GSAP timeline + ScrollTrigger
useHeroMode.ts      ← detecta scrub/loop/static según device
useHeroTransition.ts← morph placeholder
messages.ts         ← 3 beats de texto del overlay
types.ts
```

**3 modos de operación:**
- `scrub` — desktop con motion: canvas frame sequence controlado por GSAP scroll
- `loop` — mobile: video autoplay muted loop
- `static` — reduced-motion / saveData / no-JS: solo poster PNG

**Assets:**
- `/public/frames/frame_000000.webp` ... `frame_000160.webp` — 161 frames WebP (canvas mode)
- `/public/video/hero.mp4` — video fallback
- `/public/video/hero-poster.png` — poster (OJO: es `.png`, no `.jpg`)
- `/public/video/hero-scrub.mp4` — video con keyframes densos (legacy, no usado en canvas mode)

**Navbar integration:**
```typescript
// HeroScroll usa IntersectionObserver con threshold: 0 (no 0.5 — falla en secciones altas)
// Al entrar: document.documentElement.style.setProperty('--navbar-fg-color', 'white')
// Al salir:  setProperty('--navbar-fg-color', 'var(--color-on-surface)')
```

**Bugs corregidos en Fase 3:**
- `threshold: 0.5` → `threshold: 0` (con 300vh, 0.5 requería 150vh visible — imposible)
- Poster z-index `z-raised` → `z-video` (estaba tapando el overlay de texto)
- GSAP `scrub: 1` → `scrub: 0.3` (reducir lag inercial)

**Patrón GSAP obligatorio** (dynamic import + ctx.revert):
```typescript
const build = async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  const ctx = gsap.context(() => { ... }, containerRef)
  revert = () => ctx.revert()
}
```

---

## 9. Fase 4 — TrustBar

**Ruta:** `src/components/sections/TrustBar/`

```
index.tsx      ← Server Component — marquee infinito CSS
TrustItem.tsx  ← átomo: [icon, label]
icons.tsx      ← 5 SVGs inline: VolcanicIcon, ProducerIcon, RoastedIcon, ShippingIcon, EcoIcon
data.ts        ← TRUST_ITEMS: TrustItem[]
```

**5 ítems:** Café 100% Volcánico · Directo del Productor · Tostado Artesanal · Envío Gratis desde $35 · Empaque Sostenible

**Patrón marquee — lección crítica:**

❌ `flex w-max` dentro de `overflow:hidden` — el browser computa ancho incorrecto (devuelve el ancho del contenedor, no el contenido)

✅ `inline-flex` — adopta el ancho de su contenido naturalmente

**Regla del loop infinito:**
- Necesitas que `total_width / n_copies >= viewport_width`
- Con 1239px de contenido y 1280px viewport → 2 copias fallan (1239 < 1280)
- **3 copias + `calc(-100% / 3)`** = solución correcta
- Cada copia tiene `pr-12` (= gap-x-12) para que el espacio post-último-ítem sea igual al gap entre ítems

```tsx
<div className="inline-flex animate-trust-scroll hover:[animation-play-state:paused]">
  {[0, 1, 2].map(copy => (
    <ul key={copy} className="flex shrink-0 items-center gap-x-12 pr-12">
      {TRUST_ITEMS.map(...)}
    </ul>
  ))}
</div>
```

**Tool de medición disponible:** `scripts/measure-marquee.mjs` — verifica anchos en Playwright.

---

## 10. Fase 5 — OriginStory

**Ruta:** `src/components/sections/OriginStory/`

**Técnica:** Canvas frame scrub — el mismo patrón del HeroScroll. Cada beat tiene su propio
`<canvas>` controlado por GSAP ScrollTrigger. El scroll del usuario selecciona el frame a dibujar.

```
index.tsx           ← Server Component — compone los 4 beats, id="origin"
OriginBeat.tsx      ← Server Component — layout beat (canvas + texto), pasa scrollTrackId
CanvasScrub.tsx     ← Client Component — canvas element + orquesta hooks
useFrameLoader.ts   ← hook — carga frames por beat con IntersectionObserver + batch updates
useCanvasScrub.ts   ← hook — GSAP ScrollTrigger + drawFrame + ResizeObserver
types.ts            ← BeatConfig, CanvasScrubProps
src/data/originStory.ts ← ORIGIN_BEATS: BeatConfig[] (fuera de sections/)
```

**Frontera Server/Client:**
- `OriginStory` e `OriginBeat` son Server Components — sin hooks ni refs
- `CanvasScrub` y ambos hooks son `'use client'` — únicos que tocan el DOM

**4 beats — datos completos:**
| id | eyebrow | headline | canvasLeft |
|---|---|---|---|
| `origen` | Valle del Chota | Volcánico por naturaleza | true |
| `seleccion` | Cosecha manual | Solo el grano en su punto | false |
| `tueste` | Quito, 2.850 m | El tueste donde nace | true |
| `comercio` | Sin intermediarios | Del productor a tu taza | false |

**Assets de frames — convención de naming:**
```
public/images/origin/
  beat-1-origen/
    frame_000000.webp   ← índice 0-based, 6 dígitos, guion bajo, .webp
    frame_000001.webp
    ...
    frame_000059.webp   ← 60 frames por beat
  beat-2-seleccion/
    frame_000000.webp ... frame_000059.webp
  beat-3-tueste/
    frame_000000.webp ... frame_000059.webp
  beat-4-comercio/
    frame_000000.webp ... frame_000059.webp
```
⚠️ **Naming es `frame_000000.webp`** (guion bajo, 6 dígitos, 0-indexado, WebP) —
igual que los frames del hero en `/public/frames/`. NO usar guion, 3 dígitos ni .jpg.
Resolución recomendada: 1920×1080px, calidad WebP 80.

**Layout por beat:**
- Desktop: `h-beat-track` (200vh), canvas `w-canvas-col` (55%) sticky + texto `w-text-col` (45%) que scrollea
- Mobile: canvas `h-beat-canvas-mob` (56vw) en flow normal, texto debajo — `h-beat-track-mob` (150vh)
- Canvas alterna lado por beat via `canvasLeft: boolean`

**Placeholder mientras cargan frames:** `fillRect` con `placeholderColor` de cada beat.
Los colores mapean a tokens del design system:
```
Beat 1 — origen:    #3d2b1f (bg-primary-container)
Beat 2 — seleccion: #fdd7a7 (bg-secondary-container)
Beat 3 — tueste:    #755a34 (text-secondary)
Beat 4 — comercio:  #2f2f2c (bg-tertiary-container)
```

**Lógica de scrub:**
```typescript
// Fórmula frameIndex — Math.floor (no Math.round: evita llegar a frameCount)
const fi = Math.min(Math.floor(self.progress * frameCount), frameCount - 1)

// object-fit: cover equivalente en canvas
const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
const x = (cw - img.naturalWidth * scale) / 2
const y = (ch - img.naturalHeight * scale) / 2
ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)

// Fallback: si el frame pedido no está cargado, usa el último cargado disponible
// Si ninguno cargó → fillRect con placeholderColor
```

**Patrón GSAP — framesRef para evitar re-registro:**
```typescript
// framesRef y progressRef se sincronizan via useEffect separado
// El useEffect del ScrollTrigger tiene deps vacías [] — se registra UNA vez
// Evita re-registro infinito que ocurriría si `frames` fuera dependencia directa
const framesRef = useRef(frames)
useEffect(() => { framesRef.current = frames }, [frames])

useEffect(() => {
  // ScrollTrigger lee siempre framesRef.current (siempre actualizado)
  // ...
}, []) // eslint-disable-line — intencional
```

**Preload strategy:**
```typescript
// IntersectionObserver con rootMargin: '600px 0px'
// Activa la carga de frames cuando el beat está a 600px del viewport
// Cada beat carga independientemente — beat 1 carga primero naturalmente
// Batch state updates en checkpoints: frame 1, 25%, 50%, 75%, 100%
```

**Accesibilidad:**
- `<canvas aria-hidden="true">` — el texto del beat ya describe el contenido visualmente
- `<section id="origin" aria-labelledby="origin-story-heading">`
- `<h2 id="origin-story-heading" className="sr-only">Origen de nuestro café</h2>`
- Cada beat: `<h3>` para el headline — jerarquía h1 (hero) → h2 (section) → h3 (beats)
- `prefers-reduced-motion`: ScrollTrigger no se registra, canvas muestra frame del medio (`Math.floor(frameCount / 2)`)

**Fallbacks implementados:**
- `prefers-reduced-motion` → ScrollTrigger no se registra + canvas muestra `Math.floor(frameCount / 2)` cuando los frames cargan
- `saveData` mode → frames no se cargan, canvas muestra `placeholderColor` permanentemente
- Sin JavaScript → `<canvas style={{ backgroundColor: placeholderColor }}>` visible + `<noscript>` con `<div>` de mismo color y `role="img"`
- Frame fallido al cargar → `drawBestFrame` retrocede al último frame cargado disponible, o al placeholder

**Cuando lleguen los frames reales:**
```
1. Extraer frames en WebP 1920×1080 quality 80
2. Nombrar frame_000000.webp, frame_000001.webp, ...
3. Colocar en public/images/origin/beat-N-nombre/
4. Actualizar frameCount en src/data/originStory.ts si difiere de 60
5. pnpm build — el componente los toma sin cambios de código
```

---

## 11. Fase 6 — ExperienceCards

**Ruta:** `src/components/sections/ExperienceCards/`

```
index.tsx               ← Server Component — <section id="experiencias">, h2 sr-only
ExperienceCardsGrid.tsx ← Client Component — Framer Motion stagger + grid 1/2/4 cols
ExperienceCard.tsx      ← Client Component — flip state, hover/touch, badge hint
types.ts                ← ExperienceCardData, ExperienceCardProps
src/data/experienceCards.ts ← EXPERIENCE_CARDS: ExperienceCardData[] (4 cards)
```

**Frontera Server/Client:**
- `index.tsx` es Server — solo shell semántico, sin estado
- `ExperienceCardsGrid.tsx` es Client — Framer Motion `whileInView` stagger
- `ExperienceCard.tsx` es Client — `useState(isFlipped, hasFlippedOnce, isTouch)`

**4 cards — datos:**
| id | title | eyebrow | placeholderColor |
|---|---|---|---|
| `cafeteria` | La Cafetería | Cafetería · Quito | `var(--color-primary-container)` |
| `tienda` | Café Online | Tienda · Envío nacional | `var(--color-secondary-container)` |
| `tasting` | Tasting | Experiencias · Cupping | `var(--color-tertiary-container)` |
| `brunch` | Brunch | Menú · Sábados y domingos | `var(--color-surface-high)` |

**Mecánica de flip:**
```
Desktop: onMouseEnter → flip, onMouseLeave → unflip
Mobile:  onClick en card (no en CTA) → toggle. CTA usa e.stopPropagation()
Teclado: Enter/Space en article → toggle
```
- CSS 3D puro: `card-wrapper` → `card-inner` → `card-face` (front + back)
- Transición: 450ms `cubic-bezier(0.4, 0, 0.2, 1)`
- `prefers-reduced-motion`: transición mata a 0.01ms (global override), flip funciona instantáneamente
- Touch detection: `useState(() => window.matchMedia('(hover: none)').matches)` — lazy initializer, sin `useEffect`

**Badge de tap hint (mobile):**
- Solo visible en touch (`isTouch = true`)
- Icono ↻ en `top-4 right-4`, `bg-white/20 backdrop-blur-sm rounded-full w-9 h-9`
- Anima con `animate-hint-pulse` (pulsa 3× en 6s y para)
- Desaparece con `transition-opacity duration-300` tras el primer flip (`hasFlippedOnce`)
- `prefers-reduced-motion`: badge visible pero sin animación

**Layout del grid:**
```
Mobile   (<768px):  grid-cols-1,  h-experience-card-mob (420px)
Tablet   (768px+):  grid-cols-2,  h-experience-card-mob (420px)
Desktop  (1280px+): grid-cols-4,  h-experience-card     (520px)
gap-4 (16px) entre cards
```

**Entrance animation:**
- Framer Motion `whileInView` + stagger `delay: index * 0.1`
- `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`
- `prefersReducedMotion ? false : initial` — deshabilita animación en reduced motion
- `viewport={{ once: true, margin: '-80px' }}`

**Accesibilidad:**
- `<section id="experiencias" aria-labelledby="experiencias-heading">`
- `<h2 id="experiencias-heading" className="sr-only">Nuestras experiencias</h2>`
- `<h3>` en cada card (jerarquía h1 hero → h2 secciones → h3 cards)
- `aria-hidden` en la cara no visible (front cuando flipped, back cuando no)
- Placeholder: `role="img" aria-label={data.imageAlt}`
- Front CTA: `tabIndex={isFlipped ? -1 : undefined}` — no alcanzable cuando oculto
- Back CTA: `tabIndex={isFlipped ? undefined : -1}` — solo alcanzable cuando visible

**Cuando lleguen las imágenes reales:**
```
1. Reemplazar el div role="img" por <Image> de next/image
2. Usar imageAlt ya definido en src/data/experienceCards.ts
3. Añadir campo imageSrc a ExperienceCardData en types.ts
4. Actualizar data con las rutas reales
```

---

## 12. page.tsx — estado actual

```tsx
import { HeroScroll, TrustBar, OriginStory, ExperienceCards } from '@/components/sections'

export default function HomePage() {
  return (
    <>
      <HeroScroll />           {/* Fase 3 — full-bleed, sin pt-navbar */}
      <TrustBar />             {/* Fase 4 — bg-surface-low */}
      <OriginStory />          {/* Fase 5 — bg-surface, id="origin" */}
      <ExperienceCards />      {/* Fase 6 — bg-surface, id="experiencias" */}

      {/* Fase 7: ShopCoffee + ProductCard + HeroTransition */}
      <section id="shop" className="bg-surface py-section px-5 md:px-16">
        <div className="mx-auto max-w-content">
          <p className="font-sans text-body-md text-on-surface-variant">
            Sección Tienda — se construye en las próximas fases.
          </p>
        </div>
      </section>
    </>
  )
}
```

---

## 13. Estado de verificación

| Fase | Componente | Estado | Build | Types | Lint |
|---|---|---|---|---|---|
| 0 | Setup + estructura | ✅ | ✓ | ✓ | ✓ |
| 1 | Design tokens + Button + SectionTitle | ✅ | ✓ | ✓ | ✓ |
| 2 | Navbar + Footer | ✅ | ✓ | ✓ | ✓ |
| 3 | HeroScroll (canvas frame sequence) | ✅ | ✓ | ✓ | ✓ |
| 4 | TrustBar (marquee infinito) | ✅ | ✓ | ✓ | ✓ |
| 5 | OriginStory (canvas frame scrub × 4 beats) | ✅ | ✓ | ✓ | ✓ |
| 6 | ExperienceCards (flip cards × 4 experiencias) | ✅ | ✓ | ✓ | ✓ |
| 7 | ShopCoffee + ProductCard + HeroTransition | ⏳ | — | — | — |

---

## 14. Bugs encontrados y resueltos

| Bug | Causa | Resolución |
|---|---|---|
| `setIsTouch` en `useEffect` violaba `react-hooks/set-state-in-effect` | setState síncrono en body de effect — ESLint lo rechaza | Convertido a `useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)` — lazy initializer, sin effect |
| `aria-expanded` en `<article>` | El rol implícito `article` no soporta aria-expanded según ARIA spec | Eliminado — la accesibilidad del flip está cubierta por `aria-hidden` en cada cara (front/back) |
| Next.js 16 instalado en lugar de 14 | `@latest` | Aprobado mantener v16 + Tailwind v4 |
| `Button` AsAnchor tipo restrictivo | Solo declaraba href/target/rel | Extiende todos los AnchorHTMLAttributes |
| ESLint warnings `_*` vars | Destructuring de props shared | `varsIgnorePattern: '^_'` en eslint.config.mjs |
| Hero IntersectionObserver nunca disparaba | threshold: 0.5 en sección 300vh | threshold: 0 |
| Poster del hero tapando texto overlay | z-raised (10) = z-index del overlay | Cambiado a z-video (5) |
| Video scrub con lag excesivo | scrub: 1 | Cambiado a scrub: 0.3 |
| TrustBar no era infinita | `flex w-max` computa ancho incorrecto dentro de overflow:hidden | `inline-flex` + 3 copias + `calc(-100% / 3)` |
| Imágenes OriginStory 400 error | data.ts usaba `.jpg`, archivos son `.jpeg` | data.ts actualizado a `.jpeg` |
| OriginStory refactorizada de parallax a canvas scrub | Decisión de diseño para coherencia visual con el hero | Fase 5 reescrita completa: CanvasScrub.tsx + useFrameLoader.ts + useCanvasScrub.ts |
| ScrollTrigger se re-registraba en loop | `frames` como dependencia de useEffect causaba re-registro en cada batch update | Patrón `framesRef` + deps vacías `[]` con eslint-disable justificado |
| Canvas no mantenía resolución al redimensionar | `canvas.width/height` no se actualizaban con el tamaño CSS | `ResizeObserver` en useCanvasScrub sincroniza resolución interna con tamaño CSS |
| `prefers-reduced-motion` mostraba frame 0 en lugar del frame medio | El efecto "redraw on frames" usaba `progressRef.current = 0` (nunca avanzado en modo reducido) | Verificar `matchMedia` en el efecto de redibujado y usar `Math.floor(frameCount / 2)` |
| Frames se cargaban en modo data-saver | `CanvasScrub` no verificaba `navigator.connection?.saveData`, a diferencia del HeroScroll | Guard `saveData` antes del `IntersectionObserver` — beats quedan en color placeholder |
| Canvas vacío sin JavaScript | `<canvas>` no tiene contenido visual sin JS — users sin JS veían nada | `style={{ backgroundColor: placeholderColor }}` en canvas + `<noscript>` con div de color + `role="img"` |

---

## 15. Decisiones de diseño — no revertir sin consultar

1. **Navbar siempre transparente** — nunca bg-surface ni color de fondo
2. **`--navbar-fg-color` CSS variable** — color texto navbar via CSS var, no prop ni JS scroll
3. **Z-index Navbar: z-sticky (30)** — hero usa z-index menores
4. **Sin `pt-navbar` en `<main>`** — hero full-bleed; páginas interiores lo agregan
5. **`font-display` solo en headings** — nunca en body ni labels
6. **`text-label-md uppercase`** en todos los labels, chips, eyebrows
7. **`py-section` (120px)** entre secciones — nunca menos
8. **Sin valores arbitrarios `[]`** — agregar @utility a globals.css
9. **GSAP dynamic import** — siempre `await import('gsap')` dentro de useEffect, nunca import estático de tope
10. **CSS `scale` (no `transform: scale`)** en elementos que también anima GSAP con translateY
15. **`(hover: none)` para detección touch** — `window.matchMedia('(hover: none)').matches` en lazy initializer de `useState`, no en `useEffect`. Consistente con el patrón del proyecto. Aplicar a cualquier componente futuro que diferencie comportamiento hover/touch.
16. **Flip card CSS 3D** — `card-wrapper` (perspective) → `card-inner` (preserve-3d + transition) → `card-face` (absolute + backface-hidden). `overflow: hidden` va en `card-face`, no en `card-inner` (evita conflicto con preserve-3d). El `card-inner` NO debe tener `overflow: hidden`.
17. **`aria-expanded` no válido en `<article>`** — ARIA spec no permite `aria-expanded` en el rol implícito `article`. Usar `aria-hidden` en los hijos para comunicar estado de visibilidad al screen reader.
18. **Framer Motion `whileInView` para stagger de entrada** — usar FM ya cargado (en MobileMenu) en lugar de GSAP para staggers simples sin ScrollTrigger. `initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}` — `false` como initial deshabilita la animación de entrada (correcto para reduced motion).

11. **Canvas frame scrub en OriginStory** — misma técnica que el hero, no parallax estático. Razón: coherencia del lenguaje visual del sitio. Cada beat tiene 60 frames WebP en `/public/images/origin/beat-N-nombre/frame_000000.webp`.
12. **`framesRef` pattern en useCanvasScrub** — ScrollTrigger registrado con deps `[]` vacías; `framesRef` y `progressRef` se actualizan via `useEffect` separado. Evita re-registro infinito del trigger al llegar batches de frames.
13. **Frame naming: `frame_000000.webp`** — guion bajo, 6 dígitos, 0-indexado, WebP. Igual que hero. NO usar guion, 3 dígitos ni .jpg. Si los assets reales usan otro formato, actualizar `frameSrc()` en `useFrameLoader.ts`.
14. **`saveData` guard en canvas scrub** — consistente con HeroScroll: si `navigator.connection?.saveData` está activo, no se cargan frames. Aplicar este mismo patrón en cualquier componente futuro que cargue assets pesados (videos, secuencias de frames).

---

## 16. Patrones de código establecidos

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
}, [deps])
```

### CSS Marquee infinito
```tsx
// track: inline-flex (NO flex w-max)
// n copias: suficientes para que copia_width >= viewport_width
// keyframe: translateX(calc(-100% / n_copias))
// cada grupo: gap-x-12 pr-12 (pr igual al gap para cierre seamless)
```

### Flip Card 3D (ExperienceCards — Fase 6)
```
Jerarquía CSS: card-wrapper (perspective) → card-inner (preserve-3d) → card-face (backface-hidden)
card-inner NO tiene overflow:hidden — rompe preserve-3d
card-face SÍ tiene overflow:hidden — para clip de contenido interno

isFlipped       → agrega card-inner-flipped (rotateY 180deg), 450ms ease
hasFlippedOnce  → oculta badge hint tras primer tap
isTouch         → useState lazy init (matchMedia hover:none), sin useEffect
```

### Tap Hint Badge (ExperienceCards — Fase 6)
```tsx
// Solo en isTouch, desaparece al primer flip con fade:
{isTouch && (
  <div
    aria-hidden="true"
    className={cn(
      'absolute top-4 right-4 z-raised',
      'flex items-center justify-center w-9 h-9',
      'rounded-full bg-white/20 backdrop-blur-sm',
      'transition-opacity duration-300',
      !prefersReducedMotion && 'animate-hint-pulse',
      hasFlippedOnce && 'opacity-0 pointer-events-none',
    )}
  >
    <FlipHintIcon />
  </div>
)}
// animate-hint-pulse: 3 iteraciones × 2s = 6s, luego para (no infinite)
// Aplicar este patrón en cualquier elemento cuya interactividad no sea obvia en touch
```

### Canvas Frame Scrub (OriginStory — Fase 5)
```typescript
// useFrameLoader: carga frames en paralelo, batch updates en checkpoints
// IntersectionObserver rootMargin: '600px 0px' → precarga cuando el beat se acerca
// 60 frames/beat, WebP, naming: frame_000000.webp (0-indexed, 6 dígitos)

// useCanvasScrub: ScrollTrigger con scrub:true + onUpdate manual
ScrollTrigger.create({
  trigger: scrollTrack,     // article con id="beat-{id}" y h-beat-track (200vh)
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const fi = Math.min(Math.floor(self.progress * frameCount), frameCount - 1)
    drawBestFrame(ctx, framesRef.current, fi, cw, ch, placeholderColor)
  },
})

// object-fit: cover equivalent
const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
ctx.drawImage(img, (cw - img.naturalWidth*scale)/2, (ch - img.naturalHeight*scale)/2,
  img.naturalWidth*scale, img.naturalHeight*scale)

// ResizeObserver: mantiene canvas.width/height en sync con tamaño CSS
// framesRef: evita re-registro de ScrollTrigger al llegar batches de frames
// prefers-reduced-motion: frame fijo en Math.floor(frameCount / 2)
```

---

## 17. Roadmap

```
Fase 0   ✅ Setup + estructura + tokens
Fase 1   ✅ Design tokens + SectionTitle + Button
Fase 2   ✅ Navbar + Footer
Fase 3   ✅ HeroScroll (canvas frame sequence + GSAP scroll narrative)
Fase 4   ✅ TrustBar (CSS marquee infinito)
Fase 5   ✅ OriginStory (canvas frame scrub × 4 beats)
Fase 6   ✅ ExperienceCards (flip cards × 4 experiencias)
Fase 7   ⏳ ShopCoffee + ProductCard + HeroTransition
Fase 8      MenuVisual
Fase 9      Sustainability + Awards
Fase 10     Reviews + BlogPreview
Fase 11     Locations
Fase 12     i18n (es/en con next-intl)
Fase 13     Performance audit + accesibilidad
Fase 14     Deploy a Vercel
```

---

## 18. Cómo continuar en sesión fresca

1. Leer este HANDOFF.md completo
2. Leer `docs/DESIGN.md` (fuente de verdad visual)
3. Ejecutar `pnpm build` — debe pasar limpio
4. Ejecutar `pnpm dev` para ver estado actual en browser
5. Los prompts de cada fase están en `docs/prompts/PROMPT_FASE{N}_*.md`

**Para arrancar Fase 7, decirle a Claude:**
> "Retomamos Coffee Relief Web. Lee el `HANDOFF.md` y el `docs/DESIGN.md`. Fases 0–6 completadas. Arrancamos la Fase 7 — ShopCoffee + ProductCard + HeroTransition. Ciclo SDD obligatorio: SPEC → aprobación → BUILD → VERIFY. Empieza con la SPEC completa."

---

*Documento actualizado al finalizar la Fase 6 (ExperienceCards — flip cards) del proyecto Coffee Relief Web.*
*Repo: https://github.com/Cheboy04/coffee-relief-web*
