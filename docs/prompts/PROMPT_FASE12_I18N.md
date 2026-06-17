# Fase 12 — i18n (es/en con next-intl v4)
# Internacionalización completa del home — inglés por defecto, español opcional
# Routing: `/` → en (sin prefijo) · `/es` → es · localePrefix: 'as-needed'

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–8 y 11 completadas y verificadas. Fases 9–10 pospuestas.
Avanzamos a la **Fase 12 — i18n**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto y decisiones ya tomadas

- **`next-intl` v4.13.0 ya está instalado** — no reinstalar.
- **Idioma por defecto: inglés** (`en`) — sin prefijo en URL (`/`).
- **Idioma opcional: español** (`es`) — con prefijo (`/es`).
- **`localePrefix: 'as-needed'`** — el locale default nunca aparece en la URL.
- **Alcance completo:** todos los textos del home incluyendo CoffeeQuiz,
  datos de Locations (barrios, días de la semana, horarios) y UI strings.
- **No se internacionalizan:** coordenadas GPS, precios, SKUs, paths de imágenes,
  `googleMapsUrl`, tokens de design system, IDs de datos.

---

## Lo que ya existe y debes respetar

**Stack y patrones críticos:**
- Next.js 16 App Router — Server Components por defecto.
- Tailwind v4: sin `tailwind.config.ts`, tokens en `globals.css`.
- Sin valores arbitrarios `[]` en className.
- `'use client'` solo donde hay DOM imperativo, hooks de estado o efectos.
- next-intl v4 tiene APIs distintas a v3 — **leer la documentación en
  `node_modules/next-intl/dist/` antes de escribir cualquier código**.
  No asumir que `useTranslations`, `getTranslations`, `NextIntlClientProvider`
  o el middleware funcionan igual que en v3.

**Archivos que contienen texto hardcodeado (inventario completo):**
```
src/app/layout.tsx                        ← metadata title/description, lang attr
src/components/layout/Navbar/             ← NavLinks, MobileMenu (aria-labels)
src/components/layout/Footer/             ← FooterLinks, copyright text
src/components/sections/HeroScroll/       ← messages.ts (3 beats overlay)
src/components/sections/TrustBar/         ← data/trustBar (o inline) — 6–8 ítems
src/components/sections/OriginStory/      ← data/originStory.ts — 4 beats
src/components/sections/ExperienceCards/  ← data/experienceCards.ts — 4 cards
src/components/sections/ShopCoffee/       ← SectionTitle, CTA /tienda
src/components/sections/ShopCoffee/CoffeeQuiz/ ← questions.ts, result messages
src/components/sections/MenuVisual/       ← data/menu.ts — categorías + 11 ítems
src/components/sections/Locations/        ← data/locations.ts, LocationCard, heading
src/data/navigation.ts                    ← NAV_LINKS labels, FOOTER_DATA
src/data/products.ts                      ← flavorNotes, origin, intensity labels
```

**Patrón de imagen opcional establecido** — no cambiar por i18n:
```tsx
{item.image ? <Image ... /> : <div role="img" aria-label={t('item.imageAlt')} ... />}
```

---

## Lecciones críticas para esta fase

**next-intl v4 en App Router:**
- El middleware de next-intl debe configurarse en `middleware.ts` en la raíz del proyecto
  (mismo nivel que `src/`, no dentro de `src/`).
- `createNavigation` (v4) reemplaza a `createSharedPathnamesNavigation` (v3).
- En Server Components: `getTranslations()` (async).
- En Client Components: `useTranslations()` (sync, requiere `NextIntlClientProvider`
  en algún ancestro — típicamente en `layout.tsx`).
- Los mensajes se pasan al provider en el layout, no se importan directamente.

**Sobre los archivos de datos (`src/data/*.ts`):**
Los archivos de datos actuales contienen texto en español hardcodeado.
Hay dos estrategias posibles — la SPEC debe elegir una y justificarla:

- **Estrategia A — Datos como claves de traducción:**
  Los datos contienen keys (`'trustBar.volcanic'`) y los componentes llaman
  `t(item.labelKey)`. Los archivos de datos son locale-agnósticos.
  Ventaja: datos limpios. Desventaja: los datos ya no son legibles sin el
  archivo de mensajes.

- **Estrategia B — Datos duplicados por locale:**
  `originStory.ts` exporta `ORIGIN_BEATS_EN` y `ORIGIN_BEATS_ES`, y el
  componente recibe el array correcto según el locale activo.
  Ventaja: datos legibles. Desventaja: duplicación entre archivos.

