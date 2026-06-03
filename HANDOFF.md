# Coffee Relief Web — Documento de Handoff
> Para retomar el proyecto en una sesión fresca con contexto completo.
> Última actualización: 2026-06-03 · Fases completadas: 0, 1, 2

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

El proyecto usa un flujo estricto de 4 pasos por cada fase:

```
SPEC  →  REVIEW  →  BUILD  →  VERIFY
```

1. **SPEC:** Claude propone tipos, contratos, API de componentes, estructura de archivos — sin escribir código de implementación
2. **REVIEW:** El usuario aprueba, corrige o rechaza la spec
3. **BUILD:** Claude implementa exactamente lo especificado
4. **VERIFY:** Claude muestra evidencia: build limpio, tipos sin errores, lint OK

**Regla crítica:** Si durante BUILD se encuentra un problema en la spec, Claude para y notifica antes de continuar. No se salta de SPEC a BUILD sin aprobación explícita.

---

## 4. Stack tecnológico — versiones reales instaladas

> ⚠️ El CLAUDE.md del proyecto especificaba Next.js 14 + Tailwind v3.
> Se decidió mantener lo que `pnpm create next-app@latest` instaló (Opción B aprobada por el usuario).

| Paquete | Especificado en CLAUDE.md | Real instalado | Estado |
|---|---|---|---|
| Next.js | 14 | **16.2.7** | ✅ Aprobado |
| React | 18 | **19.2.4** | ✅ Aprobado |
| Tailwind CSS | v3 | **v4** | ✅ Aprobado — config migrada a CSS |
| TypeScript | 5 strict | 5 strict | ✅ |
| Framer Motion | — | 12.40.0 | ✅ |
| GSAP | — | 3.15.0 | ✅ (pendiente de usar en Fase 3) |
| @gsap/react | — | 2.1.2 | ✅ |
| Zustand | — | 5.0.14 | ✅ (pendiente de usar) |
| React Hook Form | — | 7.77.0 | ✅ (pendiente) |
| Zod | — | 4.4.3 | ✅ (pendiente) |
| next-intl | — | 4.13.0 | ✅ (pendiente — Fase 12) |
| clsx + tailwind-merge | — | instalados | ✅ |

### Implicación de Tailwind v4

La diferencia arquitectural más importante: **no existe `tailwind.config.ts`** en el proyecto.
Todo el design system vive en `src/app/globals.css` usando:
- `@theme {}` para tokens (colores, spacing, tipografía, sombras, animaciones)
- `@utility` para clases compuestas que v4 no puede generar automáticamente
- `@plugin` para los plugins (@tailwindcss/typography, @tailwindcss/forms)

El archivo `tailwind.config.ts` que existe en `C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\`
es la versión v3 original — **NO está en el repo, no se usa**. Está ahí como referencia.

---

## 5. Arquitectura del proyecto

### Estructura de carpetas (Feature-Sliced Design adaptado)

```
src/
  app/
    layout.tsx          ← root layout: fuentes, Navbar, Footer, skip nav, <main id="main-content">
    page.tsx            ← página temporal de verificación visual (reemplazar en Fase 3)
    globals.css         ← TODA la configuración de Tailwind v4 + base styles
  components/
    layout/
      types.ts          ← tipos compartidos: NavLinkItem, NavbarProps, FooterProps, etc.
      Navbar/
        index.tsx       ← Server Component — shell del navbar
        NavLinks.tsx    ← Server Component — links desktop
        MobileMenu.tsx  ← 'use client' — hamburger + drawer animado
      Footer/
        index.tsx       ← Server Component — layout completo
        FooterLinks.tsx ← Server Component — columna de links
        icons.tsx       ← Server Component — SVGs inline: Instagram, TikTok, Facebook
      index.ts          ← barrel: export { Navbar, Footer }
    sections/           ← (vacío — se llena desde Fase 3)
    ui/
      Button.tsx        ← 'use client' — 4 variantes, 3 tamaños, polimórfico a/button, loading
      SectionTitle.tsx  ← Server Component — h1-h4, 3 tamaños, eyebrow, 3 alineaciones
  data/
    navigation.ts       ← NAV_LINKS, NAV_CTA, FOOTER_DATA (constantes tipadas)
  lib/
    animations/         ← (vacío — se llena en Fases 3+)
    hooks/              ← (vacío — se llena en Fase 3: useScrollProgress, useReducedMotion, useInView)
    utils/
      cn.ts             ← clsx + twMerge helper
  styles/               ← (vacío — globals.css vive en app/)
  types/
    index.ts            ← tipos canónicos: Product, Review, Location, Award, ProductSize
