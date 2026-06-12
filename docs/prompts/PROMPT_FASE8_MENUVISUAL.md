# Fase 8 — MenuVisual
# Sección editorial del menú de brunch/cafetería — la "carta" como pieza de marca
# Sexta sección del home, después de ShopCoffee

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–7.1 completadas y verificadas. Avanzamos a la **Fase 8 — MenuVisual**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto narrativo

Después de TrustBar (credibilidad), OriginStory (valores), ExperienceCards (las 4 puertas)
y ShopCoffee (compra de café en grano), MenuVisual presenta **lo que se vive en la
cafetería física**: el menú de brunch y bebidas.

No es un PDF de menú escaneado ni una tabla de precios densa. Es una **vitrina editorial**:
el usuario ya decidió (vía ExperienceCards) que quiere "vivir" Coffee Relief —
visitar la cafetería o reservar el brunch. MenuVisual le muestra *qué va a encontrar*
cuando llegue, con el mismo lenguaje fotográfico/tipográfico del resto del sitio.

El objetivo de conversión es suave: no hay "agregar al carrito" aquí (eso es ShopCoffee).
El CTA de esta sección apunta a reservar mesa o ver el menú completo — coordina con
la Card "Menú Brunch" / "Reservar experiencia" de ExperienceCards (Fase 6), que ya
prometía esto.

---

## Lo que ya existe y debes respetar

**Patrón de imagen opcional con fallback a placeholder** (HANDOFF §17):
```tsx
{item.image ? (
  <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="..." />
) : (
  <div role="img" aria-label={item.imageAlt} className="absolute inset-0"
    style={{ backgroundColor: item.placeholderColor }} />
)}
```
Aplica el mismo patrón aquí — **no asumas que los assets fotográficos del menú ya existen**.

**Tokens y reglas de diseño:**
- `py-section` (120px) entre secciones — nunca menos
- `bg-surface` / `bg-surface-low` — alternar con la sección anterior (ShopCoffee usa `bg-surface`)
- `font-display` solo headings, `font-sans` body, `text-label-md uppercase` para eyebrows/categorías
- Sin valores arbitrarios `[]` — tokens nuevos en `globals.css @theme`/`@utility`
- `<section aria-labelledby="...">`, jerarquía `h2` sección → `h3` categorías/ítems

**Patrones de accesibilidad ya probados en el proyecto:**
- `CoffeeQuiz`: `<fieldset>/<legend>` + radios estilizados como pills para selección
- `ExperienceCards`: `aria-hidden` en hijos en vez de `aria-expanded` sobre `<article>`
- Touch detection: `useState(() => matchMedia('(hover: none)').matches)` — lazy initializer, nunca en `useEffect`

---

## Lecciones de bugs de fases anteriores — aplicar aquí

**De Fase 7 / 7.1 (ShopCoffee):**
- Imágenes opcionales: el componente debe renderizar correctamente con `image: undefined`
  en todos los ítems — la spec debe definir el placeholder por categoría.
- CTA temporal sin Zustand: si esta sección necesita algún estado de interacción
  efímero (ej. "ítem destacado"), reutilizar el patrón `useState` + `setTimeout` + cleanup.

**De Fase 6 (ExperienceCards):**
- Si hay filtros/categorías interactivas: evaluar `<fieldset>/<legend>` con radios
  estilizados (patrón CoffeeQuiz) antes que un patrón de tabs ARIA complejo
  (`role="tablist"` requiere manejo de teclado con flechas — mayor costo de a11y).
- Si hay animación de entrada: `Framer Motion whileInView` ya está cargado en el
  proyecto — preferible a GSAP para staggers simples (Decisión 18, HANDOFF §16).

**De Fase 3/5 (GSAP):**
- Si por algún motivo se necesita GSAP (no debería para esta sección), dynamic
  import dentro de `useEffect` + `gsap.context` + `ctx.revert()`. Evitar si Framer
  Motion o CSS puro resuelven el caso.

**Tailwind v4:**
- No existe `tailwind.config.ts`. Tokens nuevos en `globals.css @theme {}`/`@utility`.
- `IntersectionObserver threshold` máximo `0.1` en secciones altas.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 8A — Arquitectura de archivos

Lista exacta de archivos a crear. Para cada uno:
ruta, responsabilidad, Server vs. Client Component, y por qué.

