# Fase 7 — ShopCoffee + ProductCard + CoffeeQuiz + HeroTransition
# La fase más grande hasta ahora: cierra el journey narrativo del hero
# y abre la conversión real — el usuario llega al producto.

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–6 completadas y verificadas. Avanzamos a la **Fase 7**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

Esta fase tiene 4 piezas. Trátalas como 4 sub-specs dentro de la misma SPEC,
pero NO las separes en fases distintas — se construyen juntas porque
HeroTransition depende de ShopCoffee y ambos comparten el mecanismo de
comunicación scroll Hero→Shop.

```
1. ShopCoffee     — sección contenedora: grid de productos + CoffeeQuiz
2. ProductCard    — card de producto con selector de tamaño/precio
3. CoffeeQuiz     — quiz de 3-4 preguntas que recomienda un producto
4. HeroTransition — morph funda kraft (hero) → primera ProductCard
```

---

## Contexto narrativo

El hero termina su scroll con la funda kraft del café. Hasta ahora,
`HeroTransition.tsx` existe como placeholder vacío (Fase 3) y la sección
`#shop` es un párrafo de "en construcción" (Fase 6).

Esta fase cierra el círculo: **la funda del hero se convierte físicamente
en la primera ProductCard del catálogo**. Es el momento de mayor intención
de compra de toda la página — el usuario pasó por taza → granos → funda,
y ahora la funda *es* el producto que puede comprar.

Después del morph, el usuario ve 3 productos. Si no sabe cuál elegir,
el CoffeeQuiz lo guía con 3-4 preguntas simples y le recomienda uno.

---

## Decisiones de diseño ya tomadas — respetar sin cambiar

1. **3 productos** en el grid del home (catálogo completo queda para una
   página `/tienda` futura — fuera de alcance de esta fase, ver SPEC 7G).
2. **ProductCard** tiene: imagen, nombre, info (origen/notas), selector de
   tamaño (250g/500g/1kg) **y el precio cambia visiblemente según el tamaño
   seleccionado** (ej: $8 / $14 / $24).
3. **CoffeeQuiz:** 3-4 preguntas (intensidad, momento del día, método de
   preparación) → recomienda 1 producto → hace scroll/highlight a esa card.
4. **HeroTransition:** versión completa — un elemento HTML que imita la
   funda kraft del hero, hace zoom out y se convierte visualmente en la
   primera ProductCard del grid (posición fija, siempre la card 1).
5. **Catálogo completo (`/tienda`):** fuera de alcance. El CTA "Ver catálogo
   completo" apunta a una ruta placeholder — documentar como pendiente.

---

## Lo que ya existe — no reconstruir

Del HANDOFF.md:

```
src/types/index.ts          ← ya define Product, ProductSize, Review, Location, Award
                               REVISAR estos tipos antes de definir nuevos —
                               si Product y ProductSize ya cubren lo necesario,
                               extenderlos, no duplicarlos.

src/components/sections/HeroScroll/
  HeroTransition.tsx         ← placeholder vacío — esta fase lo completa
  useHeroTransition.ts       ← hook placeholder — esta fase lo completa
  index.tsx                  ← orquestador del hero, ya tiene 3 modos (scrub/loop/static)

src/components/ui/Button.tsx ← 6 variantes ya definidas:
  primary / secondary / ghost / ghost-light / inverse / link
  Usar estas, no crear variantes nuevas salvo necesidad real justificada.
```

**Antes de escribir la SPEC**, lee `src/types/index.ts`, `HeroTransition.tsx`,
`useHeroTransition.ts` y el `index.tsx` del HeroScroll completo para entender
el placeholder existente y no romper los 3 modos (scrub/loop/static).

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De Fase 6 (flip cards):**
- `card-inner` con `transform-style: preserve-3d` NO debe tener
  `overflow: hidden` — va en `card-face`. Si ProductCard usa algún
  efecto 3D (no es el caso por defecto, pero si lo consideras), aplica esto.