- **Estrategia C — Mensajes completos en los archivos de traducción:**
  Todos los textos de los datos viven en `messages/en.json` y `messages/es.json`
  como objetos anidados. Los datos solo tienen IDs y datos no-textuales
  (coords, precios, colores, paths). Los componentes ensamblan el objeto
  completo con `t()`.
  Ventaja: única fuente de verdad para traducciones, datos limpios.
  Desventaja: los archivos de mensajes son más grandes.

La SPEC debe elegir una estrategia y aplicarla consistentemente a todos
los archivos de datos. No mezclar estrategias.

**Sobre los Client Components con texto:**
`CoffeeQuiz`, `ExperienceCard` (flip), `LocationsClient`, `MobileMenu` son
Client Components. next-intl v4 requiere `useTranslations()` en Client Components
y que el `NextIntlClientProvider` esté en un ancestro Server Component.
La SPEC debe definir dónde se coloca el provider sin envolver innecesariamente
en `'use client'` componentes que hoy son Server.

**Sobre `<html lang="...">` dinámico:**
El atributo `lang` del `<html>` debe cambiar según el locale activo.
En App Router con next-intl v4, el locale se resuelve en el layout.
La SPEC debe definir cómo `layout.tsx` obtiene el locale para el atributo `lang`.

**Sobre el selector de idioma:**
El sitio necesita un mecanismo para que el usuario cambie de idioma.
La SPEC debe proponer dónde vive (Navbar, Footer, o ambos) y cómo funciona:
- ¿Link directo a `/` vs `/es`?
- ¿Mantiene la ruta actual al cambiar? (`/es/tienda` → `/tienda` al cambiar a EN)
- ¿`next-intl` provee utilidades para esto o se construye manualmente?

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 12A — Arquitectura de archivos

Lista exacta de archivos a crear y modificar. Para cada uno:
ruta, qué cambia/se crea, y por qué.

Formato esperado:
```
NUEVOS:
  middleware.ts                    ← routing next-intl (raíz del proyecto)
  messages/en.json                 ← todos los textos en inglés
  messages/es.json                 ← todos los textos en español
  src/i18n/routing.ts              ← defineRouting() con locales + localePrefix
  src/i18n/navigation.ts           ← createNavigation() — Link, redirect, etc.
  src/i18n/request.ts              ← getRequestConfig() — cómo cargar mensajes

MODIFICADOS:
  src/app/layout.tsx               ← qué cambia exactamente
  src/app/page.tsx                 ← qué cambia exactamente
  src/data/originStory.ts          ← qué cambia según estrategia elegida
  ... (lista completa)
```

¿La estructura de carpetas de `src/app/` necesita cambiar?
Con `localePrefix: 'as-needed'`, next-intl v4 puede requerir un
`[locale]` segment en la estructura de rutas o no, dependiendo de la
configuración. Define exactamente la estructura de carpetas del App Router.

### SPEC 12B — Configuración de routing

