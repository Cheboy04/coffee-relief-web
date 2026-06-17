# Fase 13+14 — Performance · Accesibilidad · Deploy a Vercel
# Auditoría completa + corrección de bugs + deploy de producción
# Esta fase combina las fases 13 y 14 del roadmap — es la fase final del proyecto

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–8, 11 y 12 completadas. Esta es la **Fase 13+14 — Auditoría + Deploy**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Objetivo de esta fase

Llevar el sitio de "funcional en desarrollo" a **listo para producción**:
1. Auditar y corregir todos los problemas de performance, accesibilidad y bugs
   que no se detectaron en fases anteriores porque el foco era la funcionalidad.
2. Configurar Vercel correctamente para Next.js 16 + next-intl + Leaflet.
3. Hacer el primer deploy exitoso con dominio configurado.

**Principio guía de esta fase:** no inventar mejoras — auditar primero,
priorizar por impacto, corregir solo lo que el audit demuestra que está mal.
Cada cambio necesita evidencia (Lighthouse score, axe finding, bundle size)
antes de implementarse.

---

## Contexto del proyecto — lo que ya está bien

- **Build:** `pnpm build` pasa limpio — 0 errores TypeScript, 0 lint warnings.
- **SSG:** home pre-renderizado en `/` (en) y `/es` (es) vía `generateStaticParams`.
- **Server Components:** la mayoría de las secciones son Server-only — buen punto de partida para performance.
- **Patrones de accesibilidad aplicados:** `aria-labelledby` en secciones, jerarquía de headings h1→h2→h3, `role="application"` en mapa, `<canvas aria-hidden>`, `prefers-reduced-motion` en GSAP/canvas, `saveData` guard en assets pesados.
- **i18n:** `hreflang` en metadata, `<html lang>` dinámico, LanguageSwitcher con `aria-label`.
- **Tailwind v4:** cero valores arbitrarios `[]` — tokens en `globals.css`.

---

## Lo que esta fase debe encontrar y corregir

La auditoría debe cubrir estas categorías. **La SPEC define qué herramientas
usar y en qué orden — no el resultado esperado.** El resultado lo determina
el audit real.

### A — Core Web Vitals (Lighthouse / PageSpeed)

Las métricas críticas para este sitio:

**LCP (Largest Contentful Paint):** el hero canvas / video / poster es
probablemente el LCP element. El objetivo es < 2.5s.
Puntos de riesgo conocidos:
- `hero-poster.webp` — ¿tiene `priority={true}` en `next/image`?
- Los 161 frames WebP del hero — ¿bloquean el LCP?
- Las fuentes Libre Caslon Text + Hanken Grotesk — ¿tienen `preload`?

**CLS (Cumulative Layout Shift):** el objetivo es < 0.1.
Puntos de riesgo:
- Canvas de OriginStory — ¿tiene dimensiones definidas antes de que JS cargue?
- `h-beat-canvas-mob` (56vw) — ¿se computa correctamente en SSR?
- El mapa Leaflet — `next/dynamic ssr:false` puede causar layout shift si
  el contenedor no tiene altura definida antes de que Leaflet monte.
- Fuentes web — ¿hay `font-display: swap` o `optional`?

**FID/INP (Interaction to Next Paint):** el objetivo es < 200ms.
Puntos de riesgo:
- CoffeeQuiz — el scoring hook es síncrono y simple, no debería ser problema.
- ExperienceCards flip — CSS 3D, no JS, no debería ser problema.
- Leaflet flyTo — operación asíncrona, no bloquea el hilo principal.

**FCP (First Contentful Paint):** objetivo < 1.8s.
Puntos de riesgo:
- GSAP dynamic import — se carga después del FCP, bien.
- Leaflet dynamic import — igual.
- Framer Motion — está en el bundle principal porque MobileMenu lo usa.
  ¿Cuánto pesa en el bundle?

### B — Bundle analysis

Antes de cualquier optimización, medir el tamaño real del bundle:
```bash
# Next.js Bundle Analyzer — instrucciones en SPEC
ANALYZE=true pnpm build
```

Lo que se espera encontrar:
- **Framer Motion** en el bundle del client (MobileMenu + ExperienceCards).
  ¿Cuánto pesa? ¿Vale la pena separarlo con dynamic import?
