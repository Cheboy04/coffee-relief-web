# Coffee Relief — Prompt Engineering Handoff
> Estado de todos los prompts SDD generados para el proyecto.
> Para retomar la generación de prompts en una sesión fresca con contexto completo.
> Última actualización: 2026-06-11 · Fases con prompt generado: 0–5

---

## 1. Contexto de este documento

Este handoff es el complemento al `HANDOFF.md` del proyecto.
Mientras ese documenta el estado del código, este documenta
**el estado de los prompts SDD**: qué se generó, qué decisiones
se tomaron, qué funcionó, qué hubo que corregir, y cómo seguir.

El flujo de trabajo es:
```
[Claude.ai] genera prompts SDD → [Claude Code] los ejecuta → [HANDOFF.md] registra el resultado
```

Este documento vive en Claude.ai (no en el repo).
El historial de conversación donde se generaron los prompts
es la referencia de decisiones de diseño tomadas antes del código.

---

## 2. Metodología SDD — cómo funciona

Cada prompt sigue el ciclo obligatorio:

```
SPEC   → Claude Code propone tipos, contratos, APIs, estructura
REVIEW → El usuario aprueba, corrige o rechaza
BUILD  → Implementación en orden exacto definido en SPEC
VERIFY → Build + types + lint + comportamiento visual confirmado
```

**Regla de oro de los prompts:** nunca escribir "implementa X".
Siempre escribir "propón la SPEC de X antes de implementar".
Esa distinción es lo que previene que Claude Code improvise.

**Anatomía de cada prompt:**
1. Contexto y estado anterior (qué fases están completas)
2. Lecciones de bugs de fases anteriores (aplicar aquí)
3. SPEC A–N: preguntas técnicas con formatos de respuesta esperados
4. Criterios de aprobación (checklist que debe cumplir la SPEC)
5. Orden de BUILD en pasos numerados
6. VERIFY: checklist de evidencia requerida al terminar
7. Instrucción de actualizar HANDOFF.md

---

## 3. Estado de los prompts

| Fase | Componente | Prompt | Ejecutado | Notas |
|---|---|---|---|---|
| 0 | Setup + estructura | ✅ generado | ✅ en código | Incluido en el prompt de inicio |
| 1 | Design tokens + Button + SectionTitle | ✅ generado | ✅ en código | Incluido en el prompt de inicio |
| 2 | Navbar + Footer | ✅ generado | ✅ en código | Ver §6 |
| 3 | HeroScroll | ✅ generado | ✅ en código | Ver §7 |
| 4 | TrustBar | ✅ generado | ✅ en código | Ver §8 |
| 5 | OriginStory | ✅ generado v2 | ✅ en código | Ver §9 — reescrito de parallax a canvas |
| 6 | ExperienceCards | ⏳ pendiente | — | Próximo a generar |
| 7 | ShopCoffee + ProductCard + CoffeeQuiz | ⏳ pendiente | — | Tiene trabajo extra (HeroTransition) |
| 8 | MenuVisual | ⏳ pendiente | — | |
| 9 | Sustainability + Awards | ⏳ pendiente | — | |
| 10 | Reviews + BlogPreview | ⏳ pendiente | — | |
| 11 | Locations | ⏳ pendiente | — | |
| 12 | i18n (es/en) | ⏳ pendiente | — | |
| 13 | Performance + accesibilidad | ⏳ pendiente | — | |
| 14 | Deploy a Vercel | ⏳ pendiente | — | |

---

## 4. Archivos de prompts generados

Todos los prompts están guardados en el repo en `docs/prompts/`:

```
docs/prompts/
  PROMPT_INICIO_CLAUDE_CODE.md    ← Fases 0 + 1 combinadas
  PROMPT_FASE2_NAVBAR_FOOTER.md
  PROMPT_FASE3_HERO_SCROLL.md
  PROMPT_FASE4_TRUSTBAR.md
  PROMPT_FASE5_ORIGINSTORY.md     ← versión 2 (canvas scrub)
```

Los prompts de Fases 6–14 se generan en Claude.ai antes de ejecutar
cada fase en Claude Code. El flujo correcto es:

```
1. Abrir esta conversación en Claude.ai
2. Pedir el prompt de la siguiente fase
3. Responder preguntas de diseño/UX que haga Claude.ai
4. Guardar el prompt generado en docs/prompts/
5. Ejecutarlo en Claude Code
6. Actualizar HANDOFF.md al terminar
```