```

### Principios de Server vs. Client Components

Solo son `'use client'` cuando realmente lo necesitan:
- `Button.tsx` — onClick puede venir de padres, necesita ser Client
- `MobileMenu.tsx` — useState, useEffect, Framer Motion, teclado

Todo lo demás es **Server Component** (0 bytes al bundle del cliente por sí mismos).

---

## 6. Design System — fuente de verdad

El `DESIGN.md` (en el directorio de trabajo) define la identidad visual.
Su traducción técnica vive en `src/app/globals.css`.

### Tokens principales

**Colores (ejemplos de uso frecuente):**
```
bg-surface          #fcf9f8  ← fondo principal cream
bg-surface-low      #f6f3f2  ← kraft, cards
bg-primary          #26170c  ← espresso (footer background, botones primarios)
text-on-surface     #1c1b1b  ← texto principal
text-on-surface-variant  #4f453f  ← texto secundario, eyebrows
text-secondary      #755a34  ← roast (acentos, link variant)

bg-espresso = bg-primary    ← alias de conveniencia
bg-cream = bg-surface
bg-kraft = bg-surface-low
bg-roast = bg-secondary
```

**Tipografía (utilities custom via @utility):**
```
text-display-lg     64px / 72px / -0.02em / weight 400 (responsive: text-display-lg-mob en mobile)
text-headline-md    32px / 40px / weight 400
text-headline-sm    24px / 32px / weight 400
text-body-lg        18px / 28px
text-body-md        16px / 24px
text-label-md       14px / 20px / +0.05em tracking / weight 600 (labels, botones, chips)
text-caption        12px / 16px

font-display → Libre Caslon Text (--font-caslon)
font-sans    → Hanken Grotesk  (--font-hanken)
```

**Espaciado:**
```
py-section   → 120px (gap entre secciones del home)
px-5         → 20px  (margin mobile)
px-16        → 64px  (margin desktop)
max-w-[1280px] → contenedor máximo
```

**Z-index scale:**
```
z-video   5   (hero video)
z-raised  10  (overlays de texto del hero)
z-dropdown 20
z-sticky  30  (Navbar — siempre encima del hero)
z-overlay 40  (CartDrawer, mobile menu backdrop)
z-modal   50
z-toast   60
```

**Variables CSS runtime (fuera de @theme):**
```css
--navbar-height: 60px (mobile) / 72px (desktop)
--navbar-fg-color: var(--color-on-surface)  ← espresso por defecto
                                            ← Phase 3 lo overridea a white sobre hero
```

---

## 7. Componentes UI implementados

### Button (`src/components/ui/Button.tsx`)
- Variantes: `primary` | `secondary` | `ghost` | `link`
- Tamaños: `sm` | `md` | `lg`
- Polimórfico: renderiza `<button>` sin `href`, `<a>` con `href`
- Props del anchor: extiende `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared>` (full pass-through)
- Loading: spinner SVG `animate-spin` + `sr-only` para el texto original
- Disabled: `opacity-40 cursor-not-allowed pointer-events-none`
- Focus: `focus-visible:outline-2 outline-offset-2 outline-primary` — WCAG AA ✓

**Bug corregido:** `AsAnchor` originalmente solo listaba `href, target, rel`. MobileMenu pasaba `onClick` a un Button-anchor y TypeScript lo rechazó. Fix: `AsAnchor` ahora extiende todos los atributos HTML del anchor.

### SectionTitle (`src/components/ui/SectionTitle.tsx`)
- Props: `as` (h1-h4), `size` (display|headline-md|headline-sm), `eyebrow`, `align` (left|center|right)
- Siempre usa `font-display` (Libre Caslon Text) para el heading
- El eyebrow usa `font-sans text-label-md uppercase text-on-surface-variant`
- Server Component: 0 JS al cliente

---

## 8. Navbar — detalles críticos

### Comportamiento visual
El Navbar es **siempre transparente** (`background: transparent`).
Nunca cambia de fondo — ni en scroll, ni sobre el hero, ni en páginas interiores.

**Sombra:** `shadow-tonal-sm` (espresso al 6% de opacidad) — visible sobre cream, invisible sobre hero oscuro (intencional).

**Solución al problema de legibilidad dark/light:**
- Se creó `@utility text-navbar-fg { color: var(--navbar-fg-color) }`
- Por defecto: `--navbar-fg-color = var(--color-on-surface)` = espresso → legible sobre cream
- **En Fase 3:** HeroScroll usará GSAP ScrollTrigger para hacer `document.documentElement.style.setProperty('--navbar-fg-color', 'white')` cuando el hero esté en viewport, y resetearlo al salir. El Navbar no necesita saber nada de esto.
- El Navbar nunca detecta el scroll para cambiar estilos.

### Estructura Server/Client
```
Navbar/index.tsx     ← Server — compone todo
  NavLinks.tsx       ← Server — links desktop hidden md:hidden on mobile
  MobileMenu.tsx     ← Client — hamburger + drawer, gestiona su propio estado
