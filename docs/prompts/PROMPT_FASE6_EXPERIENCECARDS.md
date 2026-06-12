# Fase 6 — ExperienceCards (Flip Cards × 4 experiencias)
# Sección de conversión — las 4 formas de vivir Coffee Relief
# Grid de 4 cards iguales en fila, flip horizontal al hover/tap

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–5 completadas y verificadas. Avanzamos a la **Fase 6 — ExperienceCards**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto narrativo

ExperienceCards es la primera sección de conversión del home.
Después del hero (narrativa sensorial) y el OriginStory (valores de marca),
el usuario ya confía en Coffee Relief. Ahora se le presentan las 4 puertas:
**cómo quiere entrar en la experiencia**.

No es un menú de navegación disfrazado de cards. Es una invitación.
Cada card representa un mundo completo. El frente lo seduce con imagen y título.
El reverso, al flip, le cuenta qué encontrará si entra — y le da el CTA.

La tensión entre "quiero saber más" y el flip es el micro-momento de engagement
que convierte una visita pasiva en una intención activa.

---

## Decisiones de diseño ya tomadas — respetar sin cambiar

1. **4 cards rectangulares del mismo tamaño** — grid de 4 en fila, full-width de la sección
2. **Flip horizontal** al hover (desktop) y tap (mobile) — solo la card, nunca el CTA del frente
3. **Reverso:** fondo `bg-primary` (espresso `#26170c`) + texto `text-on-primary` (cream `#ffffff`)
4. **Mobile:** tap dispara el flip — solo en la card, no en el CTA del frente
5. **Imágenes:** placeholders de color del design system por ahora
6. **Cada card tiene CTA propio** — diferente por card, en frente y reverso

---

## Las 4 cards — contenido base

```
Card 1 — La Cafetería
Card 2 — Café Online
Card 3 — Experiencias de Tasting
Card 4 — Menú Brunch
```

El copywriting exacto se define en la SPEC 6C.

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De Fase 5 (canvas scrub):**
- `framesRef` pattern: si hay estado asincrónico que interactúa con efectos,
  usar refs intermedias para evitar re-registro de listeners.
- `ResizeObserver` en cualquier componente que dependa de dimensiones del DOM.
- Guard `saveData` + `prefers-reduced-motion` en cualquier componente
  con animaciones o assets pesados.

**De Fase 4 (marquee):**
- `inline-flex` dentro de `overflow:hidden` — nunca `flex w-max`.
- Las cards usan `overflow:hidden` para el flip — verificar que
  los hijos tengan ancho correcto.

**De Fase 3 (hero):**
- `IntersectionObserver threshold: 0.1` máximo. Nunca `0.5`.
- GSAP cleanup: siempre `ctx.revert()` si se usa GSAP aquí.
- El flip es CSS puro (no GSAP) — no necesita dynamic import.
  Pero si hay entrance animation (fade-up al entrar en viewport),
  evaluar si usa GSAP o Framer Motion ya cargado.

**Tailwind v4:**
- Sin `tailwind.config.ts`. Tokens nuevos en `globals.css @theme {}`.
- Sin valores arbitrarios `[]`. Si no existe el token → crear `@utility`.
- El flip 3D requiere CSS custom (`perspective`, `transform-style`,
  `backface-visibility`) — estos van como `@utility` en globals.css
  o como `style` prop inline si son valores únicos no reutilizables.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 6A — Arquitectura de archivos

Lista exacta de archivos a crear. Para cada uno:
ruta, responsabilidad, Server vs. Client Component, y por qué.

Considera:
- La animación de flip requiere estado (`isFlipped`) y event handlers
  → al menos `ExperienceCard.tsx` debe ser `'use client'`.
- ¿El grid container (`ExperienceCards/index.tsx`) puede ser Server Component
  que recibe las cards como children o las renderiza directamente?
- ¿Los datos viven en `src/data/experienceCards.ts` fuera del componente?

Formato esperado:
```
src/components/sections/ExperienceCards/
  index.tsx              — [Server|Client] — razón
  ExperienceCard.tsx     — [Server|Client] — razón
  types.ts               — tipos locales
src/data/experienceCards.ts  — datos de las 4 cards
```