Considera:
- Si la sección es estática (sin filtros interactivos), ¿puede ser 100% Server Component?
- Si hay filtro de categorías, ¿qué componente necesita `'use client'` y cuál es
  el árbol mínimo que requiere esa directiva?
- ¿Los datos del menú viven en `src/data/menu.ts`?

Formato esperado:
```
src/components/sections/MenuVisual/
  index.tsx              — [Server|Client] — razón
  ???.tsx                — [Server|Client] — razón
  types.ts               — tipos locales
src/data/menu.ts         — datos del menú
```

¿Necesita barrel export en `sections/index.ts`?

### SPEC 8B — Tipos y contratos

Define los tipos TypeScript completos. Sin TODOs ni `any`.

```typescript
interface MenuCategory {
  id: string
  // label, eyebrow, ¿icono/símbolo?
}

interface MenuItem {
  id: string
  categoryId: string
  name: string             // font-display
  description: string      // 1 línea, sensorial
  price: string            // formato — ¿"$8.50" o "8.50"?
  image?: string           // opcional — patrón ya establecido
  imageAlt: string
  placeholderColor: string // token del design system
  // ¿tags? (ej: "Vegano", "Sin gluten", "Signature")
}

interface MenuVisualProps {
  // ¿props externos o datos hardcodeados desde data.ts?
}
```

Define también:
- ¿Cuántas categorías propones? (ej: Cafés de especialidad, Brunch salado,
  Brunch dulce/pastelería, Bebidas frías) — entre 2 y 4, justifica el número.
- ¿El filtro de categorías es obligatorio para la fase, o la sección puede
  mostrar todas las categorías agrupadas sin necesidad de filtro interactivo?
  (Considera: una sección sin estado es más simple, más performante, y
  el menú completo de un brunch premium no suele ser larguísimo)

### SPEC 8C — Contenido del menú

Propón el copywriting completo en español: categorías + ítems.

Tono: igual que el resto del sitio — premium, sensorial, concreto, sin clichés.
Coherente con la identidad ya establecida (Quito, 2.850m, volcánico, Valle del
Chota, tueste artesanal, Sprudge/SCA).

```typescript
const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'cafe', label: '', eyebrow: '' },
  // ...
]

const MENU_ITEMS: MenuItem[] = [
  {
    id: '',
    categoryId: 'cafe',
    name: '',              // máx 4-5 palabras
    description: '',       // 1 línea — ingrediente/técnica específica
    price: '',
    image: undefined,      // placeholder por ahora
    imageAlt: '',
    placeholderColor: '',  // token — ver paleta abajo
  },
  // 8-12 ítems totales distribuidos entre categorías
]
```

**Colores placeholder disponibles** (reutilizar tokens existentes, no crear nuevos
si no es necesario):
```
bg-primary-container     #3d2b1f
bg-secondary-container   #fdd7a7
bg-tertiary-container    #2f2f2c
bg-surface-container-high #eae7e7
```

Para cada ítem, incluye un comentario breve sugiriendo el tipo de fotografía real
(plano, luz, composición) cuando lleguen los assets — mismo formato que se usó
en ExperienceCards (Fase 6).

### SPEC 8D — Layout y composición visual

Define la composición desktop y mobile. Esta sección debe sentirse como "la página
de un menú de revista", no como una tabla de e-commerce.

**Desktop:**
1. ¿Grid de cards (imagen + nombre + descripción + precio), o lista editorial
   (imagen lateral + texto, alternando lado como OriginStory)?
2. ¿Cuántas columnas si es grid? ¿Cuántos ítems visibles sin scroll adicional?
3. ¿Las categorías se muestran como secciones separadas con su propio `h3`,
   o como filtro que oculta/muestra ítems?
4. ¿`max-w-content` (1280px) como contenedor, igual que el resto del home?

**Mobile:**
1. ¿1 columna? ¿Scroll horizontal por categoría (carrusel) o vertical simple?
2. Si hay filtro de categorías: ¿cómo se ve en mobile? (pills horizontales
   con scroll, dropdown, o las categorías simplemente se apilan sin filtro)

### SPEC 8E — Diseño del ítem individual

Define la anatomía visual de una card/fila de ítem:

```
[imagen]  [nombre — font-display]
          [descripción — font-sans text-body-md]
          [precio — ¿text-label-md? ¿alineado a la derecha?]
          [¿tag opcional: "Signature", "Vegano"?]
```

1. ¿Aspect ratio de la imagen? (¿reutilizar `aspect-product` o uno nuevo?)
2. ¿El precio tiene tratamiento visual distinto (color `text-secondary`,
   tipografía separada)?
3. Si hay tags (ej. "Vegano", "Sin gluten", "Signature"): ¿son pills con
   `text-label-md uppercase` + fondo `bg-secondary-container`, igual que
   los "Chips/Tags" descritos en DESIGN.md?

### SPEC 8F — Filtro de categorías (si aplica)

Si decidiste en 8B que hay filtro interactivo:

1. ¿Patrón `<fieldset>/<legend>` con radios estilizados como pills
   (como CoffeeQuiz), o botones simples con `aria-pressed`?
2. ¿El filtro cambia el contenido visible (`display:none` / unmount) o
   hace scroll a la sección de la categoría (anchor)?
3. ¿Categoría "Todos" por defecto?
4. `prefers-reduced-motion`: si hay transición de entrada/salida de ítems
   al filtrar, ¿qué pasa en modo reducido? (cambio instantáneo, sin fade)

Si decidiste que NO hay filtro: confirma que todas las categorías se
muestran agrupadas con sus propios headings, y justifica por qué es
la opción correcta para esta fase.

### SPEC 8G — Entrance animation

1. ¿Hay animación de entrada al hacer scroll? Opciones:
   - `animate-fade-up` existente, con stagger por ítem o por categoría
   - Framer Motion `whileInView` (preferido, ya cargado — Decisión 18)
   - Sin animación: la sección aparece directamente
2. Si hay stagger: ¿por categoría completa o por ítem individual?
   (Si son 8-12 ítems, stagger individual puede sentirse lento — define
   el delay máximo aceptable)
3. `prefers-reduced-motion`: sin stagger, ítems visibles directamente.
4. `IntersectionObserver`/`whileInView` threshold: máximo `0.1`.

### SPEC 8H — CTA y cierre de sección

1. ¿Hay un CTA al final de la sección? (ej: "Reservar mesa", "Ver menú completo")
2. ¿A dónde apunta? Considera:
   - `/tienda` aún no existe (pendiente, HANDOFF §12)
   - ¿Existe ya algún anchor de reservas o contacto? Si no, ¿el CTA debe
     apuntar a un anchor `#` placeholder documentado como pendiente,
     igual que se hizo con `/tienda` en ShopCoffee?
3. ¿El CTA reutiliza la variante `secondary` de Button (como ShopCoffee),
   o `primary`? Justifica según jerarquía visual de la página.

### SPEC 8I — Accesibilidad

1. `<section aria-labelledby="...">` + `h2` (¿sr-only o visible? — ShopCoffee
   usa h2 visible por ser sección de conversión, OriginStory/ExperienceCards
   usan sr-only. ¿Cuál encaja mejor para MenuVisual?)
2. Jerarquía: `h2` sección → `h3` por categoría → ¿`h4` o `p` para nombre de ítem?
3. Placeholders de imagen: `role="img"` + `aria-label` descriptivo (patrón establecido)
4. Si hay filtro: navegación por teclado completa (Tab, Enter/Space), estado
   anunciado (`aria-pressed` o radios nativos con `aria-checked` implícito)
5. Contraste de tags/precio sobre los distintos placeholderColor — verificar
   WCAG AA en cada combinación propuesta

### SPEC 8J — Integración en page.tsx

Muéstrame cómo queda `src/app/page.tsx` después de esta fase:

```typescript
export default function HomePage() {
  return (
    <>
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />
      <MenuVisual />
      {/* Fase 9: Sustainability + Awards */}
    </>
  )
}
```

¿La sección necesita `id="menu"` para navegación anchor desde el Navbar?
¿El Navbar (`src/data/navigation.ts`) debe actualizarse con un link a `#menu`?

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Arquitectura Server/Client con frontera justificada (idealmente la mayor
      parte Server si no hay filtro interactivo)