- **GSAP** — ya es dynamic import, no debería aparecer en el bundle inicial.
- **Leaflet** — ya es `next/dynamic ssr:false`, no debería aparecer en el
  bundle inicial. Verificar.
- **next-intl** — los mensajes se cargan por locale, no ambos a la vez.
  Verificar que el bundle no incluye `es.json` cuando se sirve `/`.

### C — Accesibilidad (axe / Lighthouse)

La auditoría de accesibilidad debe ejecutarse con axe DevTools o
Lighthouse accessibility en el browser, **no solo revisión manual de código**.

Áreas de mayor riesgo en este proyecto:

**Contraste de color:**
- Navbar transparente sobre el hero (texto blanco sobre video) — ¿cumple WCAG AA?
- Navbar frosted glass sobre secciones claras — ¿el texto espresso tiene contraste?
- Tags del MenuVisual (`signature`, `vegano`) sobre sus fondos — ¿4.5:1 mínimo?
- Texto de overlay en HeroScroll beats 2 y 3 — ¿cumple sobre el video?
- LocationCard texto cream sobre `bg-primary` — verificar todos los elementos.

**Focus management:**
- ¿El skip-to-content link funciona y es visible al recibir focus?
- ¿Los modales/drawers (MobileMenu) atrapan el foco correctamente?
- ¿Al cerrar MobileMenu, el foco vuelve al botón hamburguesa?
- CoffeeQuiz — al avanzar entre preguntas, ¿el foco se mueve al inicio
  de la nueva pregunta?

**Keyboard navigation:**
- ExperienceCards flip — ¿son activables con Enter/Space?
- ProductCard SizeSelector radios — ¿navegables con flechas?
- LanguageSwitcher — ¿activable con teclado?
- Marcadores del mapa Leaflet — ¿accesibles por teclado?

**Screen reader:**
- TrustBar marquee — ¿el contenido duplicado tiene `aria-hidden="true"`?
- Canvas de OriginStory — ¿`aria-hidden="true"` en todos los beats?
- HeroTransition — ¿el elemento morph tiene `aria-hidden`?
- `role="status" aria-live="polite"` en el resultado del CoffeeQuiz —
  ¿se anuncia correctamente?

**Estructura semántica:**
- ¿Hay algún `<div>` que debería ser un elemento semántico?
- ¿Las listas de la TrustBar usan `<ul>/<li>` o `<div>`?
- ¿El Footer tiene `<nav aria-label="...">` en sus grupos de links?

### D — SEO técnico

- `robots.txt` — ¿existe? ¿está configurado correctamente para Vercel?
- `sitemap.xml` — ¿Next.js lo genera automáticamente o necesita configuración?
- Open Graph / Twitter Card — ¿las meta tags están en ambos locales?
- Canonical URL — ¿hay `<link rel="canonical">` en ambas versiones del home?
- `hreflang` — ya implementado en Fase 12, verificar que es correcto.

### E — Imágenes

- ¿Todos los `<Image>` de `next/image` tienen `sizes` correcto según su
  tamaño real en la página?
- ¿Las imágenes de ExperienceCards (portrait) tienen el `sizes` correcto?
- ¿Las imágenes del MenuVisual tienen `sizes` para el grid responsivo?
- ¿Los frames WebP del hero y OriginStory usan el formato correcto?
  (Ya son WebP — verificar que `next/image` no los re-procesa innecesariamente)
- ¿El `hero-poster.webp` tiene `priority={true}`?

### F — Variables de entorno y configuración de producción

Antes del deploy, hay configuraciones que solo aplican en producción:
- `NEXT_PUBLIC_*` — ¿hay alguna variable de entorno necesaria?
  (CartoDB tiles no requieren API key, Leaflet tampoco — pero verificar)
- `next.config.ts` — ¿tiene `images.domains` o `images.remotePatterns`
  para las imágenes externas (CartoDB tiles no son imágenes next/image,
  pero verificar si hay otros dominios)?
- El CTA `/tienda` apunta a una ruta que no existe — ¿debe bloquearse
  en producción (404 limpio) o hay algo que hacer antes del deploy?
- Los links de social (Footer) y `#privacy`, `#terms` son placeholders —
  ¿deben quedar como `href="#"` o removerse del markup antes del deploy?

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 13A — Inventario de auditoría