Define la configuración exacta sin TODOs:

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ???,           // ['en', 'es']
  defaultLocale: ???,     // 'en'
  localePrefix: ???,      // 'as-needed'
  // ¿algo más necesario en v4?
})
```

```typescript
// middleware.ts
import { createMiddleware } from 'next-intl/middleware' // ¿o diferente en v4?
// Define el middleware completo — sintaxis exacta de next-intl v4
// ¿Hay conflicto con el middleware de Next.js 16?
```

```typescript
// src/i18n/request.ts
// Define cómo next-intl carga los mensajes según el locale
// ¿getRequestConfig de 'next-intl/server'?
// ¿Cómo se importan los mensajes (import dinámico por locale)?
```

### SPEC 12C — Estructura de los archivos de mensajes

**Primero:** elige la estrategia de datos (A, B o C del contexto) y justifica.

**Luego:** define la estructura completa de `messages/en.json`.
No Lorem ipsum — textos reales en inglés, coherentes con la voz de la marca
(premium, sensorial, concreto — la misma personalidad que el español).

La estructura debe cubrir **todos** los textos del inventario (§ "Lo que ya existe").
Organízala por sección, no por componente, para que sea mantenible:

```json
{
  "meta": {
    "title": "...",
    "description": "..."
  },
  "nav": {
    "menu": "...",
    "locations": "...",
    "shop": "...",
    "cta": "..."
  },
  "hero": {
    "beat1": { "eyebrow": "...", "headline": "...", "cta": "..." },
    "beat2": { ... },
    "beat3": { ... }
  },
  "trustBar": {
    "volcanic": "...",
    "producer": "...",
    ...
  },
  "originStory": {
    "sectionLabel": "...",
    "beat1": { "eyebrow": "...", "headline": "...", "body": "..." },
    ...
  },
  "experienceCards": {
    "sectionLabel": "...",
    "cafeteria": { "title": "...", "eyebrow": "...", "summary": "...", "ctaFront": "...", "ctaBack": "..." },
    ...
  },
  "shop": {
    "heading": "...",
    "eyebrow": "...",
    "cta": "...",
    "products": {
      "bold":      { "name": "...", "origin": "...", "intensity": "...", "flavorNotes": "...", "addCta": "...", "addedCta": "..." },
      "tropical":  { ... },
      "immersive": { ... }
    }
  },
  "quiz": {
    "heading": "...",
    "q1": { "question": "...", "options": { "a": "...", "b": "...", "c": "...", "d": "..." } },
    "q2": { ... },
    "q3": { ... },
    "results": {
      "bold":      { "headline": "...", "message": "..." },
      "tropical":  { ... },
      "immersive": { ... }
    },
    "retryLabel": "..."
  },
  "menu": {
    "heading": "...",
    "eyebrow": "...",
    "cta": "...",
    "categories": {
      "cafe":    { "label": "...", "eyebrow": "..." },
      "brunch":  { ... },
      "frias":   { ... }
    },
    "items": {
      "espresso":   { "name": "...", "description": "..." },
      ...
    },
    "tags": {
      "signature":  "...",
      "vegano":     "...",
      "sin-gluten": "..."
    }
  },
  "locations": {
    "heading": "...",
    "eyebrow": "...",
    "cta": "...",
    "hoursLabel": "...",
    "days": {
      "monFri": "...",
      "saturday": "...",
      "sunday": "...",
      "satSun": "..."
    },
    "sedes": {
      "la-whymper": {
        "name": "...",
        "neighborhood": "...",
        "address": "..."
      },
      "tumbaco": { ... }
    }
  },
  "footer": {
    "copyright": "...",
    ...
  },
  "common": {
    "learnMore": "...",
    "openInMaps": "...",
    "directions": "..."
  }
}
```

Define también `messages/es.json` con los equivalentes en español
(reutilizando los textos que ya existen en el código).

**Tono en inglés:** mismo registro que el español — editorial, sensorial,
específico. Evitar: "quality", "passion", "commitment". Preferir:
"volcanic soil", "hand-picked", "2,850m roast", "direct from producer".

### SPEC 12D — Integración en layout.tsx

Define exactamente cómo cambia `src/app/layout.tsx`:

1. ¿Recibe `params: { locale: string }` o lo obtiene de otra forma en v4?
2. ¿Dónde se coloca `NextIntlClientProvider`?
   - Dentro del `<body>` para envolver toda la app
   - ¿Pasa `messages` directamente o next-intl v4 lo maneja diferente?
3. ¿Cómo se setea `<html lang={locale}>`?
4. ¿`generateStaticParams()` es necesario para pre-renderizar ambos locales?
5. ¿La metadata (`title`, `description`) se internacionaliza con
   `generateMetadata()` async o de otra forma?

### SPEC 12E — Uso de traducciones en componentes

Define el patrón exacto para cada tipo de componente — sin duplicar lógica:

**Server Component (ej: `OriginStory/index.tsx`):**
```typescript
// ¿Cómo obtiene las traducciones?
// getTranslations() de 'next-intl/server' — async
// ¿Se pasan como props a los hijos o cada hijo llama getTranslations()?
```

**Client Component (ej: `CoffeeQuiz/index.tsx`):**
```typescript
// useTranslations() de 'next-intl'
// ¿Requiere algo especial en el ancestro?
// ¿El hook está disponible en cualquier Client Component dentro del provider?
```

**Archivos de datos (ej: `src/data/originStory.ts`):**
```typescript
// Según la estrategia elegida en 12C:
// ¿Cómo cambia este archivo?
// ¿Qué tipo TypeScript reemplaza el texto hardcodeado?
```

Define también: ¿los componentes que hoy son 100% Server y no tienen
interacción siguen siendo Server? ¿next-intl v4 obliga a convertir
algún Server Component en Client por las traducciones?

### SPEC 12F — Selector de idioma

Define el selector de idioma:

1. **Ubicación:** ¿Navbar desktop + MobileMenu, o solo Footer, o ambos?
2. **Forma visual:** ¿`ES | EN` como texto links, un `<select>`, un toggle?
   Coherente con el design system: `text-label-md uppercase`, tokens existentes.
3. **Comportamiento:**
   - Al cambiar de `en` → `es`: ¿va a `/es` (home) o a `/es[ruta-actual]`?
   - Al cambiar de `es` → `en`: ¿va a `/` (home) o a `/[ruta-actual-sin-prefijo]`?
   - next-intl v4 provee `useRouter` y `usePathname` del paquete de navegación
     para construir esto — define cómo se usa.
4. **Semántica HTML:**
   - `<nav aria-label="Language selector">` o `<div>` con roles?
   - `aria-current="true"` en el idioma activo?
   - ¿`hreflang` links en el `<head>` para SEO?
5. **¿Es un nuevo componente** (`LanguageSwitcher.tsx`) o se integra
   directamente en `NavLinks.tsx` / `MobileMenu.tsx`?

### SPEC 12G — Manejo de rutas y links internos

Con next-intl routing, los links internos deben ser locale-aware:

1. Los CTAs que apuntan a anchors (`#shop`, `#menu`, `#locations`) — ¿cambian
   con i18n o son siempre iguales independiente del locale?