- `aria-expanded` no es válido en `<article>` — usar `aria-hidden` en hijos.
- Touch detection: `useState(() => window.matchMedia('(hover: none)').matches)`
  como lazy initializer, nunca en `useEffect`.
- `prefers-reduced-motion`: mata transiciones a `0.01ms` via override global,
  no condicionales por componente — reutilizar este patrón si aplica.

**De Fase 5 (canvas scrub) — relevante para HeroTransition:**
- GSAP cleanup: `gsap.context()` + `ctx.revert()` siempre.
- `framesRef` pattern si hay estado asincrónico que el ScrollTrigger necesita leer.
- `ResizeObserver` si el elemento de transición depende de dimensiones del DOM.
- `saveData` guard si HeroTransition usa cualquier asset pesado adicional.

**De Fase 3 (hero) — coordinación crítica:**
- El hero usa `IntersectionObserver threshold: 0` (no 0.5) para comunicarse
  con el Navbar. El mismo principio aplica para que HeroTransition sepa
  cuándo activar el morph: el trigger no puede depender de un threshold alto.
- GSAP dynamic import siempre dentro de `useEffect`, nunca top-level.
- El hero tiene 3 modos: `scrub` (desktop), `loop` (mobile video), `static`
  (reduced-motion/saveData/no-JS). **HeroTransition debe funcionar — o degradar
  con gracia — en los 3 modos.** Define explícitamente qué pasa en cada uno.

**Tailwind v4:**
- Sin `tailwind.config.ts`. Tokens nuevos en `globals.css @theme {}` / `@utility`.
- Sin valores arbitrarios `[]`.

---

## SPEC — lo que necesito ANTES de que escribas código

---

### SPEC 7A — Arquitectura de archivos (las 4 piezas)

Lista exacta de archivos a crear/modificar. Para cada uno:
ruta, responsabilidad, Server vs. Client, y por qué.

```
src/components/sections/ShopCoffee/
  index.tsx                — [Server|Client] — razón
  ProductGrid.tsx           — [Server|Client] — razón
  CoffeeQuiz/
    index.tsx               — razón
    QuizQuestion.tsx         — razón
    useQuizLogic.ts          — hook de scoring/recomendación
    questions.ts             — data de preguntas
    types.ts
  types.ts                  — tipos locales de la sección

src/components/sections/ShopCoffee/ProductCard/
  index.tsx                 — razón
  SizeSelector.tsx          — razón
  types.ts (¿o reusa src/types/index.ts?)

src/components/sections/HeroScroll/
  HeroTransition.tsx        — completar (archivo ya existe como placeholder)
  useHeroTransition.ts      — completar (hook ya existe como placeholder)

src/data/
  products.ts               — PRODUCTS: Product[] (3 productos)
```

Preguntas a responder:
1. ¿`ProductCard` vive dentro de `ShopCoffee/` o en `components/ui/` /
   `components/product/` por si se reutiliza en la futura página `/tienda`?
   Considera reusabilidad vs. cohesión de la fase.
2. `CoffeeQuiz` tiene estado (respuestas, paso actual) — ¿toda la subcarpeta
   es `'use client'` o solo el componente con el estado?
3. `HeroTransition` necesita leer el estado de scroll del Hero Y conocer
   la posición/dimensiones de la primera ProductCard en `ShopCoffee`.
   Dos secciones distintas del DOM necesitan coordinarse — ¿cómo?
   (Opciones: refs compartidas vía contexto, medición por `getBoundingClientRect`
   dentro del mismo ScrollTrigger, CSS custom properties globales, etc.)
   Define el mecanismo exacto.

### SPEC 7B — Tipos y contratos

**Primero:** confirma qué define ya `src/types/index.ts` para `Product` y
`ProductSize`. Si ya cubre nombre, precio, tamaños, imagen — extiende esos
tipos. No los reemplaces sin justificar.

