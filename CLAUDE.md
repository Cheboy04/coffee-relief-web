@AGENTS.md

# Coffee Relief Web — Guía del proyecto para Claude

> Lee este archivo completo antes de escribir cualquier línea de código.
> La fuente de verdad visual es `docs/DESIGN.md`.
> El estado actual del proyecto está en `HANDOFF.md`.

---

## Stack real instalado

| Paquete | Versión | Nota |
|---|---|---|
| Next.js | 16.2.7 | App Router, Server Components por defecto |
| React | 19.2.4 | |
| Tailwind CSS | v4 | Config en `globals.css` via `@theme`/`@utility` — NO existe `tailwind.config.ts` |
| TypeScript | 5 strict | Sin `any` implícitos |
| GSAP | 3.15.0 + @gsap/react 2.1.2 | Dynamic import obligatorio dentro de useEffect |
| Framer Motion | 12.40.0 | En uso en MobileMenu |
| Zustand | 5.0.14 | Pendiente |
| React Hook Form | 7.77.0 | Pendiente |
| Zod | 4.4.3 | Pendiente |
| next-intl | 4.13.0 | Pendiente — Fase 12 |

---

## Tailwind v4 — regla crítica

**No existe `tailwind.config.ts`.** Todo el design system vive en `src/app/globals.css`:
- `@theme {}` — tokens (colores, spacing, tipografía, animaciones)
- `@utility` — clases compuestas con nombre semántico
- Sin valores arbitrarios `[]` en className. Si no existe el token → crearlo en `globals.css`.

```css
/* ✅ Agregar token nuevo */
@utility py-section { padding-top: 120px; padding-bottom: 120px; }

/* ❌ Nunca */
<div className="py-[120px]">
```

---

## Design System — reglas absolutas

Ver `docs/DESIGN.md` para la spec completa. Resumen de reglas críticas:

### Colores
- Nunca hex directo en className. Siempre tokens: `bg-surface`, `text-on-surface`, `bg-primary`, etc.
- Fondo principal: `bg-surface` (`#fcf9f8`) — nunca `bg-white`.
- Acentos y eyebrows: `text-secondary` (`#755a34`).
- Bordes: `border border-primary/10` — nunca bordes negros sólidos.

### Tipografía
- `font-display` (Libre Caslon Text) → solo headings y nombres de producto. Nunca en body.
- `font-sans` (Hanken Grotesk) → todo lo demás.
- Clases: `text-display-lg`, `text-headline-md`, `text-body-lg`, `text-label-md`.
- Labels y eyebrows: `text-label-md uppercase` — siempre los dos juntos.
- `font-display` weight es `400` editorial — nunca `font-bold` en display.

### Espaciado
- Entre secciones del home: `py-section` (120px). Nunca menos en desktop.
- Márgenes laterales: `px-5` mobile / `px-16` desktop.
- Contenedor máximo: `max-w-content` (1280px).

---

## Componentes — convenciones

### Server vs. Client
```typescript
// ✅ Server Component por defecto (sin directiva)
export default function TrustBar() { ... }

// ✅ Client solo cuando se necesita: hooks de estado/efecto, event handlers, GSAP/canvas
'use client'
export default function CanvasScrub() { ... }
```

### GSAP — patrón obligatorio
```typescript
// Dynamic import dentro de useEffect — NUNCA import estático en el top del archivo
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let revert: (() => void) | undefined
  ;(async () => {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // ScrollTrigger aquí
    }, containerRef)
    revert = () => ctx.revert()
  })()
  return () => revert?.()
}, []) // deps vacías si se usan refs para evitar re-registro
```

### Clases condicionales
```typescript
// ✅ Array join para condicionales (proyecto no usa clsx aquí — consistencia)
className={['base-class', condition && 'conditional-class'].filter(Boolean).join(' ')}

// ✅ cn() de @/lib/utils/cn para casos complejos
import { cn } from '@/lib/utils/cn'
```

---

## Accesibilidad — no negociable

- Jerarquía semántica: `<h1>` hero → `<h2>` secciones (puede ser `sr-only`) → `<h3>` beats/cards.
- `<section aria-labelledby="id-del-heading">` en todas las secciones.
- `<canvas>` → `aria-hidden="true"` cuando el texto adyacente describe el contenido.
- `prefers-reduced-motion`: sin scrub, sin parallax, sin animaciones de entrada.
- `IntersectionObserver`: threshold máximo `0.1` en secciones altas (nunca `0.5`).
- Touch targets mínimos: 44×44px.

---

## Performance — no negociable

- Canvas/video nunca bloquea LCP: mostrar placeholder inmediatamente.
- GSAP: dynamic import siempre — nunca en el bundle global.
- Frames WebP para canvas scrub — nunca JPG/PNG sin motivo.
- `priority={true}` solo en imágenes above-the-fold (máximo 1-2 por página).

---

## Lo que NUNCA hacer

```
❌ import gsap from 'gsap'  (top level)     → dynamic import en useEffect
❌ className="text-[14px]"                  → text-label-md
❌ className="py-[120px]"                   → py-section
❌ style={{ color: '#26170c' }}             → bg-primary / text-on-surface
❌ tailwind.config.ts                       → no existe, usar globals.css
❌ 'use client' por defecto                 → solo si es necesario
❌ threshold: 0.5 en IntersectionObserver   → máximo 0.1 en secciones altas
❌ <img src="...">                          → next/image
❌ any en TypeScript                        → tipar correctamente
❌ <h1> múltiples en una página             → jerarquía semántica
❌ console.log en producción               → remover antes de commit
```

---

## Flujo de trabajo

1. Leer `HANDOFF.md` para saber el estado actual.
2. Leer `docs/DESIGN.md` para la sección en la que se trabaja.
3. Ciclo SDD: **SPEC → aprobación del usuario → BUILD → VERIFY**.
4. Nunca saltar de SPEC a BUILD sin aprobación explícita.
5. `pnpm build` + `npx tsc --noEmit` + `pnpm lint` deben pasar limpio al terminar cada fase.
6. Al terminar una fase: actualizar `HANDOFF.md` (tokens, bugs, decisiones, estado).

---

## Archivos clave

```
HANDOFF.md                    ← estado del proyecto, decisiones, bugs, roadmap
docs/DESIGN.md                ← fuente de verdad visual (colores, tipos, spacing)
docs/prompts/                 ← prompts SDD de cada fase
src/app/globals.css           ← TODO el design system Tailwind v4
src/components/sections/      ← secciones del home
src/data/                     ← datos (beats, navegación, etc.)
```