```
Solo `MobileMenu.tsx` va al bundle del cliente.

### MobileMenu
- Framer Motion `AnimatePresence` con `overlayVariants` y `linkItemVariants` (stagger)
- `useReducedMotion()` — cuando true, usa solo opacity sin transforms
- Focus trap: Tab cicla dentro del panel, Escape cierra y devuelve foco al trigger
- Body scroll lock: `overflow: hidden` + `paddingRight = scrollbarWidth` (sin layout shift)
- Se cierra al navegar a un link, al hacer click fuera (backdrop), al resize a desktop, al Escape

---

## 9. Footer — detalles

- Background: `bg-primary` (#26170c espresso) + `bg-grain-subtle` texture
- Grid: 1 col (mobile) → 2 col (tablet) → 3 col `[2fr_1fr_1fr]` (desktop)
- Columna 1: Logo text + tagline + descripción + íconos sociales
- Columna 2-3: FooterLinks groups (Explorar, La marca)
- Bottom bar: copyright + links legales — `border-t border-white/10`
- Íconos sociales: SVG inline en `icons.tsx` (Instagram, TikTok, Facebook) — sin librería
- Los `href` de social links son **placeholders** — actualizar con URLs reales

---

## 10. layout.tsx — estructura actual

```tsx
<html lang="es" className={`${caslon.variable} ${hanken.variable}`}>
  <body>
    {/* Skip nav — visible solo en keyboard focus */}
    <a href="#main-content" className="sr-only focus-visible:not-sr-only ...">
      Saltar al contenido
    </a>

    <Navbar links={NAV_LINKS} ctaLabel="Comprar café" ctaHref="/shop" />

    {/* SIN pt-navbar — el hero (Fase 3) es full-bleed detrás del navbar.
        Las páginas interiores usan pt-navbar en su primer elemento. */}
    <main id="main-content">
      {children}
    </main>

    <Footer linkGroups={...} socialLinks={...} legalLinks={...} />
  </body>
</html>
```

**Importante para páginas interiores:** Cada página interior que NO es full-bleed debe agregar `pt-navbar` (un `@utility` que lee `--navbar-height`) a su primer contenedor para que el contenido no quede detrás del navbar fijo.

---

## 11. Estado actual de verificación

| Fase | Estado | Build | Types | Lint |
|---|---|---|---|---|
| 0 — Setup | ✅ Completada y aprobada | ✓ | ✓ | ✓ |
| 1 — Design tokens + Button + SectionTitle | ✅ Completada y aprobada | ✓ | ✓ | ✓ |
| 2 — Navbar + Footer | ✅ Completada y aprobada | ✓ | ✓ | ✓ |
| 3 — HeroScroll (video scrub) | ⏳ Pendiente | — | — | — |

**Estado del servidor de desarrollo:** La app corre en `http://localhost:3000` y muestra la página de verificación con los componentes de las Fases 1 y 2. El Navbar y Footer están integrados.

---

## 12. Lo que ha funcionado

- **SDD funciona bien** para este proyecto — la fase de SPEC evita reescrituras costosas
- **Tailwind v4 con @theme y @utility** — traducción completa del design system, sin pérdida de tokens
- **Server/Client split** del Navbar — solo MobileMenu va al cliente, el resto es HTML estático
- **`--navbar-fg-color` CSS variable** — solución elegante para el problema dark/light del navbar sin JS
- **Button polimórfico** — funcionó desde Fase 1, solo requirió un ajuste de tipos en Fase 2
- **`useReducedMotion`** de Framer Motion — integración simple y correcta en MobileMenu
- **Focus trap sin librería** — implementado con `querySelectorAll` sobre el panel, limpio y funcional

---

## 13. Lo que NO ha funcionado / Issues encontrados

### Bug 1: `pnpm create next-app@latest` instaló Next.js 16 (no 14)
**Causa:** La instrucción usaba `@latest` que instala la última versión.
**Resolución:** El usuario eligió mantener v16 + Tailwind v4 (Opción B). Se migró el `tailwind.config.ts` a CSS.
**Impacto:** Positivo — stack más moderno. El proyecto CLAUDE.md quedó desactualizado en versiones.

### Bug 2: `Button`'s `AsAnchor` tipo demasiado restrictivo
**Causa:** `AsAnchor` solo declaraba `href, target, rel`. MobileMenu pasó `onClick` al Button-anchor.
**Error TypeScript:** `Property 'onClick' does not exist on type AsAnchor`
**Resolución:** `AsAnchor` ahora extiende `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared>`.
**Lección:** Los tipos de componentes polimórficos deben extender los atributos HTML nativos, no listar props explícitas.