2. El CTA `/tienda` (que aún no existe como ruta) — ¿se convierte en
   `/es/tienda` en español? ¿O se deja como placeholder hasta que exista la ruta?
3. El `<Link>` de next-intl vs el `<Link>` de `next/link` —
   ¿cuál usar en cada componente? ¿Los componentes existentes que usan
   `next/link` deben cambiar?
4. El `href="#reservas"` del MenuVisual — ¿cambia con i18n?

### SPEC 12H — Accesibilidad y SEO

1. **`<html lang>`:** debe ser `"en"` en `/` y `"es"` en `/es`.
   ¿Cómo se implementa dinámicamente en el App Router layout?
2. **`hreflang` en `<head>`:**
   ```html
   <link rel="alternate" hreflang="en" href="https://coffeerelief.com/" />
   <link rel="alternate" hreflang="es" href="https://coffeerelief.com/es" />
   <link rel="alternate" hreflang="x-default" href="https://coffeerelief.com/" />
   ```
   ¿Se agregan en `generateMetadata()` o en el layout como `<head>` estático?
3. **`aria-label` en inglés/español:** los componentes con `aria-label`
   hardcodeado (mapa Leaflet, CTAs de Locations) deben usar `t()`.
   ¿Están todos cubiertos en `messages/en.json`?
4. **Cambio de idioma anunciado a lectores de pantalla:**
   al cambiar locale, ¿hay algún `aria-live` region que anuncie el cambio?

### SPEC 12I — Orden de BUILD

Dado que esta fase modifica prácticamente todos los archivos del proyecto,
el orden de implementación es crítico para no romper el build en ningún paso.

Define el orden exacto — cada paso debe dejar el build limpio:

```
Paso 1  ← infraestructura next-intl: routing, middleware, request, provider
         (build debe pasar con textos aún en español hardcoded)
Paso 2  ← messages/en.json + messages/es.json (todos los textos)
Paso 3  ← layout.tsx: locale param, lang attr, provider, metadata
Paso 4  ← nav + footer (pocos strings, fácil de verificar)
Paso 5  ← selector de idioma (LanguageSwitcher)
Paso 6  ← secciones Server: TrustBar, OriginStory, ExperienceCards, MenuVisual
Paso 7  ← ShopCoffee (Server) + CoffeeQuiz (Client)
Paso 8  ← Locations (Server + Client)
Paso 9  ← HeroScroll (Client + messages.ts)
Paso 10 ← hreflang en metadata + verificación final
```

¿Este orden es correcto o hay dependencias que cambian la secuencia?
Justifica cualquier reordenamiento.

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Estructura de carpetas App Router definida (¿`[locale]` segment o no?)
- [ ] `routing.ts`, `middleware.ts`, `request.ts` con sintaxis exacta de next-intl v4
- [ ] Estrategia de datos elegida (A/B/C) con justificación
- [ ] `messages/en.json` completo — todos los textos del inventario, en inglés real
- [ ] `messages/es.json` completo — equivalentes en español (reutilizando copy existente)
- [ ] Cambios exactos en `layout.tsx`: locale param, lang attr, provider, metadata
- [ ] Patrón para Server Components (`getTranslations`) definido
- [ ] Patrón para Client Components (`useTranslations`) definido
- [ ] Selector de idioma: ubicación, forma visual, comportamiento, semántica
- [ ] Manejo de links internos con locale (anchors, `/tienda`, `/es/tienda`)
- [ ] `hreflang` en metadata definido
- [ ] `<html lang>` dinámico definido
- [ ] Orden de BUILD con justificación de cada paso