Antes de proponer ninguna corrección, ejecuta el audit completo:

```bash
# 1. Build limpio
pnpm build

# 2. Bundle analysis — instalar si no está
pnpm add -D @next/bundle-analyzer
# Configurar en next.config.ts y ejecutar:
ANALYZE=true pnpm build

# 3. Lighthouse — en pnpm dev o contra el build estático
# Ejecutar en modo incógnito, throttling mobile (Moto G4) y desktop
# Reportar scores de: Performance, Accessibility, Best Practices, SEO
# Para ambos locales: / y /es

# 4. TypeScript + lint — estado actual
npx tsc --noEmit
pnpm lint
```

Reporta los resultados **antes de proponer correcciones**. Formato esperado:

```
LIGHTHOUSE — /  (desktop)
  Performance:    __/100
  Accessibility:  __/100
  Best Practices: __/100
  SEO:            __/100
  LCP:   __s  CLS: __  FCP: __s  TBT: __ms

LIGHTHOUSE — /  (mobile)
  Performance:    __/100
  (mismo formato)

BUNDLE (páginas relevantes):
  / (home): First Load JS: ___KB  (shared: ___KB)
  Framer Motion en bundle: sí/no — ___KB
  Leaflet en bundle inicial: sí/no

ACCESIBILIDAD (axe findings):
  Critical: N issues
  Serious:  N issues
  (lista de los más relevantes)

TypeScript: 0 errores ✓
Lint:       0 warnings ✓
```

**No proponer ninguna corrección hasta tener estos números.**
La SPEC de correcciones viene después de que el usuario vea el inventario.

### SPEC 13B — Priorización de correcciones

Una vez tengas el inventario, prioriza en tres niveles:

**P0 — Bloqueantes para deploy:**
Problemas que impedirían que el sitio funcione correctamente en producción
o que generarían errores visibles para el usuario.
Ejemplos: rutas rotas, errores de hydration, errores 500, falta de
variables de entorno críticas.

**P1 — Impacto alto, no bloqueantes:**
Problemas que degradan significativamente la experiencia pero no la rompen.
Ejemplos: LCP > 4s, CLS > 0.25, issues de accesibilidad críticos (axe
`critical`), imágenes sin `alt`.

**P2 — Mejoras de calidad:**
Problemas reales pero con impacto menor.
Ejemplos: scores de Lighthouse entre 70-90, issues axe `serious`,
`sizes` incorrecto en imágenes que no son above-the-fold.

**P3 — Backlog post-deploy:**
Lo que no se corrige en esta fase y se documenta para después.
Ejemplos: animaciones menores, optimizaciones de bundle < 5KB,
accesibilidad de los marcadores Leaflet (compleja de implementar
correctamente y de impacto menor dado que hay alternativa textual).

Para cada issue P0/P1/P2, define:
- Descripción del problema
- Evidencia (número de Lighthouse, mensaje de axe, etc.)
- Corrección propuesta
- Archivo(s) afectado(s)
- Estimación de impacto en el score

### SPEC 13C — Configuración de Vercel

Define la configuración completa para el deploy:

**1. `vercel.json` (si es necesario):**
```json
{
  // ¿Headers necesarios? (CSP, X-Frame-Options, etc.)
  // ¿Redirects? (¿www → non-www? ¿http → https?)
  // ¿Rewrites? (next-intl los maneja con middleware — ¿conflicto?)
  // ¿Regiones de deploy? (Quito es LAT1 — ¿usar iad1 US East o gru1 São Paulo?)
}
```

**2. Variables de entorno en Vercel:**
Lista exacta de variables necesarias (si las hay).
Si no se necesita ninguna variable de entorno: confirmar explícitamente.

**3. `next.config.ts` — cambios para producción:**
```typescript
// ¿output: 'export' para sitio estático, o 'standalone', o default?
// Con SSG y next-intl middleware, ¿qué output mode es correcto?
// images: ¿algún dominio externo que necesite allowlist?
// headers: ¿CSP u otros headers de seguridad?
```

**4. Dominio:**
El deploy inicial será en `*.vercel.app`. Si hay dominio personalizado,
¿se configura en esta fase o después?
Define el proceso para agregar un dominio custom en Vercel post-deploy.