```typescript
// Si Product/ProductSize necesitan campos nuevos para esta fase:
interface Product {
  id: string
  name: string
  // origen, notas de cata, tags?
  sizes: ProductSize[]
  defaultSizeId: string  // ¿cuál tamaño viene seleccionado por defecto?
  placeholderColor: string  // mientras no hay imagen real
  imageAlt: string
}

interface ProductSize {
  id: string        // '250g' | '500g' | '1kg'
  label: string      // '250 g'
  price: number       // en USD
}

// CoffeeQuiz
interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

interface QuizOption {
  label: string
  // ¿cómo se mapea cada opción a un producto recomendado?
  // ¿sistema de puntos por producto, o mapeo directo pregunta→producto?
}

interface QuizResult {
  productId: string
  // ¿algún mensaje personalizado de resultado?
}

// HeroTransition
interface HeroTransitionConfig {
  // ¿qué necesita? targetProductId, ¿selector del DOM target?
}
```

Define el sistema de scoring del quiz exactamente:
- ¿Cada opción suma puntos a uno o más productos, y el de mayor puntaje gana?
- ¿O hay un árbol de decisión directo (pregunta 1 → si responde X, pregunta 2
  ya filtra a 2 productos posibles)?
- Define el algoritmo completo con un ejemplo de las 3-4 preguntas y cómo
  cada combinación de respuestas mapea a uno de los 3 productos.

### SPEC 7C — Contenido: los 3 productos

Propón el catálogo completo en español. Tono: premium, sensorial, concreto
(consistente con OriginStory y ExperienceCards — sin clichés).

```typescript
const PRODUCTS: Product[] = [
  {
    id: '',
    name: '',              // font-display — nombre del blend/origen
    origin: '',            // región específica
    tastingNotes: '',       // 2-3 notas de cata concretas (ej: "Cacao, panela, cítrico")
    intensity: '',          // para el quiz: 'suave' | 'medio' | 'intenso'
    description: '',         // 1-2 oraciones
    sizes: [
      { id: '250g', label: '250 g', price: 0 },
      { id: '500g', label: '500 g', price: 0 },
      { id: '1kg',  label: '1 kg',  price: 0 },
    ],
    defaultSizeId: '250g',
    placeholderColor: '',   // token del design system, distinto por producto
    imageAlt: '',
  },
  // producto 2, 3
]
```

Define precios reales y coherentes (ej: 250g=$8, 500g=$14, 1kg=$24 — o tu
propia escala). Los 3 productos deben diferenciarse claramente en intensidad
y notas, para que el CoffeeQuiz tenga sentido (necesitas variedad real para
recomendar distinto según las respuestas).

**Recomendación de imagen real para cuando lleguen los assets** — incluye
como comentario junto a cada producto qué fotografía quedaría mejor
(ej: funda kraft cerrada sobre fondo neutro, granos esparcidos, taza servida).

### SPEC 7D — ProductCard: diseño y selector de tamaño/precio

Define la composición visual completa:

```
┌─────────────────────────┐
│                         │
│   [imagen/placeholder]   │
│                         │
│  [nombre font-display]   │
│  [origen + notas]        │
│                         │
│  [SizeSelector]          │
│  [precio dinámico]       │
│  [CTA — Button variant]  │
└─────────────────────────┘
```

1. **SizeSelector:** ¿3 botones/chips (250g | 500g | 1kg) o un dropdown?
   Considera el estilo "Chips/Tags" del DESIGN.md (pill-shaped, sand bg,
   espresso text) para los tamaños — ¿se ajusta o necesitas otro patrón?
2. **Estado del tamaño seleccionado:** `useState` local en cada ProductCard.
   ¿Cuál tamaño viene seleccionado por defecto? (`defaultSizeId` del producto)
3. **Precio dinámico:** al cambiar tamaño, el precio se actualiza.
   ¿Hay alguna transición/animación en el cambio de precio (fade, o instantáneo)?
4. **CTA:** "Agregar al carrito" — pero el carrito no existe todavía
   (Zustand está "pendiente" en el stack). ¿Qué hace el CTA en esta fase?
   Opciones:
   - Botón funcional con estado local "Agregado ✓" temporal (sin persistencia)
   - Botón deshabilitado/placeholder con tooltip "Próximamente"
   - CTA que simplemente es un link a `/tienda` (placeholder de ruta)
   Define cuál y justifica — no sobre-construir funcionalidad de carrito
   que no está en el roadmap de esta fase.