### Issue: ESLint warnings por variables `_*` en destructuring
**Causa:** El patrón de destructuring para "consumir" props compartidas antes de spread usa `_v, _s, _l...`
**Resolución:** `eslint.config.mjs` configurado con `varsIgnorePattern: '^_'`.
**Nota:** Este es el patrón estándar de TypeScript/ESLint para variables intencionalmente no usadas.

### Issue: `types.ts` reubicado vs. spec
**Spec dijo:** `src/components/layout/Navbar/types.ts`
**Implementado:** `src/components/layout/types.ts`
**Razón:** Los tipos de Footer también están ahí. Poner tipos de Footer en `Navbar/types.ts` era arquitecturalmente incorrecto.

---

## 14. Decisiones de diseño críticas a mantener

1. **Navbar siempre transparente** — nunca `bg-surface` ni ningún color de fondo
2. **`--navbar-fg-color`** — el color del texto del navbar se controla via CSS variable, no via prop ni scroll detection
3. **Z-index del Navbar: `z-sticky` (30)** — todos los elementos del hero deben usar z-index menor
4. **Sin `pt-navbar` en `<main>`** — el hero de la home es full-bleed; las páginas interiores lo agregan ellas mismas
5. **`font-display` (Libre Caslon Text) solo en headings** — nunca en body text o labels
6. **`text-label-md uppercase tracking-wider`** para todos los labels, chips, eyebrows
7. **`py-section` (120px)** entre secciones del home — nunca menos
8. **No valores arbitrarios `[]` en Tailwind** — si no existe el token, se agrega a `globals.css`

---

## 15. Roadmap restante

```
Fase 0   ✅ Setup + estructura + tokens
Fase 1   ✅ Design tokens + SectionTitle + Button
Fase 2   ✅ Navbar + Footer
Fase 3   ⏳ HeroScroll (video scrub GSAP — componente más complejo del proyecto)
Fase 4      TrustBar
Fase 5      OriginStory (parallax scroll)
Fase 6      ExperienceCards
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

## 16. Fase 3 — HeroScroll: contexto para arrancar

Es el componente más crítico del proyecto. Estas son las reglas ya establecidas:

**Estructura:**
- Section height: `300vh` (sticky scroll area)
- Video sticky: `h-screen object-cover z-video` (z-index 5)
- GSAP ScrollTrigger actualiza `video.currentTime` basado en scroll progress
- Overlay text: 3 mensajes que aparecen/desaparecen con opacidad:
  - 0–25%: "Del origen ecuatoriano"
  - 45–65%: "Al grano perfecto"
  - 80–100%: CTA reveal
- CTA final: fade-up con Button primary

**Fallbacks obligatorios:**
1. `prefers-reduced-motion` → imagen estática (poster)
2. Mobile (< md) → autoplay muted loop, sin scrub
3. `navigator.connection.saveData` → imagen estática

**Siempre `'use client'`**. GSAP se importa dinámicamente:
```typescript
const { gsap } = await import('gsap')
const { ScrollTrigger } = await import('gsap/ScrollTrigger')
gsap.registerPlugin(ScrollTrigger)
```

**Integración con Navbar:**
Al entrar al hero, HeroScroll debe ejecutar:
```typescript
document.documentElement.style.setProperty('--navbar-fg-color', 'white')
```
Al salir:
```typescript
document.documentElement.style.setProperty('--navbar-fg-color', 'var(--color-on-surface)')
```
Esto lo hace GSAP ScrollTrigger con `onEnter`/`onLeave`/`onEnterBack`/`onLeaveBack`.

**Video:**
- Archivo: `/public/video/hero.mp4` (aún no está en el repo — debe agregarse)
- Poster: `/public/video/hero-poster.jpg` (también pendiente)
- LCP: el poster debe cargar inmediatamente; el video se carga después
- `<video muted playsinline preload="metadata" aria-hidden="true">`

---

## 17. Cómo continuar en una sesión fresca

1. Leer este HANDOFF.md completo
2. Leer `DESIGN.md` en el directorio de trabajo
3. Hacer `git pull` en `C:\Projects\ClaudeCode\coffee-relief-web`
4. Ejecutar `pnpm build` y confirmar que pasa sin errores
5. Ejecutar `pnpm dev` para ver el estado actual en el browser

**Para la Fase 3, decirle a Claude:**
> "Retomamos Coffee Relief Web. Lee el HANDOFF.md en 'C:\Projects\ClaudeCode\Segunda prueba Coffee Relief\HANDOFF.md'.
> Estamos en Fase 3 — HeroScroll. Recuerda el ciclo SDD: SPEC → mi aprobación → BUILD → VERIFY.
> Empieza con la SPEC completa de la Fase 3."

---

*Documento generado al finalizar la Fase 2 del proyecto Coffee Relief Web.*
*Repo: https://github.com/Cheboy04/coffee-relief-web*