¿Necesita barrel export en `sections/index.ts`?

### SPEC 6B — Tipos y contratos

Define los tipos TypeScript completos. Sin TODOs ni `any`.

```typescript
interface ExperienceCardData {
  id: string
  // Frente:
  title: string         // font-display — nombre de la experiencia
  imageSrc: string      // path en /public/ o color placeholder
  imageAlt: string      // descripción real para screen readers
  placeholderColor: string  // token CSS var — mientras no hay imagen real
  ctaFront: {
    label: string       // texto del botón en el frente
    href: string        // destino
  }
  // Reverso:
  eyebrow: string       // text-label-md uppercase — categoría o tipo
  summary: string       // 2–3 oraciones — la promesa de la experiencia
  ctaBack: {
    label: string       // ¿mismo label que el frente o diferente?
    href: string        // mismo destino o puede diferir
  }
}

interface ExperienceCardProps {
  data: ExperienceCardData
  // ¿algo más? ¿index para stagger de entrada?
}

interface ExperienceCardsProps {
  // ¿props externos o datos hardcodeados desde data.ts?
}
```

Define también:
- ¿El estado `isFlipped` es local en cada card (useState) o global (Zustand)?
  Justifica — ¿tiene sentido que dos cards estén volteadas al mismo tiempo?
- ¿El flip se revierte al salir el cursor (mouseleave), o la card queda
  volteada hasta el próximo hover/tap?

### SPEC 6C — Contenido de las 4 cards

Propón el copywriting completo en español para cada card.

Tono: premium, directo, sensorial. Sin gerundios vacíos ("Viviendo el café").
El frente seduce con el nombre. El reverso promete con detalle concreto.

```typescript
const EXPERIENCE_CARDS: ExperienceCardData[] = [
  {
    id: 'cafeteria',
    title: '',            // font-display — máx 3 palabras
    imageSrc: '',         // placeholder por ahora
    imageAlt: '',         // descripción para screen reader
    placeholderColor: '', // token del design system — ver §colores abajo
    ctaFront: {
      label: '',          // acción directa — ej: "Visítanos"
      href: '',           // ej: '#locations' o '/cafeteria'
    },
    eyebrow: '',          // text-label-md uppercase — ej: "Cafetería · Quito"
    summary: '',          // 2–3 oraciones concretas y sensoriales
    ctaBack: {
      label: '',          // puede ser igual o más específico que el frente
      href: '',
    },
  },
  // card 2: café online
  // card 3: experiencias de tasting
  // card 4: menú brunch
]
```

**Colores placeholder recomendados (uno distinto por card):**
Usa tokens ya existentes en el design system:
- `var(--color-primary-container)` → `#3d2b1f` (espresso oscuro)
- `var(--color-secondary-container)` → `#fdd7a7` (dorado suave)
- `var(--color-surface-container-high)` → `#eae7e7` (kraft claro)
- `var(--color-tertiary-container)` → `#2f2f2c` (carbón)

**Recomendación de imagen real para cada card (para cuando lleguen los assets):**
Incluye en un comentario junto a cada card qué tipo de fotografía
quedaría mejor. Considera la paleta espresso/cream y el estilo editorial.
Por ejemplo:
- Cafetería: plano medio de la barra de espresso con luz natural lateral,
  fondo con estantes de sacos de café. Temperatura cálida, sin personas en foco.
- Café online: close-up de la funda kraft sobre superficie de madera,
  con granos de café esparcidos. Fondo neutro cream.
- Tasting: manos sosteniendo tazas de cupping sobre mesa de madera,
  con fichas de cata visibles. Composición cenital.
- Brunch: mesa completa de brunch con luz de ventana, cerámica artesanal,
  flores secas. Estética slow-food editorial.

### SPEC 6D — Mecánica del flip

Define exactamente el funcionamiento de la animación 3D:

**1. CSS requerido para flip 3D:**
```css
/* ¿Qué propiedades CSS necesita cada elemento?
   Define la jerarquía: wrapper → card-inner → card-front → card-back */

.experience-card-wrapper {
  perspective: ?px;          /* ¿cuánto? — típico: 1000px–1500px */
}

.experience-card-inner {
  transform-style: preserve-3d;
  transition: transform ?ms ?easing;  /* duración y easing */
  /* ¿cuándo se aplica rotateY(180deg)? */
}

.experience-card-front,
.experience-card-back {
  backface-visibility: hidden;
  /* ¿qué más necesitan? */
}

.experience-card-back {
  transform: rotateY(180deg);  /* posición inicial del reverso */
}
```

¿Estos van como `@utility` en globals.css o como clases CSS en un módulo?
Justifica — en Tailwind v4 sin config, ¿cuál es la forma correcta?

**2. Trigger del flip:**
- Desktop: `onMouseEnter` → flip, `onMouseLeave` → unflip
- Mobile (touch): `onClick` en la card → toggle `isFlipped`
  pero NO en el área del CTA del frente (el CTA navega normalmente)
  ¿Cómo separas el área clickeable del CTA del área del flip?

**3. Duración y easing del flip:**
¿Cuántos ms dura el flip? ¿Qué easing?
Considera: demasiado rápido (< 200ms) parece brusco; demasiado lento (> 600ms) fatiga.
¿Hay diferencia de velocidad entre flip y unflip?

**4. `prefers-reduced-motion`:**
Sin la animación 3D: ¿cómo se muestra el reverso?
- Fade crossfade (opacity 0→1) sin rotación
- Sin transición: el reverso aparece directamente
- En mobile reduced-motion: tap muestra el reverso sin flip

### SPEC 6E — Layout del grid

**Desktop:**
```
[card 1] [card 2] [card 3] [card 4]
← full width del contenedor max-w-content →
```

1. ¿`grid grid-cols-4` o `flex`? Justifica.
2. ¿Hay gap entre cards? ¿Cuánto? (token existente o nuevo `@utility`)
3. ¿La sección tiene `px-5 md:px-16` como las otras, o las cards
   van de borde a borde sin margen lateral?
4. ¿Cuál es la altura de cada card? Define en tokens:
   - ¿Altura fija (ej: 480px, 520px) o aspect ratio (ej: 3/4)?
   - En mobile: ¿las cards se apilan en columna o van 2×2?
   - ¿La altura cambia en mobile?

**Tablet (768px–1024px):**
¿El grid sigue siendo 4 columnas o pasa a 2×2?

**Mobile (< 768px):**
¿Las cards son una columna (apiladas) o dos columnas (2×2)?
¿Qué altura tienen en mobile?

### SPEC 6F — Diseño del frente de la card

Define la composición visual del frente:

```
┌─────────────────────────┐
│                         │
│      [imagen/color      │
│       placeholder]      │
│                         │
│  [título font-display]  │
│  [CTA Button]           │
└─────────────────────────┘
```

1. ¿El título y CTA están superpuestos sobre la imagen (overlay),
   o debajo de la imagen (bajo la imagen)?
2. Si overlay: ¿qué gradiente o overlay oscuro garantiza legibilidad?
   Define color y opacidad: `linear-gradient(to top, rgba(38,23,12,X), transparent)`
3. ¿El CTA en el frente usa variante `primary` o `secondary` del Button existente?
   (Considera: si el fondo es oscuro, `primary` espresso no se ve — quizás `ghost` o `secondary`)
4. ¿El título tiene `text-shadow` para legibilidad sobre imagen?
   Si sí: define los valores.
5. ¿Hay algún indicador sutil de que la card es interactiva (hace flip)?
   Ej: ícono de "voltear", texto "Ver más", cambio de cursor.

### SPEC 6G — Diseño del reverso de la card

Fondo `bg-primary` (`#26170c`) + texto `text-on-primary` (`#ffffff`).

Define la composición:

```
┌─────────────────────────┐
│  [eyebrow label]        │
│                         │
│  [summary 2–3 oraciones]│
│                         │
│  [CTA Button]           │
└─────────────────────────┘
```