5. **Tags de origen/notas:** ¿chips visuales (estilo DESIGN.md) o texto plano
   `text-label-md uppercase`?
6. Layout responsive: ¿grid de 3 columnas en desktop, cómo se ve en mobile
   (1 columna, cards apiladas)?
7. ¿La ProductCard 1 (la que recibe el morph de HeroTransition) necesita
   algún `id` o `data-attribute` específico para que HeroTransition la
   pueda referenciar/medir?

### SPEC 7E — CoffeeQuiz: mecánica completa

1. **Ubicación:** ¿el quiz va arriba del grid de productos, debajo, o
   en un modal/drawer que se abre con un botón ("Encuentra tu café ideal")?
   (Definido: no es overlay separado — debe ser inline o accesible sin modal,
   confirma la posición exacta en el layout de ShopCoffee).

2. **Flujo de preguntas:**
   - ¿Las 3-4 preguntas se muestran una a la vez (wizard, con "Siguiente"),
     o todas visibles a la vez?
   - Si es wizard: ¿hay indicador de progreso (1/4, 2/4...)?
   - ¿Se puede volver atrás/cambiar respuestas antes de ver el resultado?

3. **Las preguntas exactas** (propón las 3-4, con sus opciones):
   ```typescript
   const QUIZ_QUESTIONS: QuizQuestion[] = [
     {
       id: 'momento',
       question: '¿Cuándo tomas tu café?',
       options: [
         { label: 'Primera hora de la mañana', /* mapeo */ },
         { label: 'Después del almuerzo', /* mapeo */ },
         // ...
       ],
     },
     // pregunta 2: intensidad
     // pregunta 3: método de preparación
     // pregunta 4 (opcional): ¿algo más?
   ]
   ```

4. **Resultado:**
   - Al terminar, ¿qué se muestra? ¿Un mensaje breve + scroll automático
     a la ProductCard recomendada, o la card se resalta con algún efecto
     (border, glow, scale) sin scroll si ya está visible?
   - ¿Cómo se ve el "highlight"? Define: color de borde/sombra, duración,
     si hace `scrollIntoView` con `behavior: 'smooth'`.
   - ¿El usuario puede reiniciar el quiz? ¿Botón "Volver a intentar"?

5. **`prefers-reduced-motion`:**
   - Sin `scrollIntoView` smooth → `behavior: 'auto'` o sin scroll, solo highlight estático.
   - Sin animación de transición entre preguntas del wizard.

6. **Accesibilidad del quiz:**
   - ¿Cada pregunta es un `<fieldset>` con `<legend>`? ¿Las opciones son
     radio buttons estilizados o botones con `aria-pressed`?
   - El resultado y el highlight de la card — ¿se anuncia con
     `aria-live="polite"` para screen readers?

### SPEC 7F — HeroTransition: mecánica completa

Esta es la pieza más técnica. Sé exhaustivo.

1. **Trigger — ¿cuándo empieza el morph?**
   El HANDOFF dice: "Al llegar al 90% del scroll del hero, la funda kraft
   hace zoom out y se convierte en la primera ProductCard."
   - ¿Es parte del mismo ScrollTrigger/timeline del hero (`useHeroScrub`),
     o un ScrollTrigger independiente que vive en `HeroTransition.tsx`?
   - Define el rango exacto de scroll: ¿"90%-100% del hero" significa
     `start: '90% top'` relativo al trigger del hero, o un nuevo trigger
     que empieza donde termina el hero y termina cuando ShopCoffee es visible?

2. **El elemento que se anima — "imita la funda":**
   - El HANDOFF dice: "no animar el `<video>`/`<canvas>` directamente —
     crear un elemento HTML independiente que imita la funda."
   - ¿Qué es este elemento? Un `<div>` con `placeholderColor` (color sólido
     que imita la funda kraft, ej: `bg-surface-low` o `#f6f3f2`) y
     dimensiones/posición que coinciden con el frame final del hero canvas.
   - ¿Cómo se posiciona inicialmente para que parezca continuación visual
     del canvas del hero? (position: fixed/absolute, top/left/width/height
     calculados o aproximados con tokens)