---

## Después de mi aprobación — BUILD

Sigue el orden definido en SPEC 12I paso a paso.

Reglas del BUILD:
- `pnpm build` limpio después de cada paso — no avanzar con errores.
- `npx tsc --noEmit` después de cada paso.
- **No cambiar lógica de componentes** — solo strings y patrones de traducción.
  Si un componente necesita refactoring estructural para soportar i18n,
  parar y notificar antes de continuar.
- Los archivos de datos (`src/data/*.ts`) que hoy contienen texto se migran
  según la estrategia elegida — ninguno queda con texto hardcodeado en un locale.
- El selector de idioma debe funcionar en desktop y mobile desde el Paso 5.
- Al terminar cada paso: confirmar que el cambio de idioma funciona
  para los strings de ese paso antes de avanzar al siguiente.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 12 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Routing confirmado:**
- [ ] `/` sirve el home en inglés
- [ ] `/es` sirve el home en español
- [ ] `/xyz` (ruta inexistente) → 404, no redirige a `/en/xyz`
- [ ] Cambio de idioma en Navbar funciona desktop y mobile
- [ ] Al cambiar de ES→EN el path resultante es correcto (sin prefijo)
- [ ] Al cambiar de EN→ES el path resultante es `/es`

**Traducciones confirmadas:**
- [ ] Navbar: labels en inglés en `/`, en español en `/es`
- [ ] HeroScroll: 3 beats en idioma correcto
- [ ] TrustBar: 6–8 ítems en idioma correcto
- [ ] OriginStory: 4 beats (eyebrow, headline, body) en idioma correcto
- [ ] ExperienceCards: frente + reverso de las 4 cards en idioma correcto
- [ ] ShopCoffee: heading, productos, CTAs en idioma correcto
- [ ] CoffeeQuiz: preguntas, opciones y resultados en idioma correcto
- [ ] MenuVisual: categorías, ítems, tags en idioma correcto
- [ ] Locations: heading, nombres de sede, barrios, días, horarios en idioma correcto
- [ ] Footer: copyright y links en idioma correcto

**SEO y accesibilidad:**
- [ ] `<html lang="en">` en `/`, `<html lang="es">` en `/es`
- [ ] `hreflang` alternates en `<head>` en ambas versiones
- [ ] `aria-label` del mapa Leaflet en idioma correcto
- [ ] `aria-label` de CTAs de Locations en idioma correcto
- [ ] Metadata title/description en idioma correcto en ambas versiones

**Performance:**
- [ ] Sin valores arbitrarios [] en ningún className nuevo
- [ ] Mensajes cargados por locale (no los dos a la vez)
- [ ] Server Components siguen siendo Server (no promovidos a Client por i18n)
```

---

## Nota sobre next-intl v4

next-intl v4 tiene cambios breaking respecto a v3:
- `createSharedPathnamesNavigation` → `createNavigation`
- `NextIntlClientProvider` puede requerir configuración diferente
- `getRequestConfig` puede tener firma diferente

**Antes de escribir cualquier línea de código**, leer:
```
node_modules/next-intl/dist/README.md   (si existe)
node_modules/next-intl/package.json     (exports, entry points)
```
Y revisar los ejemplos en:
```
node_modules/next-intl/dist/docs/       (si existe)
```

Si la documentación local no está disponible, inferir de los tipos
TypeScript en `node_modules/next-intl/dist/` — los tipos son la
fuente de verdad más confiable para la API exacta de v4.

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 12 → ✅ en la tabla de verificación (sección 14)
- Stack: `next-intl` → cambiar estado de "pendiente" a ✅ con nota de configuración
- Nueva sección `## 12.3 Fase 12 — i18n` con:
  - Estrategia de datos elegida
  - Estructura de routing (locales, defaultLocale, localePrefix)
  - Dónde vive el provider
  - Patrón getTranslations / useTranslations
  - Estructura de `messages/`
  - Selector de idioma: componente y ubicación
- Bugs encontrados → sección 15
- Decisiones de diseño → sección 16
- Fase siguiente → **Fase 13 — Performance audit + accesibilidad**

---

Empieza con la SPEC completa.
Responde cada sección (12A hasta 12I) antes de escribir código.