1. ¿Cómo se distribuye verticalmente el contenido en el reverso?
   ¿Centrado con `flex flex-col justify-center`, o con padding fijo?
2. ¿El eyebrow tiene algún separador visual (línea, punto) antes del summary?
3. ¿El CTA del reverso usa variante `ghost` (borde blanco) o
   una variante nueva `primary-inverse` (fondo cream, texto espresso)?
   Si necesita variante nueva: definir en la SPEC de Button props.
4. ¿Hay padding interno en el reverso? ¿Cuánto? (token o nuevo @utility)
5. ¿Algún elemento decorativo en el reverso? (ej: un divisor fino,
   número de card, logotipo pequeño en una esquina)

### SPEC 6H — Entrance animation

Cuando la sección ExperienceCards entra en viewport:
¿Hay animación de entrada para las cards?

1. ¿Stagger de entrada (card 1 → 2 → 3 → 4 con delay entre sí),
   o todas aparecen al mismo tiempo?
2. ¿Qué animación? Opciones:
   - `animate-fade-up` (ya existe en globals.css) con stagger
   - Fade simple (opacity 0→1)
   - Sin entrada: las cards aparecen directamente
3. Si hay stagger: ¿GSAP o Framer Motion?
   Framer Motion ya está cargado (MobileMenu). GSAP también.
   ¿Cuál es más apropiado para un stagger simple sin ScrollTrigger?
4. `prefers-reduced-motion`: sin stagger, sin fade-up. Cards visibles directamente.
5. `IntersectionObserver threshold`: máximo `0.1` (regla del proyecto).

### SPEC 6I — Accesibilidad

El flip card es un patrón complejo para accesibilidad. Define:

1. **Semántica del componente:**
   - ¿`<article>` o `<div>` para cada card?
   - ¿La card tiene `aria-label` con el nombre de la experiencia?

2. **Estado del flip para screen readers:**
   - `aria-expanded` en la card para indicar si el reverso está visible
   - O `aria-hidden="true"` en el reverso cuando está oculto (no volteado)
   - Define cuál y cómo cambia con el estado `isFlipped`

3. **Teclado:**
   - ¿La card es focusable (`tabIndex={0}`) y responde a `Enter`/`Space` para flip?
   - ¿El CTA del frente sigue siendo accesible con Tab sin activar el flip?

4. **Imágenes placeholder:**
   - `role="img"` + `aria-label` descriptivo en el div de color placeholder
   - Cuando llegue imagen real: `alt` descriptivo en `next/image`

5. **Jerarquía de headings:**
   El home tiene: `h1` (hero) → `h2` (secciones, puede ser sr-only) → `h3` (beats/cards).
   ¿El título de cada ExperienceCard es `h3`?
   ¿La sección tiene un `h2` sr-only como OriginStory?

6. **Focus visible:**
   Al navegar con teclado, ¿el focus ring es visible sobre el fondo espresso del reverso?
   Define el color del `outline` en el estado focused.

### SPEC 6J — Integración en page.tsx

Muéstrame cómo queda `src/app/page.tsx` después de esta fase:

```typescript
export default function HomePage() {
  return (
    <>
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      {/* Fase 7: ShopCoffee */}
    </>
  )
}
```