3. **El morph — de "funda" a "card":**
   - Define la animación paso a paso: posición inicial (centrada, tamaño
     grande, imitando la funda) → posición final (coincide exactamente con
     `getBoundingClientRect()` de la primera ProductCard en ShopCoffee).
   - ¿Qué propiedades anima GSAP? (width, height, top, left, borderRadius,
     opacity de contenido interno)
   - ¿Hay un crossfade al final donde el elemento de transición desaparece
     y la ProductCard real (con su contenido — imagen, precio, CTA) se revela?
     Define el timing exacto de ese crossfade.

4. **Medición de la ProductCard destino:**
   - ¿Cómo obtiene `HeroTransition` las coordenadas de la primera ProductCard?
     `getBoundingClientRect()` en un ref compartido — ¿cómo se comparte la
     ref entre `HeroScroll` (donde vive `HeroTransition`) y `ShopCoffee`
     (donde vive la ProductCard)?
   - ¿Qué pasa si la ProductCard cambia de posición por resize?
     `ResizeObserver` (patrón ya usado en OriginStory) — recalcular.

5. **Coordinación con los 3 modos del Hero:**
   - **Modo `scrub` (desktop):** el morph ocurre durante el scroll, como se describe arriba.
   - **Modo `loop` (mobile, video autoplay):** ¿el morph también ocurre
     por scroll (el video sigue de fondo pero el morph es independiente),
     o se simplifica a un fade-in directo de ShopCoffee sin morph elaborado?
   - **Modo `static` (reduced-motion/saveData/no-JS):** sin morph — ¿qué
     ve el usuario? (transición simple: el hero termina, ShopCoffee aparece
     directamente sin efecto)
   - Justifica cada decisión — recuerda que el morph elaborado es un
     "nice to have" en desktop con motion, no un requisito en todos los modos.

6. **z-index y layout durante el morph:**
   - El elemento de transición probablemente necesita `position: fixed`
     con un z-index alto mientras se anima (¿`z-raised`? ¿necesitas un
     z-index nuevo, ej: `z-transition`?).
   - ¿Cómo evitas que el elemento de transición tape el Navbar (`z-sticky: 30`)
     o quede atrás de él incorrectamente?

7. **Cleanup y performance:**
   - Patrón GSAP: `gsap.context()` + `ctx.revert()`.
   - `framesRef`-equivalent si necesitas leer refs actualizadas dentro del
     ScrollTrigger sin re-registrar.
   - `saveData`: si el morph es puramente CSS/GSAP (sin assets pesados nuevos),
     ¿necesita guard `saveData`? Probablemente no — confirma.

### SPEC 7G — Layout y composición de ShopCoffee

```
┌─────────────────────────────────────┐
│  [SectionTitle / eyebrow]            │
│  [CoffeeQuiz — posición definida en 7E] │
│                                       │
│  [ProductCard 1] [ProductCard 2] [ProductCard 3] │
│                                       │
│  [CTA "Ver catálogo completo" → /tienda placeholder] │
└─────────────────────────────────────┘
```

1. ¿`id="shop"` se mantiene (ya está en el placeholder actual)?
2. ¿`SectionTitle` component (ya existe de Fase 1) se usa aquí? ¿Con qué
   eyebrow/headline/tamaño?
3. Grid de productos: ¿`grid-cols-3` en desktop, `grid-cols-1` en mobile,
   `grid-cols-2`(?) en tablet — o se ve mejor 1 columna en tablet también
   dado que cada card tiene más contenido (selector + precio)?
4. Gap entre cards — ¿reusa `gap-4` de ExperienceCards o necesita más espacio
   dado que ProductCard tiene más contenido?
