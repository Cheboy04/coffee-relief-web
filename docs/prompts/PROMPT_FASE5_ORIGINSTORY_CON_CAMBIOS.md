# Fase 5 — OriginStory (Canvas Frame Scrub × 4 beats)
# Mismo lenguaje visual del hero — scroll controla frames en canvas
# Esta es la versión FINAL usada para la implementación real.

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–4 completadas y verificadas. Avanzamos a la **Fase 5 — OriginStory**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Decisión de diseño: canvas frame scrub

En lugar de parallax estático, cada beat usa la misma técnica del hero:
**el scroll del usuario controla qué frame se muestra en un `<canvas>`**.

Cada beat tiene su propio video corto (3–8s) pre-procesado en frames JPG.
El usuario extrae los frames manualmente con una herramienta externa.
La convención de naming que debes asumir es:

```
/public/images/origin/
  beat-1-origen/
    frame-001.jpg
    frame-002.jpg
    ...
    frame-NNN.jpg     ← N frames, número variable por beat
  beat-2-seleccion/
    frame-001.jpg
    ...
  beat-3-tueste/
    frame-001.jpg
    ...
  beat-4-comercio/
    frame-001.jpg
    ...
```

Mientras los assets reales no existen, el componente usa
**placeholders de color sólido** del design system por beat —
el canvas muestra un `fillRect` con el color del beat.
La arquitectura debe estar lista para recibir los frames reales
sin cambiar nada excepto agregar las imágenes al directorio.

---

## Narrativa de los 4 beats

```
Beat 1 — Origen          (volcán, tierra, altitud)
Beat 2 — Selección       (manos, cereza de café, criterio)
Beat 3 — Tueste en origen (fuego, color, transformación)
Beat 4 — Comercio directo (funda kraft, intercambio, comunidad)
```

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De Fase 4 (marquee):**
- `inline-flex` para contenedores de ancho natural dentro de `overflow:hidden`.
- 3 copias + `calc(-100% / 3)` si usas cualquier loop de contenido.

**De Fase 3 (hero):**
- GSAP cleanup obligatorio: siempre `gsap.context` + `ctx.revert()`.
- `IntersectionObserver threshold: 0.1` máximo en secciones altas.
- Video/canvas no bloquea LCP: mostrar placeholder inmediatamente,
  cargar frames después.

**Tailwind v4:**
- Tokens nuevos en `globals.css @theme {}`. Sin `[]` arbitrarios.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 5A — Arquitectura de archivos

Lista exacta de archivos a crear. Para cada uno:
ruta, responsabilidad, Server vs. Client Component, y por qué.

El canvas requiere refs del DOM y efectos — implica `'use client'`.
Pero el texto de cada beat y la estructura de la sección pueden ser
Server Components que reciben el canvas como child.
¿Cómo divides la frontera Server/Client para minimizar bundle?

Formato esperado:
```
src/components/sections/OriginStory/
  index.tsx              — [Server|Client] — razón
  OriginBeat.tsx         — [Server|Client] — razón
  CanvasScrub.tsx        — [Server|Client] — razón
  useCanvasScrub.ts      — hook — razón
  useFrameLoader.ts      — hook — razón
  types.ts               — tipos locales
src/data/originStory.ts  — datos de los 4 beats
```

### SPEC 5B — Tipos y contratos

Define los tipos TypeScript completos. Sin TODOs.

```typescript
interface BeatConfig {
  id: string
  // ¿qué más necesita cada beat?
  // framesDir, frameCount, eyebrow, headline, body,
  // placeholderColor, scrollHeight?
}

interface CanvasScrubProps {
  // ¿qué recibe? framesDir, frameCount, placeholderColor,
  // ¿scrollProgress externo o lo calcula internamente?
}

// Contrato del hook principal
function useCanvasScrub(
  canvasRef: RefObject<HTMLCanvasElement>,
  config: CanvasScrubConfig
): {
  // ¿qué retorna? isLoading, loadedFrames, currentFrame?
}

// Contrato del hook de carga de frames
function useFrameLoader(
  framesDir: string,
  frameCount: number
): {
  // ¿qué retorna? frames (HTMLImageElement[]), isLoading, progress
}
```

### SPEC 5C — Contenido de los 4 beats

Propón el copywriting completo en español para cada beat:

```typescript
const ORIGIN_BEATS: BeatConfig[] = [
  {
    id: 'origen',
    eyebrow: '',        // text-label-md uppercase — máx 3 palabras
    headline: '',       // font-display text-headline-md — máx 6 palabras
    body: '',           // font-sans text-body-lg — 2–3 oraciones
    framesDir: '/images/origin/beat-1-origen',
    frameCount: 0,      // definir número recomendado en la spec
    placeholderColor: '',  // token del design system
  },
  // beat 2, 3, 4
]
```

Tono: premium, sensorial, concreto. Sin clichés ("pasión", "calidad").
Preferir detalles específicos: altitud, temperatura, nombre de región,
el gesto exacto de tostar, el nombre del agricultor si aplica.

### SPEC 5D — Número de frames por beat

Esto es crítico para performance y fluidez. Define:

1. ¿Cuántos frames recomiendas por beat?
   Considera: a 24fps un video de 4s = 96 frames. Eso es mucho.
   La técnica Apple usa ~60–120 frames por secuencia.
   Para scroll scrub, ¿cuántos frames son suficientes para que
   se vea fluido sin que el peso de carga sea excesivo?

2. ¿Qué resolución deben tener los JPGs?
   Define width × height y calidad de compresión (0–100).
   Considera: en desktop el canvas ocupa ~50% del viewport width.
   En mobile ocupa 100vw.
   Regla: el frame debe verse nítido en el canvas más grande
   que va a ocupar, sin ser más grande de lo necesario.

3. ¿Qué pesa cada frame JPG con esa resolución y calidad?
   Estima: frameCount × KB/frame = peso total por beat.
   ¿Es aceptable? ¿Qué estrategia de carga usas si no lo es?

4. Propón el comando de extracción que el usuario debe usar
   en su herramienta externa para lograr esa resolución y calidad.

### SPEC 5E — Mecanismo de canvas scrub

Define exactamente el funcionamiento del `useCanvasScrub`:

1. **Scroll trigger por beat:**
   Cada beat tiene su propia zona de scroll sticky.
   ¿Cuánto scroll height ocupa cada beat? (ej: `100vh`, `150vh`)

2. **Fórmula frame index:**
   ```typescript
   const frameIndex = Math.min(
     Math.floor(scrollProgress * frameCount),
     frameCount - 1
   )
   // ¿Usas Math.floor o Math.round? ¿Por qué?
   ```

3. **Renderizado en canvas:**
   ```typescript
   // ¿Cómo dibujas el frame en el canvas?
   // ctx.drawImage con ¿qué parámetros?
   // ¿Cómo manejas el aspect ratio del frame vs el canvas?
   // object-fit: cover equivalente en canvas — ¿cómo lo calculas?
   ```

4. **requestAnimationFrame vs scroll directo:**
   ¿Usas `rAF` para throttlear el dibujado del canvas,
   o confías en que GSAP ScrollTrigger ya optimiza las llamadas?

5. **Carga progresiva:**
   Los frames se cargan en orden (1, 2, 3...).
   ¿Qué muestra el canvas mientras el frame actual no está cargado?
   - El último frame cargado disponible
   - El placeholder de color
   - Un blur del frame anterior

6. **Preload strategy:**
   ¿Cuántos frames precargas antes de que el usuario llegue al beat?

### SPEC 5F — Layout y composición visual

Define la composición desktop y mobile:

**Desktop — cada beat:**
```
[canvas 55% width, sticky] [texto 45% width, scrollea]
o
[texto 45% width, scrollea] [canvas 55% width, sticky]
¿Alternado beat a beat o siempre igual lado?
```

**Mobile:**
1. ¿El canvas va arriba del texto o abajo?
2. ¿El scrub funciona en mobile o se convierte en autoplay/estático?
3. ¿Qué height tiene el canvas en mobile?

### SPEC 5G — Loading state y UX de carga

1. **Estado inicial:** ¿Qué ve el usuario al llegar a la sección?
2. **Indicador de progreso:** ¿hay algún indicador visual?
3. **Orden de carga:** ¿4 beats en paralelo o en secuencia?
4. **Error de carga:** Si un frame falla al cargar, ¿qué hace el canvas?

### SPEC 5H — Integración con GSAP

1. ¿Usas `ScrollTrigger.create` por beat, o un solo ScrollTrigger?
2. ¿El `scrub` value de ScrollTrigger afecta el canvas directamente,
   o usas `onUpdate` para calcular el frameIndex manualmente?