---

## 5. Decisiones de diseño tomadas en esta conversación

Estas decisiones se tomaron aquí (Claude.ai) antes de llegar a Claude Code.
No revertir sin consultar.

### Decisión 1 — Canvas frame scrub en OriginStory (Fase 5)
**Contexto:** el plan original era parallax de imágenes.
**Decisión:** canvas frame scrub, igual que el hero, para coherencia visual.
**Razón:** mantener el lenguaje scroll-driven en todo el home.
**Implicación técnica:** requiere 4 videos cortos (3–8s) pre-procesados
en frames WebP. El usuario extrae los frames manualmente.
Naming: `frame_000000.webp` (guion bajo, 6 dígitos, 0-indexado).
Estructura: `/public/images/origin/beat-N-nombre/`.

### Decisión 2 — Mobile en OriginStory
**Decisión:** canvas scrub funciona en mobile también (touch scroll).
**Razón:** scroll touch activa ScrollTrigger igual que desktop.
**Implicación:** no hay rama de código diferente para mobile en OriginStory.

### Decisión 3 — Navbar siempre transparente
**Contexto:** opciones eran transparente-sobre-hero/sólido-al-scroll
o siempre transparente.
**Decisión:** siempre transparente con sombra sutil.
**Implicación:** no hay comunicación de estado entre HeroScroll y Navbar.
`--navbar-fg-color` CSS variable maneja la legibilidad según el fondo.
Sección 3J del prompt de Fase 3 quedó obsoleta por esta decisión.

### Decisión 4 — Idioma inicial: español solamente
**Decisión:** los textos de overlays del hero y los beats de OriginStory
se implementan en español. i18n (es/en) es la Fase 12.
**Implicación:** no usar `useTranslations()` en Fases 1–11.
Hardcoded en español está bien hasta la Fase 12.

### Decisión 5 — Transición funda→ProductCard pospuesta
**Contexto:** el HeroScroll termina con la funda kraft.
La transición animada hacia la primera ProductCard del shop
se definió en la Fase 3 pero se implementó como placeholder.
**Decisión:** completar en la Fase 7 (ShopCoffee).
`HeroTransition.tsx` existe en el repo como placeholder.
**Implicación:** el prompt de la Fase 7 debe incluir la spec
de HeroTransition como trabajo adicional.

### Decisión 6 — Stack real vs. planificado
**Contexto:** el plan era Next.js 14. Se instaló Next.js 16 + Tailwind v4.
**Decisión:** mantener v16 y v4. Aprobado en Fase 0.
**Implicación crítica para todos los prompts futuros:**
- No existe `tailwind.config.ts` → todo en `globals.css @theme`
- Sin valores arbitrarios `[]` → crear `@utility` o token en globals.css
- Los prompts de Fases 6–14 deben mencionar explícitamente esto.

---

## 6. Historial del prompt de Fase 2 — Navbar + Footer

**Secciones:** 2A (arquitectura) a 2I (performance) — 9 secciones.

**Preguntas de diseño resueltas antes de generar:**
- Navbar: Logo + links + CTA (sin idioma ni carrito en esta fase)
- Comportamiento visual: siempre transparente con sombra sutil
- Links de navegación: definidos en la SPEC por Claude Code

**Ajuste post-ejecución:**
La sección 3J del prompt de Fase 3 (comunicación Navbar←→Hero)
quedó obsoleta porque el Navbar es siempre transparente.
Los prompts futuros no deben incluir lógica de comunicación
scroll→Navbar.

---

## 7. Historial del prompt de Fase 3 — HeroScroll

**Secciones:** 3A (arquitectura) a 3J (integración Navbar) — 10 secciones.
La más compleja del proyecto — mayor detalle técnico.

**Preguntas de diseño resueltas antes de generar:**
- Mobile: autoplay muted loop (sin scrub)
- Overlays: 3 mensajes (taza → granos → funda)
- Transición post-hero: funda hace zoom out → primera ProductCard
- Idioma: español solamente

**Decisiones técnicas clave en el prompt:**
- No animar `<video>` directamente para la transición → elemento HTML
  independiente sobre el video para evitar artefactos en Safari
- `data-hero-active` en `<body>` para comunicar estado al Navbar
  (luego obsoleto por decisión de Navbar siempre transparente)
- Import dinámico de GSAP dentro de useEffect — nunca top-level

