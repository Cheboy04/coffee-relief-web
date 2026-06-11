# Coffee Relief Web — Documento de Handoff
> Para retomar el proyecto en una sesión fresca con contexto completo.
> Última actualización: 2026-06-10 · Fases completadas: 0, 1, 2, 3, 4, 5

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
| DESIGN.md (fuente de verdad visual) | `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\DESIGN.md` |
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
h-beat-image      560px  ← altura container imagen OriginStory desktop
h-beat-image-mob  320px  ← altura container imagen OriginStory mobile
scale-parallax    scale: 1.2  ← CSS `scale` property (NO transform) para parallax
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

```
index.tsx         ← Server Component — compone los 4 beats
OriginBeat.tsx    ← Client Component — layout + GSAP stagger entrance
ParallaxImage.tsx ← Client Component — GSAP ScrollTrigger parallax
data.ts           ← ORIGIN_BEATS: OriginBeat[]
types.ts          ← OriginBeat, ParallaxImageProps
```

**4 beats:**
| id | eyebrow | headline | imageLeft |
|---|---|---|---|
| `origen` | Valle del Chota | Volcánico por naturaleza | true |
| `seleccion` | Cosecha manual | Solo el grano en su punto | false |
| `tueste` | Quito, Ecuador | El tueste donde nace | true |
| `comercio` | Sin intermediarios | Del productor a tu taza | false |

**Assets de imágenes:**
```
public/images/origin-volcanic.jpeg   ← Beat 1 (ya existe)
public/images/origin-harvest.jpeg    ← Beat 2 (pendiente)
public/images/origin-roasting.jpeg   ← Beat 3 (pendiente)
public/images/origin-direct.jpeg     ← Beat 4 (pendiente)
```
OJO: extensión es `.jpeg` (4 letras), no `.jpg` — data.ts ya usa `.jpeg`. Next.js hace match exacto.
Dimensiones mínimas recomendadas: 1400×700px landscape.

**Layout desktop:** grid 12 cols, imagen 7 cols / texto 5 cols, alternado por beat.
**Layout mobile:** flex-col, imagen siempre arriba (primer elemento en DOM).

**Patrón parallax:**
```typescript
// scale-parallax (CSS `scale: 1.2`) en el imageWrapper — NO usar transform: scale()
// porque GSAP usa `transform` para translateY y se pisarían.
// CSS `scale` property es independiente de `transform`. ✓

gsap.fromTo(imageWrapperRef.current,
  { y: -offset },   // offset = containerHeight * parallaxFactor (default: 0.1)
  { y: offset, ease: 'none', scrollTrigger: { scrub: 0.5, start: 'top bottom', end: 'bottom top' } }
)
```

**Entrance animation (stagger):**
```typescript
// motion-safe:opacity-0 en eyebrow/headline/body → invisible en SSR si el usuario
// no tiene reduced-motion. GSAP anima opacity 0→1 + y 24→0 con stagger 0.12s.
// Con prefers-reduced-motion: no se aplica opacity-0 ni corre GSAP → texto siempre visible.
```

**Accesibilidad:**
- `<section id="origin" aria-labelledby="origin-story-heading">`
- `<h2 id="origin-story-heading" className="sr-only">` (invisible pero semántico)
- Cada beat: `<h3>` para el headline
- Hero es implícitamente h1 (la jerarquía es: h2 section → h3 beats)

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
| 5 | OriginStory (parallax + stagger) | ✅ | ✓ | ✓ | ✓ |
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

### Parallax con GSAP
```tsx
// container: relative overflow-hidden h-beat-image
// imageWrapper: absolute inset-0 scale-parallax (CSS scale, no transform)
//              style={{ willChange: 'transform' }}
// GSAP: fromTo(wrapper, {y: -offset}, {y: offset, ease:'none', scrollTrigger:{scrub:0.5}})
// offset = container.offsetHeight * parallaxFactor (default 0.1)
```

### Entrance animation (stagger)
```tsx
// CSS inicial: motion-safe:opacity-0 (invisible en browser normal, visible en reduced-motion)
// GSAP: fromTo([el1,el2,el3], {opacity:0,y:24}, {opacity:1,y:0,stagger:0.12,duration:0.6})
// scrollTrigger: { start: 'top 80%' } — sin scrub, se ejecuta una sola vez
```

---

## 16. Roadmap

```
Fase 0   ✅ Setup + estructura + tokens
Fase 1   ✅ Design tokens + SectionTitle + Button
Fase 2   ✅ Navbar + Footer
Fase 3   ✅ HeroScroll (canvas frame sequence + GSAP scroll narrative)
Fase 4   ✅ TrustBar (CSS marquee infinito)
Fase 5   ✅ OriginStory (parallax + stagger entrance)
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
2. Leer `DESIGN.md` en `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\DESIGN.md`
3. Ejecutar `pnpm build` — debe pasar limpio
4. Ejecutar `pnpm dev` para ver estado actual en browser
5. El prompt de cada fase está en `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\PROMPT_FASE{N}_*.md`

**Para arrancar Fase 6, decirle a Claude:**
> "Retomamos Coffee Relief Web. Lee el HANDOFF.md en `C:\Projects\ClaudeCode\coffee-relief-web\HANDOFF.md` y el DESIGN.md en `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\DESIGN.md`. Fases 0–5 completadas. El prompt de la fase 6 está en `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\PROMPT_FASE6_*.md`. Ciclo SDD obligatorio: SPEC → aprobación → BUILD → VERIFY. Empieza con la SPEC completa."

---

*Documento actualizado al finalizar la Fase 5 del proyecto Coffee Relief Web.*
*Repo: https://github.com/Cheboy04/coffee-relief-web*