3. Patrón de cleanup obligatorio con dependencias correctas del useEffect.

### SPEC 5I — Accesibilidad

1. `<canvas>` no es accesible por defecto. Define:
   - ¿`role="img"` + `aria-label` descriptivo del beat?
   - ¿O `aria-hidden="true"` si el texto del beat ya describe el contenido?

2. `prefers-reduced-motion`:
   - Sin scroll scrub — el canvas muestra un frame fijo (¿cuál?)
   - Sin animaciones de entrada

3. Jerarquía de headings en el home.

4. Contraste texto sobre canvas si el texto va como overlay.

### SPEC 5J — Integración en page.tsx

```typescript
export default function HomePage() {
  return (
    <main>
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      {/* Fase 6: ExperienceCards */}
    </main>
  )
}
```

¿La sección necesita `id="origin"` para anchor navigation?

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Arquitectura Server/Client justificada con frontera clara
- [ ] Tipos TypeScript completos: BeatConfig, CanvasScrubProps, hooks
- [ ] Copywriting real de los 4 beats en español (no Lorem ipsum)
- [ ] Número de frames, resolución y peso estimado por beat
- [ ] Fórmula frameIndex con Math.floor/round justificado
- [ ] `ctx.drawImage` con manejo de aspect ratio (cover equivalent)
- [ ] Layout desktop definido (canvas sticky vs. overlay)
- [ ] Estrategia mobile definida (scrub / autoplay / estático)
- [ ] Loading state y orden de precarga definidos
- [ ] Patrón GSAP con dependencias correctas del useEffect
- [ ] `<canvas>` accesibilidad: role + aria-label o aria-hidden
- [ ] `prefers-reduced-motion`: frame fijo definido

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1  src/data/originStory.ts          ← BeatConfig[] con datos y copywriting
Paso 2  OriginStory/types.ts             ← todos los tipos del componente
Paso 3  useFrameLoader.ts                ← carga de frames, sin UI
Paso 4  useCanvasScrub.ts                ← lógica scrub + drawFrame, sin UI
Paso 5  CanvasScrub.tsx                  ← canvas element + hooks, sin texto
Paso 6  OriginBeat.tsx                   ← un beat completo: canvas + texto
Paso 7  OriginStory/index.tsx            ← compone los 4 beats
Paso 8  src/app/page.tsx                 ← integrar OriginStory
```

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 5 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Canvas scrub confirmado:**
- [ ] Desktop: el canvas avanza frame a frame al scrollear en cada beat
- [ ] Desktop: la transición entre frames es fluida (sin saltos bruscos)
- [ ] Desktop: el aspect ratio de los frames se mantiene (no distorsión)
- [ ] Mobile: comportamiento definido en spec funciona correctamente
- [ ] Loading: placeholder visible inmediatamente antes de cargar frames
- [ ] Loading: orden de precarga correcto (beat 1 primero)
- [ ] Error: frame fallido no rompe el componente

**Accesibilidad:**
- [ ] canvas tiene role/aria-label o aria-hidden correcto
- [ ] reduced-motion: frame fijo visible, sin scrub
- [ ] Jerarquía de headings correcta
- [ ] Contraste texto legible en todos los beats

**Performance:**
- [ ] GSAP cleanup con ctx.revert() verificado (sin memory leaks)
- [ ] Frames del beat 2–4 no bloquean carga inicial de la página
- [ ] Sin valores arbitrarios [] en className
- [ ] Tokens nuevos documentados en HANDOFF.md sección 6
```

---

## Nota sobre assets — flujo cuando los videos estén listos

```
1. Extraer frames con tu herramienta externa
   (resolución y calidad exactas definidas en SPEC 5D)
2. Nombrar como frame_000000.webp, frame_000001.webp, ... (0-indexed, 6 dígitos)
3. Colocar en /public/images/origin/beat-N-nombre/
4. Actualizar frameCount en src/data/originStory.ts
5. pnpm build — el componente los toma automáticamente
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 5 → ✅ en la tabla de verificación (sección 11)
- Decisión de canvas frame scrub → sección 14
- Número de frames, resolución y peso aprobado → sección 14
- Bugs encontrados → sección 13
- Tokens nuevos → sección 6
- Fase siguiente → **Fase 6 — ExperienceCards**

---

Empieza con la SPEC completa.
Responde cada sección (5A hasta 5J) antes de escribir código.