¿La sección necesita `id="experiencias"` para navegación anchor desde el Navbar?

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Arquitectura Server/Client con frontera justificada
- [ ] Tipos TypeScript completos: `ExperienceCardData`, `ExperienceCardProps`, estado flip
- [ ] Copywriting real de las 4 cards en español (frente + reverso)
- [ ] Recomendaciones de fotografía real incluidas como comentario
- [ ] CSS del flip 3D: jerarquía de elementos, propiedades, valores numéricos
- [ ] Decisión sobre `@utility` vs. clases inline para el CSS 3D
- [ ] Trigger desktop (hover) vs. mobile (tap) con separación CTA/flip definida
- [ ] Duración y easing del flip con justificación
- [ ] `prefers-reduced-motion`: comportamiento sin rotación definido
- [ ] Layout del grid: columnas, gap, altura, responsive (tablet + mobile)
- [ ] Diseño del frente: overlay o debajo, gradiente, CTA variante
- [ ] Diseño del reverso: distribución vertical, CTA variante, padding
- [ ] Entrance animation elegida con justificación
- [ ] Accesibilidad completa: semántica, aria-expanded/hidden, teclado, headings
- [ ] Integración en page.tsx con placeholder de Fase 7

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1  globals.css                          ← @utility para flip 3D y tokens nuevos
Paso 2  src/data/experienceCards.ts          ← ExperienceCardData[] con copywriting
Paso 3  ExperienceCards/types.ts             ← todos los tipos del componente
Paso 4  ExperienceCard.tsx                   ← card individual con flip, sin grid
Paso 5  ExperienceCards/index.tsx            ← grid de 4 cards + entrance animation
Paso 6  src/app/page.tsx                     ← integrar ExperienceCards
```

Reglas del BUILD:
- Después de cada paso: `npx tsc --noEmit` — 0 errores antes de continuar.
- Tokens nuevos de CSS 3D: documentar en HANDOFF.md sección 6.
- No mezclar lógica de flip con lógica de entrance — efectos separados.
- El componente `ExperienceCard` debe funcionar de forma aislada:
  sin depender del grid padre para su comportamiento.
- En mobile: detectar touch con `window.matchMedia('(hover: none)')`,
  no con `'ontouchstart' in window` (más confiable y consistente con el resto del proyecto).

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 6 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Visual confirmado:**
- [ ] Desktop: 4 cards en fila, mismo tamaño, sin overflow
- [ ] Desktop: flip horizontal fluido al hover — frente→reverso
- [ ] Desktop: unflip al salir el cursor — reverso→frente
- [ ] Desktop: CTA del frente navega sin disparar el flip
- [ ] Desktop: reverso bg-primary con texto cream legible
- [ ] Desktop: CTA del reverso visible y funcional
- [ ] Mobile: tap en la card (no en CTA) dispara el flip
- [ ] Mobile: tap fuera de la card o en CTA no dispara flip involuntario
- [ ] Mobile: layout responsive correcto (definido en spec)
- [ ] Tablet: layout responsive correcto (definido en spec)
- [ ] Entrance animation: cards aparecen con animación al entrar en viewport
- [ ] reduced-motion: flip sin rotación, entrada sin stagger

**Accesibilidad:**
- [ ] aria-expanded cambia correctamente con el estado del flip
- [ ] Navegación con teclado: Tab llega a cada card y CTA
- [ ] Enter/Space en card activa el flip
- [ ] Enter en CTA navega sin activar flip
- [ ] Focus ring visible sobre fondo espresso del reverso
- [ ] h3 en cada card, h2 sr-only en la sección
- [ ] Placeholders tienen role="img" y aria-label descriptivo
- [ ] Sin errores de accesibilidad en axe/lighthouse

**Performance:**
- [ ] Sin valores arbitrarios [] en ningún className
- [ ] Tokens 3D como @utility en globals.css, no inline
- [ ] Sin memory leaks (IntersectionObserver cleanup si aplica)
- [ ] GSAP/Framer cleanup si se usa para entrance animation
- [ ] No hay layout shift (CLS ≈ 0) al cargar la sección

**Tokens nuevos en HANDOFF.md sección 6:**
- [ ] Todos los @utility nuevos documentados
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 6 → ✅ en la tabla de verificación (sección 12)
- Tokens nuevos de CSS 3D → sección 6
- Bugs encontrados y resolución → sección 13
- Decisiones de diseño nuevas → sección 14
- Patrones de código nuevos (flip 3D, touch detection) → sección 15
- Fase siguiente → **Fase 7 — ShopCoffee + ProductCard + HeroTransition**

---

## Nota: HeroTransition NO va en esta fase

El trabajo de `HeroTransition.tsx` (morph funda→ProductCard)
va en la **Fase 7** junto con ShopCoffee.
No incluir ni mencionar HeroTransition en esta implementación.

---

Empieza con la SPEC completa.
Responde cada sección (6A hasta 6J) antes de escribir código.