- [ ] Tipos TypeScript completos: `MenuCategory`, `MenuItem`, sin `any`
- [ ] Decisión justificada: ¿filtro interactivo o secciones agrupadas estáticas?
- [ ] Copywriting real de 2-4 categorías y 8-12 ítems en español (no Lorem ipsum)
- [ ] Comentarios de fotografía real por ítem o por categoría
- [ ] Layout desktop y mobile definido con tokens existentes
- [ ] Diseño del ítem individual: imagen, nombre, descripción, precio, tags
- [ ] Si hay filtro: patrón de accesibilidad definido (fieldset/legend vs. botones)
- [ ] Entrance animation con justificación (Framer Motion whileInView preferido)
- [ ] `prefers-reduced-motion` definido
- [ ] CTA de cierre con destino definido (o documentado como pendiente)
- [ ] Accesibilidad completa: headings, aria-labelledby, contraste, teclado
- [ ] Integración en page.tsx + decisión sobre Navbar anchor

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto (ajustar si la SPEC define menos archivos):

```
Paso 1  globals.css                    ← @utility/tokens nuevos si aplica
Paso 2  src/data/menu.ts               ← MenuCategory[] + MenuItem[] con copywriting
Paso 3  MenuVisual/types.ts            ← tipos del componente
Paso 4  MenuItemCard.tsx (o equivalente) ← ítem individual, sin grid/sección
Paso 5  ??? (filtro, si aplica)        ← componente de filtro aislado
Paso 6  MenuVisual/index.tsx           ← compone categorías + ítems + CTA
Paso 7  src/app/page.tsx               ← integrar MenuVisual
Paso 8  src/data/navigation.ts         ← anchor #menu si se decidió en 8J
```

Reglas del BUILD:
- Después de cada paso: `npx tsc --noEmit` — 0 errores antes de continuar.
- Confirma que el componente funciona correctamente con `image: undefined`
  en todos los ítems (placeholder visible, sin errores).
- Tokens nuevos: documentar en HANDOFF.md sección 6.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 8 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Visual confirmado:**
- [ ] Desktop: layout definido en spec correctamente renderizado
- [ ] Desktop: todas las categorías/ítems visibles y legibles
- [ ] Mobile: layout responsive correcto
- [ ] Placeholders de color visibles en todos los ítems (sin imágenes reales aún)
- [ ] Filtro de categorías funcional (si aplica) — desktop y mobile
- [ ] Entrance animation funciona al hacer scroll
- [ ] reduced-motion: sin stagger, contenido visible directamente
- [ ] CTA de cierre visible y funcional (o anchor placeholder documentado)
- [ ] Sección aparece con py-section correcto después de ShopCoffee

**Accesibilidad:**
- [ ] Jerarquía de headings correcta (h2 sección → h3 categorías → ...)
- [ ] aria-labelledby en la sección
- [ ] Placeholders con role="img" + aria-label descriptivo
- [ ] Filtro navegable por teclado con estado anunciado (si aplica)
- [ ] Contraste AA verificado en tags/precio sobre placeholders

**Performance:**
- [ ] Sin valores arbitrarios [] en ningún className
- [ ] Framer Motion / GSAP cleanup correcto si se usó
- [ ] No hay layout shift (CLS ≈ 0) al cargar la sección

**Tokens nuevos en HANDOFF.md sección 6:**
- [ ] Todos los @utility nuevos documentados (o "ninguno")
```

---

## Nota sobre assets — flujo cuando lleguen las fotos del menú

```
1. Recibir fotografías reales por ítem o por categoría (según se defina en SPEC 8C)
2. Colocar en /public/images/menu/ siguiendo convención que se defina
3. Actualizar src/data/menu.ts: image: '/images/menu/...'
4. pnpm build — el patrón de imagen opcional ya maneja el cambio sin tocar componentes
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Estado de Fase 8 → ✅ en la tabla de verificación (sección 14)
- Tokens nuevos → sección 6
- Nueva sección de arquitectura (§ Fase 8 — MenuVisual) siguiendo el formato
  de las secciones 8-12 existentes
- Bugs encontrados y resolución → sección 15
- Decisiones de diseño nuevas → sección 16
- Patrones de código nuevos (si aplica) → sección 17
- page.tsx actualizado → sección 13
- Fase siguiente → **Fase 9 — Sustainability + Awards**

---

Empieza con la SPEC completa.
Responde cada sección (8A hasta 8J) antes de escribir código.