**Nota para Fase 7:** la transición funda→card quedó como
`HeroTransition.tsx` placeholder. El prompt de Fase 7 debe
completarla como trabajo adicional a ExperienceCards→ShopCoffee.

---

## 8. Historial del prompt de Fase 4 — TrustBar

**Secciones:** 4A a 4G — 7 secciones.
La más simple del proyecto — componente sin estado, CSS puro.

**Bugs de Fase 4 que deben propagarse a prompts futuros:**

**Bug 1 — `flex w-max` vs `inline-flex`:**
`flex w-max` dentro de `overflow:hidden` no computa el ancho
correctamente en todos los browsers.
**Regla para prompts futuros:** cualquier contenedor de ancho
natural dentro de `overflow:hidden` debe usar `inline-flex`.

**Bug 2 — Número de copias en marquee:**
Con 2 copias + `translateX(-50%)`: solo funciona si
`copia_width >= viewport_width`. Si el contenido no llena
el viewport, aparece un gap antes del reset.
**Regla para prompts futuros:** usar siempre 3 copias +
`translateX(calc(-100% / 3))` para marquees. Es la solución
confiable independiente del ancho del contenido.

**Adición al CLAUDE.md:** ambos bugs se documentaron como
patrones en la sección "CSS Marquee infinito".

---

## 9. Historial del prompt de Fase 5 — OriginStory

**Versiones:** se generaron 2 versiones del prompt.

**v1 — parallax de imágenes:**
Secciones 5A a 5I. Nunca se ejecutó.
Descartada por decisión de diseño (ver §5, Decisión 1).

**v2 — canvas frame scrub (versión final):**
Secciones 5A a 5J — 10 secciones.
Añadida sección de "flujo de assets cuando lleguen los videos".

**Preguntas de diseño resueltas antes de generar v2:**
- Técnica: canvas frame scrub (Opción B — técnica Apple)
  descartando parallax (Opción C) y video scrub directo (Opción A)
- Assets: 4 videos cortos independientes (3–8s cada uno)
- Extracción de frames: manual por el usuario con tool externo
- Idioma: español solamente

**Decisión de arquitectura sin assets:**
El componente usa placeholders de color sólido del design system
mientras no existen los frames reales. El layout no depende de assets.
Cuando lleguen: copiar frames a `/public/images/origin/beat-N-nombre/`
y actualizar `frameCount` en `originStory.ts`. Sin cambios de código.

**Bugs de Fase 5 que deben propagarse a prompts futuros:**

**Bug 3 — `frames` como dependencia de useEffect:**
Causa re-registro infinito de ScrollTrigger en cada batch update.
**Regla:** usar `framesRef` pattern. ScrollTrigger registrado con
deps `[]` vacías. `framesRef` y `progressRef` actualizados en
useEffect separado.

**Bug 4 — Canvas sin resolución al redimensionar:**
`canvas.width/height` no se actualizan con el tamaño CSS.
**Regla:** `ResizeObserver` en cualquier componente con `<canvas>`
para mantener resolución interna en sync con tamaño CSS.

**Bug 5 — `prefers-reduced-motion` mostraba frame 0:**
`progressRef.current = 0` nunca avanzaba en modo reducido.
**Regla:** en modo reducido, mostrar `Math.floor(frameCount / 2)`.

**Bug 6 — Frames se cargaban en modo `data-saver`:**
`CanvasScrub` no verificaba `navigator.connection?.saveData`.
**Regla:** cualquier componente que cargue assets pesados
(frames, videos) debe tener guard `saveData` antes de cargar.
Misma lógica que HeroScroll.

---

## 10. Reglas para generar los prompts de Fases 6–14

Estas reglas se derivan de todo lo aprendido hasta la Fase 5.
Aplicar en todos los prompts futuros:

### Reglas de stack
- Tailwind v4: mencionar explícitamente en cada prompt que
  no existe `tailwind.config.ts` → tokens en `globals.css @theme`.
- Tokens nuevos: `@utility` en globals.css, no valores `[]`.
- GSAP: dynamic import siempre. Nunca top-level.
- `'use client'`: solo cuando es necesario. Justificar.

### Reglas de canvas/scroll
- Cualquier `<canvas>`: incluir `ResizeObserver` en la SPEC.
- Cualquier ScrollTrigger con assets asincrónicos: `framesRef` pattern,
  deps `[]` vacías con eslint-disable justificado.
- `prefers-reduced-motion`: frame fijo en `Math.floor(frameCount / 2)`,
  no frame 0.