5. **CTA "Ver catálogo completo":** define el `href` exacto del placeholder
   (ej: `/tienda` — documentar en HANDOFF que esta ruta no existe aún y
   queda pendiente para una fase futura no numerada todavía).

### SPEC 7H — Integración con page.tsx

```typescript
export default function HomePage() {
  return (
    <>
      <HeroScroll />           {/* + HeroTransition integrado */}
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />            {/* Fase 7 — reemplaza el placeholder */}
      {/* Fase 8: MenuVisual */}
    </>
  )
}
```

¿Algún cambio necesario en `HeroScroll/index.tsx` para integrar
`HeroTransition` en su orquestación de los 3 modos?

### SPEC 7I — Accesibilidad (las 4 piezas)

1. **ProductCard:**
   - `<article>` por producto, `<h3>` para el nombre (jerarquía h1→h2→h3
     consistente con el resto del home).
   - SizeSelector: si son botones, `aria-pressed` en el seleccionado;
     si son radios, `<fieldset>`+`<legend>` con `name` único por producto.
   - Precio dinámico: ¿`aria-live="polite"` en el contenedor del precio
     para anunciar el cambio al cambiar tamaño?

2. **CoffeeQuiz:**
   - Cubierto en 7E punto 6.

3. **HeroTransition:**
   - El elemento de transición es puramente decorativo durante el morph
     — `aria-hidden="true"`.
   - Verificar que el contenido real de la ProductCard 1 sea accesible
     normalmente (no quede oculto/duplicado para screen readers durante
     o después del morph).

4. **Jerarquía de headings global del home (actualizada):**
   `h1` (hero) → `h2` secciones (TrustBar n/a, OriginStory sr-only,
   ExperienceCards sr-only, **ShopCoffee — ¿sr-only o visible?**) →
   `h3` (beats/cards/productos).

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Confirmación de qué ya existe en `src/types/index.ts` y qué se extiende
- [ ] Arquitectura de archivos completa para las 4 piezas, Server/Client justificado
- [ ] Mecanismo de coordinación HeroScroll↔ShopCoffee definido concretamente
- [ ] Tipos completos: `Product`, `ProductSize`, `QuizQuestion`, scoring algorithm
- [ ] Catálogo de 3 productos con copywriting real, precios y diferenciación
      suficiente para que el quiz tenga sentido
- [ ] ProductCard: SizeSelector + precio dinámico + decisión sobre el CTA
      (sin sobre-construir carrito)
- [ ] CoffeeQuiz: preguntas reales, flujo (wizard/todas visibles), algoritmo
      de recomendación, highlight/scroll al resultado
- [ ] HeroTransition: trigger, elemento "funda", morph paso a paso, medición
      de la card destino, comportamiento en los 3 modos del hero