**5. Middleware en Vercel Edge:**
El `middleware.ts` de next-intl corre en el Edge Runtime de Vercel.
¿Hay alguna limitación del Edge Runtime que afecte el middleware actual?
(El middleware de next-intl v4 es compatible con Edge — verificar que
no importa módulos Node.js incompatibles con Edge)

**6. `robots.txt` y `sitemap.xml`:**
¿Se generan estáticamente en `public/` o dinámicamente con Route Handlers?
Con SSG y dos locales, define el contenido exacto de ambos archivos.

### SPEC 13D — Checklist pre-deploy

Define el checklist completo de verificación antes de hacer el primer push
a producción. Organizado por categoría:

```
CÓDIGO:
- [ ] pnpm build — 0 errores
- [ ] npx tsc --noEmit — 0 errores
- [ ] pnpm lint — 0 warnings
- [ ] Sin console.log en código de producción
- [ ] Sin TODO comments críticos sin resolver
- [ ] Sin credenciales o keys hardcodeadas

FUNCIONALIDAD:
- [ ] / sirve home en inglés correctamente
- [ ] /es sirve home en español correctamente
- [ ] LanguageSwitcher funciona en desktop y mobile
- [ ] Navbar frosted glass activa al salir del hero
- [ ] Hero canvas scrub funciona (desktop)
- [ ] Hero video loop funciona (mobile)
- [ ] OriginStory canvas scrub funciona en beats con frames reales (1 y 2)
- [ ] OriginStory beats 3 y 4 muestran placeholder de color (frames pendientes)
- [ ] ExperienceCards flip funciona (hover desktop, tap mobile)
- [ ] CoffeeQuiz completa los 3 pasos y muestra resultado
- [ ] ProductCard CTA "Agregar" → "Agregado ✓" → revierte
- [ ] MenuVisual muestra los 11 ítems con imágenes reales
- [ ] Locations mapa carga, muestra 2 marcadores, flyTo funciona
- [ ] /tienda devuelve 404 limpio (no error 500)
- [ ] #privacy y #terms no generan errores

PERFORMANCE:
- [ ] LCP < 2.5s (desktop)
- [ ] CLS < 0.1
- [ ] Lighthouse Performance > 80 (desktop)
- [ ] Lighthouse Performance > 60 (mobile — aceptable dado el canvas scrub)

ACCESIBILIDAD:
- [ ] Lighthouse Accessibility > 95
- [ ] 0 issues axe Critical
- [ ] Skip-to-content funciona
- [ ] MobileMenu atrapa foco correctamente

SEO:
- [ ] Lighthouse SEO > 95
- [ ] hreflang correcto en ambas versiones
- [ ] robots.txt accesible en /robots.txt
- [ ] sitemap.xml accesible en /sitemap.xml
- [ ] Open Graph tags en ambos locales
- [ ] canonical URL correcto

VERCEL:
- [ ] Deploy sin errores en Vercel dashboard
- [ ] / accesible en la URL de Vercel
- [ ] /es accesible en la URL de Vercel
- [ ] Sin errores 500 en el dashboard de Vercel
- [ ] Edge middleware corriendo sin errores
```

### SPEC 13E — Orden de BUILD

Con los resultados del inventario, define el orden exacto de correcciones.

El principio es: de mayor a menor impacto, de lo más simple a lo más complejo.
Cada paso debe dejar el build limpio.

Formato esperado:
```
Paso 1  robots.txt + sitemap.xml                ← P0 o P1 — mínimo para SEO
Paso 2  [corrección de mayor impacto P0]
Paso 3  [correcciones P1 — performance]
Paso 4  [correcciones P1 — accesibilidad]
Paso 5  [correcciones P2]
Paso 6  next.config.ts + vercel.json            ← configuración de deploy
Paso 7  pnpm build final + checklist completo
Paso 8  git push → Vercel deploy
```

---

## Criterios de aprobación de la SPEC

Esta fase tiene dos momentos de aprobación:

**Aprobación 1 — después de SPEC 13A (inventario):**
Aprobaré el inventario cuando vea los números reales de Lighthouse,
bundle size y axe. Sin números no hay aprobación.

