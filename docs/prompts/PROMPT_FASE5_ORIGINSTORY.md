# Fase 5 — OriginStory (Parallax de imágenes + narrativa de valores)
# Sección editorial de marca — la más narrativa del home después del hero
# NOTA: Este prompt fue reemplazado por PROMPT_FASE5_ORIGINSTORY_CON_CAMBIOS.md
# La implementación final usa canvas frame scrub (no parallax estático).

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–4 completadas y verificadas. Avanzamos a la **Fase 5 — OriginStory**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto narrativo

OriginStory es donde Coffee Relief explica **quién es y qué cree**.
No es un slider de marketing. Es una declaración editorial de 4 valores,
presentada con calma, una imagen por beat, con texto que permanece
anclado mientras las imágenes se mueven ligeramente al scroll.

La narrativa tiene 4 beats en orden:

```
Beat 1 — Origen
Beat 2 — Selección
Beat 3 — Tueste en origen
Beat 4 — Comercio directo
```

El efecto visual: el texto de cada beat está fijo en su posición,
y la imagen de fondo (o imagen lateral) se desplaza verticalmente
a una velocidad menor que el scroll — efecto parallax clásico.

Esto contrasta intencionalmente con el hero (intenso, 300vh, controlado):
aquí el usuario simplemente scrollea a su ritmo natural y las imágenes
acompañan con suavidad.

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De la Fase 4 (marquee):**
- `flex w-max` dentro de `overflow:hidden` no computa el ancho correctamente
  en todos los browsers. Usar `inline-flex` para contenedores de ancho natural.
- Si usas cualquier contenedor con `overflow:hidden` en esta sección,
  verifica que los hijos tengan el ancho correcto antes de implementar.

**De la Fase 3 (hero):**
- `IntersectionObserver` con `threshold` alto falla en secciones muy altas.
  Si usas IntersectionObserver para entrance animations, usar `threshold: 0`
  o `threshold: 0.1` — nunca `0.5` en secciones de altura variable.
- GSAP cleanup obligatorio: siempre `ctx.revert()` en el return del useEffect.

**Tailwind v4:**
- No existe `tailwind.config.ts`. Tokens nuevos van en `globals.css @theme {}`.
- Sin valores arbitrarios `[]` en className. Si no existe el token, se crea.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 5A — Arquitectura de archivos

Lista exacta de archivos a crear. Para cada uno:
ruta, responsabilidad, Server vs. Client Component, y por qué.

La sección tiene parallax (requiere scroll listener o GSAP) — eso implica
`'use client'`. Pero el texto y la estructura pueden ser estáticos.
¿Cómo divides Server y Client para minimizar el bundle?

Formato esperado:
```
src/components/sections/OriginStory/
  index.tsx          — [Server|Client] — razón
  OriginBeat.tsx     — [Server|Client] — razón
  ParallaxImage.tsx  — [Server|Client] — razón
  types.ts           — tipos locales
  data.ts (o /data/originStory.ts) — datos de los 4 beats
```

¿Necesita barrel export en `sections/index.ts`?

### SPEC 5B — Tipos y contratos

Define los tipos completos antes de implementar:

```typescript
interface OriginBeat {
  id: string
  // ¿qué más? eyebrow, headline, body, imagen, ¿posición de imagen?
}

interface ParallaxImageProps {
  // ¿qué recibe? src, alt, ¿velocidad de parallax configurable?
  // ¿cómo se tipan los valores de parallax?
}

interface OriginStoryProps {
  // ¿props externos o datos hardcodeados?
}
```

### SPEC 5C — Contenido de los 4 beats

Propón el copywriting completo en español para cada beat.
Sigue la jerarquía tipográfica del design system:

```typescript
const ORIGIN_BEATS: OriginBeat[] = [
  {
    id: 'origen',
    eyebrow: '',        // text-label-md uppercase — máx 3 palabras
    headline: '',       // font-display text-headline-md — máx 6 palabras
    body: '',           // font-sans text-body-lg — 2–3 oraciones, sensorial y concreto
    image: '',          // path en /public/images/ — placeholder si no existe el asset
    imageAlt: '',       // descripción real para screen readers
  },
  // beat 2: Selección
  // beat 3: Tueste en origen
  // beat 4: Comercio directo
]
```

Tono: premium, sensorial, concreto. Evitar clichés de marketing ("pasión",
"calidad", "compromiso"). Preferir imágenes mentales específicas:
altitud, temperatura, nombre de la región, el gesto de tostar.

### SPEC 5D — Layout y composición visual

La sección tiene texto fijo e imágenes con parallax.
Define la composición exacta para desktop y mobile:

**Desktop:**
¿Cómo se distribuyen texto e imagen en cada beat?
Elige una de estas opciones y justifica:

```
Opción A — Asimétrico fijo:
  [imagen 7 cols] [texto 5 cols] — todos los beats igual
  o [texto 5 cols] [imagen 7 cols] — alternado beat a beat

Opción B — Imagen de fondo full-width:
  Imagen ocupa el ancho completo con overlay oscuro
  Texto centrado o a un lado encima de la imagen

Opción C — Imagen lateral sticky:
  Imagen sticky a un lado mientras el texto scrollea
  (similar a Apple product pages)
```

Define:
1. ¿Cuál opción usas y por qué encaja con la identidad editorial de la marca?
2. ¿Cuánto espacio vertical ocupa cada beat? (múltiplo de `py-section` = 120px)
3. ¿Los beats están separados visualmente (línea, espacio) o fluyen continuos?
4. ¿El texto tiene `max-w-prose` (680px) para legibilidad?

**Mobile:**
1. ¿La imagen va arriba del texto o abajo?
2. ¿El parallax se desactiva en mobile? (recomendado — parallax en touch es errático)
3. ¿Qué padding lateral usa? (`px-margin-m` = 20px)

### SPEC 5E — Mecanismo de parallax

Define exactamente cómo implementas el efecto:

1. ¿GSAP ScrollTrigger con `scrub` por beat, o un solo listener
   de scroll que calcula el offset de cada imagen?

2. ¿Cuánto se desplaza la imagen respecto al scroll?
   Define el factor de parallax: si el usuario scrollea 100px,
   la imagen se mueve X px. ¿Cuál es X? (valores típicos: 0.1–0.3)
   Un factor más alto = efecto más dramático.

3. ¿La imagen se mueve en `translateY` o en `backgroundPositionY`?
   - `translateY` en un `<div>` con `overflow:hidden`: más performante,
     usa GPU, compatible con `will-change: transform`.
   - `backgroundPositionY`: más simple pero menos control.
   Define cuál y por qué.

4. ¿Usas `will-change: transform` en las imágenes? ¿En cuáles?
   (No abusar — solo en elementos que realmente animan)

5. ¿Cómo haces cleanup de los ScrollTriggers?
   Muéstrame el patrón exacto (debe usar `gsap.context` como en el Hero):
   ```typescript
   useEffect(() => {
     const ctx = gsap.context(() => { ... }, containerRef)
     return () => ctx.revert()
   }, [])
   ```

6. ¿El parallax se inicializa solo cuando la sección entra en viewport,
   o desde el mount del componente?

### SPEC 5F — Imágenes: assets y fallbacks

Los assets reales de Coffee Relief pueden no existir aún.
Define la estrategia:

1. ¿Usas `next/image` con `fill` + contenedor de dimensiones fijas,
   o `width`/`height` explícitos?
   Para parallax con `translateY`, el contenedor necesita `overflow:hidden`
   y la imagen necesita `scale(1.2)` inicial para tener margen de movimiento
   sin revelar bordes blancos. ¿Cómo manejas esto?

2. Placeholders mientras no hay assets reales:
   ¿`/public/images/placeholder-beat-1.jpg` con imagen de stock,
   o un `<div>` con color sólido del design system?
   Define qué color usa el placeholder de cada beat:
   - Origen: `bg-surface-high` o `bg-primary-container`?
   - Selección: ¿?
   - Tueste: ¿?
   - Comercio directo: ¿?

3. ¿Cuál es el `sizes` attribute de cada `next/image`?
   (Importante para performance — define el ancho real que ocupa la imagen)

4. ¿Alguna imagen tiene `priority={true}`?
   (Solo la primera above-the-fold — ¿el Beat 1 es visible sin scroll?)

### SPEC 5G — Entrance animations

Cuando cada beat entra en viewport (no parallax — aparición inicial):
¿Hay una animación de entrada para el texto?

Opciones:
```
A — Sin entrada: el texto aparece directamente (la sección ya es tranquila)
B — Fade-up sutil: opacity 0→1 + translateY 20px→0 al entrar en viewport
C — Stagger: eyebrow → headline → body aparecen con delay entre sí
```

1. ¿Cuál eliges y por qué?
2. Si hay animación: ¿Framer Motion `whileInView` o GSAP ScrollTrigger?
   Considera que GSAP ya está cargado para el parallax —
   reutilizarlo evita cargar Framer Motion en este componente.
3. `prefers-reduced-motion`: sin animación de entrada, sin parallax.
   ¿Cómo se ve la sección en modo estático?