- `saveData` guard: en cualquier componente con assets pesados.

### Reglas de accesibilidad
- `IntersectionObserver threshold`: máximo `0.1` en secciones altas.
- `<canvas>`: `aria-hidden="true"` cuando texto adyacente describe contenido.
- Jerarquía headings del home ya establecida:
  `h1` hero → `h2` secciones (puede ser sr-only) → `h3` beats/cards.

### Reglas de marquee
- `inline-flex` (nunca `flex w-max`) dentro de `overflow:hidden`.
- 3 copias + `translateX(calc(-100% / 3))` siempre.

### Reglas de estructura de prompt
- Siempre empezar con: "Lee HANDOFF.md y DESIGN.md. Ejecuta pnpm build."
- Siempre incluir sección "Lecciones de bugs de fases anteriores".
- Siempre terminar con: "Actualiza HANDOFF.md al terminar esta fase."
- Secciones SPEC: entre 7 y 10 secciones. Menos de 7 es insuficiente.
- Criterios de aprobación: checklist concreto y verificable.
- Orden de BUILD: pasos numerados, de lo más atómico a lo compuesto.
- VERIFY: checklist separado por categoría (visual, accesibilidad, performance).

---

## 11. Contexto para generar el prompt de Fase 6 — ExperienceCards

**Qué es:** sección con 4 cards que muestran las formas de vivir Coffee Relief:
Visitar la cafetería · Comprar café online · Reservar experiencia · Ver menú brunch.

**Pendientes de definir antes de generar el prompt:**
- ¿Cómo se ve cada card? (imagen + título + CTA, o más elementos)
- ¿Las cards son interactivas? (hover con reveal, expand, o link directo)
- ¿Hay alguna card destacada o son las 4 iguales en peso visual?
- ¿El layout es grid 2×2, fila horizontal, o asimétrico?

**Nota sobre HeroTransition:**
La Fase 6 NO incluye el trabajo de HeroTransition.
Eso va en la Fase 7 junto con ShopCoffee.
No incluir spec de HeroTransition en el prompt de Fase 6.

**Preguntas de diseño que hay que resolver con el usuario
antes de generar el prompt de Fase 6:**
1. ¿Cómo imaginas las ExperienceCards visualmente?
2. ¿Tienen hover effect o son estáticas?
3. ¿El layout es simétrico (2×2) o asimétrico (una card grande + tres pequeñas)?

---

## 12. Contexto para la Fase 7 — ShopCoffee (trabajo extra)

El prompt de Fase 7 tiene trabajo adicional no documentado en el roadmap original:
completar `HeroTransition.tsx` (actualmente placeholder en el repo).

**Lo que debe hacer HeroTransition:**
Al llegar al 90% del scroll del hero, la funda kraft hace zoom out
y se convierte en la primera ProductCard del ShopCoffee.

**Decisión técnica pendiente:**
No animar el `<video>` directamente para la transición.
Crear un elemento HTML independiente que imita la funda
y hace el zoom out → se convierte en ProductCard.

**Cuando se genere el prompt de Fase 7:**
- Incluir sección extra de SPEC para HeroTransition
- Coordinar con el estado final del HeroScroll (Fase 3)
- Coordinar con el diseño de ProductCard (definido en Fase 7)

---

## 13. Cómo retomar esta conversación

Si llegas aquí en una sesión nueva, el contexto necesario es:

1. Leer este documento completo (PROMPT_HANDOFF.md)
2. Leer el `HANDOFF.md` del repo para el estado del código
3. Leer `docs/DESIGN.md` para la fuente de verdad visual
4. La siguiente fase a trabajar está marcada como ⏳ en §3

**Para pedir el prompt de la siguiente fase, decirle a Claude.ai:**

> "Retomamos Coffee Relief. Lee el PROMPT_HANDOFF.md y el HANDOFF.md adjuntos.
> Necesito el prompt SDD para la Fase [N] — [nombre].
> El estado del proyecto está en el HANDOFF.md.
> Hazme las preguntas de diseño que necesites antes de generar el prompt."

**Adjuntar siempre:**
- `HANDOFF.md` (estado del código)
- `DESIGN.md` (fuente de verdad visual)
- Este `PROMPT_HANDOFF.md` (estado de los prompts)

---

*Documento generado en Claude.ai — sesión de diseño Coffee Relief Web.*
*Complementa el HANDOFF.md del repo https://github.com/Cheboy04/coffee-relief-web*
