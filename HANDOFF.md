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
      index.ts          ← barrel: HeroScroll, TrustBar, OriginStory
    ui/
      Button.tsx        ← Client — 4 variantes, 3 tamaños, polimórfico a/button
      SectionTitle.tsx  ← Server — h1-h4, 3 tamaños, eyebrow, alineación
  data/
    navigation.ts       ← NAV_LINKS, NAV_CTA, FOOTER_DATA
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

@keyframes trust-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% / 3)); }  /* 3 copias */
}
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

**Cuando lleguen los frames reales:**
```
1. Extraer frames en WebP 1920×1080 quality 80
2. Nombrar frame_000000.webp, frame_000001.webp, ...
3. Colocar en public/images/origin/beat-N-nombre/
4. Actualizar frameCount en src/data/originStory.ts si difiere de 60
5. pnpm build — el componente los toma sin cambios de código
```

---

## 11. page.tsx — estado actual

```tsx
import { HeroScroll, TrustBar, OriginStory } from '@/components/sections'

export default function HomePage() {
  return (
    <>
      <HeroScroll />           {/* Fase 3 — full-bleed, sin pt-navbar */}
      <TrustBar />             {/* Fase 4 — bg-surface-low */}
      <OriginStory />          {/* Fase 5 — bg-surface, id="origin" */}

      {/* PHASE 6+: ExperienceCards, ShopCoffee, ProductCard, etc. */}
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

## 12. Estado de verificación

| Fase | Componente | Estado | Build | Types | Lint |
|---|---|---|---|---|---|
| 0 | Setup + estructura | ✅ | ✓ | ✓ | ✓ |
| 1 | Design tokens + Button + SectionTitle | ✅ | ✓ | ✓ | ✓ |
| 2 | Navbar + Footer | ✅ | ✓ | ✓ | ✓ |
| 3 | HeroScroll (canvas frame sequence) | ✅ | ✓ | ✓ | ✓ |
| 4 | TrustBar (marquee infinito) | ✅ | ✓ | ✓ | ✓ |
| 5 | OriginStory (canvas frame scrub × 4 beats) | ✅ | ✓ | ✓ | ✓ |
| 6 | ExperienceCards | ⏳ | — | — | — |

---

## 13. Bugs encontrados y resueltos

| Bug | Causa | Resolución |
|---|---|---|
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

---

## 14. Decisiones de diseño — no revertir sin consultar

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
11. **Canvas frame scrub en OriginStory** — misma técnica que el hero, no parallax estático. Razón: coherencia del lenguaje visual del sitio. Cada beat tiene 60 frames WebP en `/public/images/origin/beat-N-nombre/frame_000000.webp`.
12. **`framesRef` pattern en useCanvasScrub** — ScrollTrigger registrado con deps `[]` vacías; `framesRef` y `progressRef` se actualizan via `useEffect` separado. Evita re-registro infinito del trigger al llegar batches de frames.
13. **Frame naming: `frame_000000.webp`** — guion bajo, 6 dígitos, 0-indexado, WebP. Igual que hero. NO usar guion, 3 dígitos ni .jpg. Si los assets reales usan otro formato, actualizar `frameSrc()` en `useFrameLoader.ts`.

---

## 15. Patrones de código establecidos

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

## 16. Roadmap

```
Fase 0   ✅ Setup + estructura + tokens
Fase 1   ✅ Design tokens + SectionTitle + Button
Fase 2   ✅ Navbar + Footer
Fase 3   ✅ HeroScroll (canvas frame sequence + GSAP scroll narrative)
Fase 4   ✅ TrustBar (CSS marquee infinito)
Fase 5   ✅ OriginStory (canvas frame scrub × 4 beats)
Fase 6   ⏳ ExperienceCards
Fase 7      ShopCoffee + ProductCard + CoffeeQuiz
Fase 8      MenuVisual
Fase 9      Sustainability + Awards
Fase 10     Reviews + BlogPreview
Fase 11     Locations
Fase 12     i18n (es/en con next-intl)
Fase 13     Performance audit + accesibilidad
Fase 14     Deploy a Vercel
```

---

## 17. Cómo continuar en sesión fresca

1. Leer este HANDOFF.md completo
2. Leer `docs/DESIGN.md` (fuente de verdad visual)
3. Ejecutar `pnpm build` — debe pasar limpio
4. Ejecutar `pnpm dev` para ver estado actual en browser
5. Los prompts de cada fase están en `docs/prompts/PROMPT_FASE{N}_*.md`

**Para arrancar Fase 6, decirle a Claude:**
> "Retomamos Coffee Relief Web. Lee el `HANDOFF.md` y el `docs/DESIGN.md`. Fases 0–5 completadas. El prompt de la fase 6 estará en `docs/prompts/PROMPT_FASE6_*.md`. Ciclo SDD obligatorio: SPEC → aprobación → BUILD → VERIFY. Empieza con la SPEC completa."

---

*Documento actualizado al finalizar la Fase 5 (canvas scrub) del proyecto Coffee Relief Web.*
*Repo: https://github.com/Cheboy04/coffee-relief-web*