- [ ] z-index del elemento de transición definido sin conflictos con Navbar
- [ ] Layout de ShopCoffee con CTA a `/tienda` (placeholder documentado)
- [ ] Accesibilidad completa de las 4 piezas
- [ ] `prefers-reduced-motion` cubierto en quiz y transición

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1   src/types/index.ts              ← extender Product/ProductSize si aplica
Paso 2   src/data/products.ts            ← PRODUCTS: Product[] (3 productos)
Paso 3   ShopCoffee/types.ts             ← tipos locales de la sección
Paso 4   ProductCard/SizeSelector.tsx    ← selector aislado, sin precio aún
Paso 5   ProductCard/index.tsx           ← card completa con precio dinámico
Paso 6   ProductGrid.tsx                 ← grid de 3 ProductCards
Paso 7   CoffeeQuiz/questions.ts         ← data de preguntas
Paso 8   CoffeeQuiz/useQuizLogic.ts      ← scoring + recomendación, sin UI
Paso 9   CoffeeQuiz/QuizQuestion.tsx     ← UI de una pregunta
Paso 10  CoffeeQuiz/index.tsx            ← wizard completo + resultado + highlight
Paso 11  ShopCoffee/index.tsx            ← compone quiz + grid + CTA, integra en page.tsx
Paso 12  HeroTransition.tsx + useHeroTransition.ts  ← morph completo
Paso 13  HeroScroll/index.tsx            ← integrar HeroTransition en los 3 modos
```

Reglas del BUILD:
- `npx tsc --noEmit` limpio después de cada paso.
- Pasos 1-11 (ShopCoffee completo) pueden verificarse visualmente de forma
  independiente antes de tocar HeroTransition (pasos 12-13) — confirma
  que el grid + quiz funcionan solos primero.
- HeroTransition es el trabajo más arriesgado — si durante el BUILD surge
  un problema de coordinación entre componentes que la SPEC no previó,
  detente y notifica antes de improvisar.
- Tokens nuevos (`z-transition`, colores de productos, etc.) documentar
  en HANDOFF.md sección 6 al final.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 7 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**ProductCard:**
- [ ] 3 productos visibles con datos reales (no Lorem ipsum)
- [ ] SizeSelector cambia el tamaño seleccionado visualmente
- [ ] Precio se actualiza correctamente al cambiar tamaño
- [ ] CTA funciona según lo definido en SPEC 7D (sin error de carrito inexistente)
- [ ] Responsive: grid correcto en desktop/tablet/mobile

**CoffeeQuiz:**
- [ ] Las 3-4 preguntas se muestran según el flujo definido
- [ ] Cada combinación de respuestas recomienda un producto coherente
- [ ] Highlight/scroll a la card recomendada funciona
- [ ] Reinicio del quiz funciona (si se especificó)
- [ ] reduced-motion: sin scroll smooth, highlight estático

**HeroTransition:**
- [ ] Desktop (modo scrub): morph visible al llegar al final del hero
- [ ] El elemento de transición termina alineado con la ProductCard 1 real
- [ ] Crossfade hacia el contenido real de la card sin parpadeos
- [ ] Mobile (modo loop): comportamiento definido en spec funciona
- [ ] reduced-motion/saveData (modo static): sin morph, transición simple
- [ ] z-index correcto: no tapa ni queda detrás del Navbar incorrectamente
- [ ] GSAP cleanup verificado (ctx.revert(), sin memory leaks)
- [ ] ResizeObserver actualiza posición destino si la ventana cambia de tamaño

**Accesibilidad:**
- [ ] Jerarquía de headings correcta (h2 ShopCoffee, h3 productos)
- [ ] SizeSelector accesible por teclado con aria-pressed o fieldset/legend
- [ ] aria-live en cambios de precio (si se especificó)
- [ ] Quiz: fieldset/legend, aria-live en resultado
- [ ] HeroTransition: aria-hidden en elemento decorativo, contenido real
      de la card 1 sigue siendo accesible normalmente

**Tokens nuevos en HANDOFF.md sección 6:**
- [ ] Lista de tokens/utilities nuevos (z-transition, colores de productos, etc.)

**Ruta /tienda:**
- [ ] CTA "Ver catálogo completo" presente y documentado como placeholder
      pendiente de página futura
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 7 → ✅ en la tabla de verificación
- Tipos `Product`/`ProductSize` finales (si se extendieron) → sección de tipos
- Mecanismo de coordinación HeroScroll↔ShopCoffee → nueva sección dedicada,
  detallada (es el patrón más complejo del proyecto hasta ahora)
- Algoritmo de scoring del CoffeeQuiz → documentar con ejemplo
- Tokens nuevos → sección 6
- Bugs encontrados y resolución → sección de bugs
- Decisiones de diseño nuevas → sección de decisiones
- **Pendiente registrado:** página `/tienda` con catálogo completo —
  agregar como ítem al roadmap (sin número de fase asignado todavía,
  o renumerar fases 8-14 si se decide insertarla)
- Fase siguiente → **Fase 8 — MenuVisual**

---

Empieza con la SPEC completa.
Responde cada sección (7A hasta 7I) antes de escribir código.
Si necesitas leer `src/types/index.ts`, `HeroTransition.tsx`,
`useHeroTransition.ts` o `HeroScroll/index.tsx` para fundamentar la SPEC,
hazlo antes de responder.