**Aprobación 2 — después de SPEC 13B-E (plan de correcciones):**
Aprobaré el plan cuando vea:
- [ ] Issues clasificados claramente en P0/P1/P2/P3
- [ ] Evidencia real para cada issue (no suposiciones)
- [ ] Correcciones propuestas concretas (qué archivo, qué cambio)
- [ ] Configuración de Vercel completa
- [ ] Checklist pre-deploy completo
- [ ] Orden de BUILD justificado

---

## Después de mi aprobación — BUILD

Reglas del BUILD para esta fase:

- **Una corrección por paso.** No agrupar múltiples cambios en un solo paso.
  Si un paso falla, necesitamos saber exactamente qué causó el problema.
- **Re-ejecutar Lighthouse después de cada grupo de correcciones de performance.**
  No asumir que el cambio mejoró el score — medirlo.
- **Re-ejecutar axe después de correcciones de accesibilidad.**
- **`pnpm build` limpio después de cada paso** — sin excepción.
- **No "mejorar" código que no está en el inventario.** Si durante el BUILD
  se descubre algo adicional, parar y reportar al usuario antes de continuar.
- El deploy a Vercel es el **último paso** — después de que todas las
  correcciones están aplicadas y el checklist pre-deploy está completo.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 13+14 — Completada ✓

**Build final:** [output de pnpm build — 0 errores]
**Types:**       [output de npx tsc --noEmit — 0 errores]
**Lint:**        [output de pnpm lint — 0 warnings]

**Lighthouse FINAL — / (desktop):**
  Performance:    __/100  (era __/100 antes)
  Accessibility:  __/100  (era __/100 antes)
  Best Practices: __/100
  SEO:            __/100
  LCP: __s  CLS: __  FCP: __s

**Lighthouse FINAL — / (mobile):**
  Performance:    __/100

**axe FINAL:**
  Critical: 0
  Serious:  __ (lista)

**Deploy:**
- [ ] URL de Vercel: https://[proyecto].vercel.app
- [ ] / carga correctamente en producción
- [ ] /es carga correctamente en producción
- [ ] Sin errores en Vercel dashboard
- [ ] robots.txt accesible
- [ ] sitemap.xml accesible
- [ ] hreflang verificado con Google Search Console (o herramienta equivalente)

**Issues P3 documentados para backlog:**
- (lista de lo que queda pendiente)
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fases 13 y 14 → ✅ en la tabla de verificación (sección 14)
- Nueva sección `## 12.4 Fase 13+14 — Performance + Deploy` con:
  - Scores de Lighthouse pre y post auditoría
  - Issues encontrados y corregidos
  - URL de producción en Vercel
  - Configuración de `vercel.json` y `next.config.ts`
  - Issues P3 pendientes para backlog
- Bugs nuevos encontrados → sección 15
- Decisiones de deploy → sección 16
- Roadmap: marcar Fases 13 y 14 como ✅
- Añadir al roadmap: `—   /tienda (catálogo completo) — pendiente`

---

## Nota importante sobre el orden de esta fase

Esta fase tiene un paso que **no existe en ninguna fase anterior**:
el audit real en el browser. Claude Code no puede ejecutar Lighthouse
ni abrir un browser.

El flujo correcto es:

```
1. Claude Code: prepara el entorno de audit (instala bundle analyzer,
   genera el build, documenta cómo ejecutar Lighthouse)
2. Tú: ejecutas Lighthouse en tu browser y reportas los números
3. Claude Code: analiza los números y propone el plan de correcciones (13B-E)
4. Tú: apruebas el plan
5. Claude Code: implementa las correcciones en orden
6. Tú: re-ejecutas Lighthouse y confirmas mejora
7. Claude Code: configura Vercel y prepara el deploy
8. Tú: ejecutas el deploy (git push o desde la UI de Vercel)
```

Cuando llegues al Paso 2, ejecuta Lighthouse así:
- Abre Chrome en modo incógnito
- Abre DevTools → Lighthouse
- Categorías: Performance + Accessibility + Best Practices + SEO
- Device: Desktop primero, luego Mobile
- Ejecuta en `http://localhost:3000/` y en `http://localhost:3000/es`
- Copia los scores y el detalle de los issues principales

---

Empieza con la SPEC completa.
Responde 13A (inventario de audit) primero — prepara el entorno y
documenta exactamente qué necesito ejecutar yo y qué puedes
analizar tú directamente del código.
Luego espera mis resultados de Lighthouse antes de proponer correcciones.