### SPEC 5H — Accesibilidad

1. ¿Qué elemento semántico envuelve la sección? (`<section aria-labelledby="...">`)
2. ¿El `id` del headline de la sección se usa como `aria-labelledby`?
3. Las imágenes con parallax tienen `role="presentation"` o `alt` descriptivo?
   (Si la imagen es decorativa/atmosférica → `alt=""` + `role="presentation"`)
4. ¿La jerarquía de headings es correcta?
   En el home: `<h1>` es el hero. OriginStory debe usar `<h2>` para el título
   de sección y `<h3>` para los headlines de cada beat — ¿o diferente?
5. ¿El contraste texto/imagen cumple WCAG AA en los beats con imagen de fondo?
   Si el texto va sobre imagen: define el overlay (color, opacidad) que
   garantiza contraste mínimo 4.5:1.

### SPEC 5I — Integración en page.tsx

Muéstrame cómo queda `src/app/page.tsx` después de esta fase:

```typescript
export default function HomePage() {
  return (
    <main>
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      {/* Fase 6: ExperienceCards */}
      {/* ... */}
    </main>
  )
}
```

¿La sección necesita `id="origin"` para navegación anchor?

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Arquitectura Server/Client justificada
- [ ] Tipos TypeScript completos sin TODOs
- [ ] Copywriting real de los 4 beats en español (no "Lorem ipsum")
- [ ] Layout elegido (A, B o C) con justificación
- [ ] Factor de parallax definido con valor numérico
- [ ] `translateY` vs `backgroundPositionY` definido con justificación
- [ ] Patrón de cleanup GSAP con `gsap.context`
- [ ] Estrategia de imágenes placeholder definida
- [ ] `scale(1.2)` inicial en imágenes para evitar bordes blancos confirmado
- [ ] Entrance animation elegida con justificación
- [ ] Accesibilidad: jerarquía de headings, aria-labelledby, alt texts
- [ ] `prefers-reduced-motion`: comportamiento sin parallax ni entrada definido

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1  src/data/originStory.ts (o data.ts local)    ← datos + copywriting
Paso 2  src/components/sections/OriginStory/types.ts  ← tipos del componente
Paso 3  ParallaxImage.tsx                             ← solo la imagen con parallax
Paso 4  OriginBeat.tsx                                ← un beat: texto + imagen
Paso 5  OriginStory/index.tsx                         ← compone los 4 beats
Paso 6  src/app/page.tsx                              ← integrar OriginStory
```

Reglas del BUILD:
- Confirma TypeScript limpio después de cada paso antes de continuar.
- Si necesitas un token nuevo, agrégalo a `globals.css @theme` y anótalo.
- No mezcles lógica de parallax con lógica de entrada — hooks o efectos separados.
- El componente `ParallaxImage` debe funcionar de forma aislada:
  recibe `src`, `alt`, y `parallaxFactor`, y maneja su propio ScrollTrigger.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 5 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Visual confirmado:**
- [ ] Desktop: 4 beats visibles con imagen y texto correctamente compuestos
- [ ] Desktop: el parallax es visible y suave al scrollear
- [ ] Desktop: las imágenes no revelan bordes blancos en ningún punto del scroll
- [ ] Desktop: entrance animation funciona (si se especificó)
- [ ] Mobile: parallax desactivado, layout apilado imagen/texto
- [ ] Mobile: padding y tipografía correctos
- [ ] reduced-motion: sección estática, sin parallax ni entrada animada
- [ ] Jerarquía de headings correcta (h2 sección, h3 beats)
- [ ] Imágenes con alt correcto o aria-hidden si decorativas
- [ ] No hay errores ni warnings en consola del browser
- [ ] No hay memory leaks (ScrollTrigger cleanup verificado)
- [ ] No hay layout shift (CLS = 0) al cargar la sección

**Performance:**
- [ ] Solo la imagen del Beat 1 tiene priority={true} (si es above-the-fold)
- [ ] will-change: transform solo en imágenes que animan
- [ ] GSAP no se importa globalmente — solo dentro del componente
- [ ] Sin valores arbitrarios [] en ningún className

**Tokens nuevos agregados a globals.css (si aplica):**
- [ ] Ninguno / Lista de tokens agregados
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 5 → ✅ en la tabla de verificación (sección 11)
- Cualquier bug encontrado y su resolución → sección 13
- Cualquier decisión de diseño relevante → sección 14
- Tokens nuevos → sección 6
- Fase siguiente → **Fase 6 — ExperienceCards**

---

Empieza con la SPEC completa.
Responde cada sección (5A hasta 5I) antes de escribir código.
