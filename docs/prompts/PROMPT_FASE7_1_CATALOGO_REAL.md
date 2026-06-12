# Fase 7.1 — ShopCoffee: Catálogo real (Bold / Tropical / Immersive)
# Actualización de contenido + ajuste estructural sobre la Fase 7 ya construida
# Reemplaza los 3 productos placeholder por el catálogo real de Coffee Relief

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `docs/DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–7 completadas y verificadas. Esta NO es la Fase 8 (MenuVisual) —
es una **actualización de contenido con implicaciones estructurales** sobre
`ShopCoffee` (Fase 7), antes de avanzar a Fase 8.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto

En la Fase 7 se construyó `ShopCoffee` con 3 productos placeholder
(Valle del Chota / Pichincha 2850 / Zamora Kraft), cada uno con 3 tamaños
(250g/500g/1kg) a precios distintos, y un `SizeSelector` que cambia el
precio dinámicamente.

Ahora tenemos el **catálogo real de Coffee Relief**. Los 3 productos que
van en el home son diferentes:

| Producto | Notas reales (del catálogo) | Precio | SKU |
|---|---|---|---|
| **Bold Relief** | Chocolate-forward, dulzura estructurada, cuerpo balanceado, low acidity | $36.50 / 1lb | CR-US-1LB-B-2026 |
| **Tropical Relief** | Brillante, floral, complejidad cítrica, medium roast | $36.50 / 1lb | CR-US-1LB-T-2026 |
| **Immersive Relief** | Suave, balanceado, dulzura accesible, medium roast | $36.50 / 1lb | CR-US-1LB-I-2026 |

**Cambio crítico:** los 3 son **1 lb a precio fijo $36.50** — no hay
variantes de tamaño/precio como en los placeholders. Esto rompe el
`SizeSelector` construido en Fase 7.

**Imágenes reales** (ya provistas, adjuntas a esta conversación, renombradas
y listas en `public/images/products/`):
```
bold.webp        ← funda ilustrada "Bold" (naranja/ocre, escena de café)
tropical.webp    ← funda ilustrada "Tropical" (roja, escena activa/outdoor)
immersive.webp   ← funda ilustrada "Immersive" (verde/crema, escena hogareña)
```
Dimensiones reales: ~1075×1463px (bold/tropical), ~1104×1424px (immersive) —
todas ratio ~3:4 portrait, consistente con el `sizes`/`object-fit: cover`
ya definido en `ProductCard`.

**Decisiones ya tomadas — no cambiar:**

1. **Los 3 productos del home son Bold / Tropical / Immersive**, reemplazando
   Valle del Chota / Pichincha 2850 / Zamora Kraft.
2. **Mapeo de intensidad para CoffeeQuiz** (mismo algoritmo de Fase 7,
   solo cambia el mapeo final):
   ```
   intenso → Bold Relief       (chocolate, low acidity, cuerpo)
   medio   → Immersive Relief  (smooth, balanced, accesible)
   suave   → Tropical Relief   (floral, cítrico, brillante)
   ```
   El empate sigue resolviéndose a `medio` (ahora = Immersive Relief).
3. **`SizeSelector` se elimina.** Precio fijo $36.50 / 1lb. La card se
   simplifica — sin selector de tamaño.
4. **Bundles (Origin Collection, Roaster Selection 2.2lb, Roaster's Bulk 5lb)
   quedan fuera de esta fase** — son para la futura página `/tienda`.
   Documentar en HANDOFF como pendiente (ya existe la entrada en el roadmap
   para `/tienda` — agregar el dato de que estos 3 bundles son su contenido).
5. **Imágenes ya existen y van en `public/images/products/{id}.webp`** —
   no usar placeholders de color para estos 3 productos.

---

## Lo que NO cambia (ya construido en Fase 7, reutilizar)

- `data-product-id={product.id}` para el highlight del CoffeeQuiz
- `data-hero-target="first"` en la primera card (Bold)
- Patrón `aria-live="polite" aria-atomic="true"` — aunque el precio ya no
  cambie dinámicamente (es fijo), revisar si sigue siendo necesario o se
  simplifica (ver SPEC 7.1C)
- CTA "Agregar" → "Agregado ✓" con `setTimeout` 2s — se mantiene igual
- `HeroTransition` ya importa `PRODUCTS[0]` — Bold Relief será `PRODUCTS[0]`,
  así que el morph del hero termina mostrando Bold Relief automáticamente.
  Verificar que el contenido mostrado en `HeroTransition` (origin label,
  name, "Desde $X") siga teniendo sentido con los datos reales de Bold.
- CoffeeQuiz: las 3 preguntas y su sistema de puntos `{ suave, medio, intenso }`
  se mantienen igual — solo cambia el mapeo final intensidad→producto (punto 2).
- Patrón de imagen condicional: `product.image ? <Image> : <div placeholder>`
  — ya existe, ahora los 3 productos tendrán `image` definido.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 7.1A — Cambios en `src/types/index.ts` (Product / ProductSize)

1. Lee el `Product`/`ProductSize` actual en `src/types/index.ts`.
2. Define los cambios exactos:
   - ¿`ProductSize[]` se elimina del tipo `Product`, o se deja opcional
     (`sizes?: ProductSize[]`) para no romper compatibilidad si se reutiliza
     en `/tienda` con los bundles que sí tendrán variantes?
   - ¿Cómo se representa el precio fijo? `price: number` directo en `Product`,
     o se mantiene `sizes: [{ id: '1lb', label: '1 lb', price: 36.50 }]` con
     un solo elemento (para minimizar cambios en componentes que ya leen
     `product.sizes`)?
   - Justifica cuál opción implica menos refactor en `ProductCard` y
     `HeroTransition`, dado que ambos ya leen la forma actual de `Product`.
3. Campos nuevos que necesita `Product` para el catálogo real:
   ```typescript
   interface Product {
     id: string              // 'bold' | 'tropical' | 'immersive'
     name: string            // 'Bold Relief'
     sku: string             // 'CR-US-1LB-B-2026' — ¿se usa en UI o solo metadata?
     // ...campos existentes: origin, flavorNotes, intensity, description, etc.
     image: string           // '/images/products/bold.webp' — ya no opcional
     imageAlt: string
   }
   ```
   ¿`sku` se muestra en la UI (ej: en el reverso/detalle) o es solo metadata
   para una futura integración de carrito/checkout? Define y justifica.

### SPEC 7.1B — Datos: `src/data/products.ts` actualizado

Propón el array `PRODUCTS` completo con los 3 productos reales.
Usa las descripciones del catálogo como base para `description`/`flavorNotes`,
pero adáptalas al tono editorial del proyecto (premium, sensorial, sin
clichés — consistente con OriginStory/ExperienceCards). No copies el inglés
literal del catálogo si el resto del sitio está en español — traduce y
adapta manteniendo el sentido.

```typescript
const PRODUCTS: Product[] = [
  {
    id: 'bold',
    name: 'Bold Relief',
    sku: 'CR-US-1LB-B-2026',
    origin: '',              // ¿qué origin label usamos? El catálogo dice
                              // "Ecuador specialty coffee" genérico — ¿mantenemos
                              // los orígenes específicos de la Fase 7 (Valle del
                              // Chota, etc.) o usamos algo nuevo/genérico acorde
                              // al catálogo real?
    flavorNotes: '',         // adaptar de "Chocolate-forward... structured sweetness"
    intensity: 'intenso',
    roastLevel: '',          // catálogo no especifica para Bold — ¿inferir
                              // 'dark' dado "low acidity" + "chocolate-forward"?
    description: '',
    price: 36.50,            // o sizes: [...] según SPEC 7.1A
    image: '/images/products/bold.webp',
    imageAlt: '',
  },
  // tropical, immersive
]
```

**Pregunta clave sobre `origin`:** la Fase 7 usaba regiones específicas de
Ecuador (Valle del Chota, Nanegal-Pichincha, Zamora Chinchipe) que eran
parte del storytelling de OriginStory/origen. El catálogo real no especifica
región por producto, solo "Ecuador" / "Montañas del Ecuador" (visible en las
fundas). Propón cómo resolver esto:
- Opción A: mantener las 3 regiones de Fase 7 asignadas a Bold/Tropical/Immersive
  (reasignar, no inventar nuevas) — mantiene coherencia narrativa con OriginStory
- Opción B: usar "Montañas del Ecuador" genérico para los 3, como dice la funda real
- Opción C: otra propuesta

Justifica tu elección considerando la coherencia con OriginStory (Fase 5,
que ya estableció 4 regiones específicas como parte de la identidad de marca).

### SPEC 7.1C — Cambios en `ProductCard`

1. **Eliminar `SizeSelector`** — ¿se borra el archivo `SizeSelector.tsx` por
   completo, o se deja sin usar por si se reutiliza en `/tienda` para los
   bundles (que sí tendrán variantes de tamaño)?
   Recomendación: si Fase 7.1 es estrictamente sobre el home y `/tienda` es
   una fase futura no planificada en detalle, ¿vale la pena mantener código
   muerto? Decide y justifica — el principio del proyecto es evitar código
   sin uso, pero también evitar reescribir trabajo si `/tienda` está cerca
   en el roadmap. Da tu recomendación.

2. **Layout simplificado de la card** sin selector — define la nueva
   composición:
   ```
   ┌─────────────────────────┐
   │   [imagen real 3:4]      │
   │                          │
   │  [nombre font-display]    │
   │  [origin + flavorNotes]   │
   │  [$36.50 — precio fijo]   │
   │  [CTA "Agregar"]          │
   └─────────────────────────┘
   ```
   - ¿El precio fijo necesita `aria-live`? (ya no cambia dinámicamente —
     probablemente no, pero confirma)
   - ¿"1 lb" se muestra junto al precio (ej: "$36.50 / 1 lb") o se omite
     porque los 3 productos son iguales en formato?
   - ¿Cambia la altura de la card al quitar el selector? Si `h-experience-card`
     o el token de altura de ProductCard estaba calibrado para incluir el
     selector, ¿necesita ajuste? Revisa el token actual y propone si cambia.

3. **Imagen real:** confirma que `next/image` con `fill` + `object-cover` +
   el `sizes` ya definido en Fase 7 funciona directamente con las nuevas
   rutas — no debería requerir cambios de lógica, solo de datos. Confirma
   o señala si algo del componente asumía `placeholderColor` como fallback
   visual que ahora queda sin uso (¿se elimina ese campo del tipo, o se
   deja como fallback de seguridad si `image` falla al cargar?).

### SPEC 7.1D — CoffeeQuiz: actualizar mapeo

1. En `useQuizLogic.ts`, el mapeo `intensidad ganadora → productId` cambia:
   ```
   intenso → 'bold'
   medio   → 'immersive'
   suave   → 'tropical'
   ```
   Confirma que las 3 preguntas y el sistema de puntos `{ suave, medio, intenso }`
   no necesitan cambios — solo el mapeo final. Si alguna opción de pregunta
   tenía texto que mencionaba algo específico de Valle del Chota/Pichincha/Zamora
   (revisa `questions.ts`), actualízalo para que sea coherente con
   Bold/Tropical/Immersive.

2. El mensaje de resultado ("Tu café es [nombre]" + mensaje personalizado)
   — propón el texto actualizado para los 3 productos reales, tono
   consistente con el resto del copy.

### SPEC 7.1E — HeroTransition: verificar coherencia con Bold Relief

`HeroTransition` ya muestra `PRODUCTS[0]` (origin label + name + "Desde $X").
Con Bold Relief como `PRODUCTS[0]`:
1. ¿"Desde $X" sigue siendo el texto correcto si el precio ahora es fijo
   (no "desde", porque no hay variantes más caras)? Propón el texto correcto
   (ej: "$36.50" sin "Desde", o mantener "Desde" si se considera que en el
   futuro `/tienda` tendrá variantes de Bold a otros precios).
2. Confirma que el `origin label` mostrado en `HeroTransition` es coherente
   con la decisión de SPEC 7.1B sobre `origin`.

### SPEC 7.1F — Imágenes: confirmación de assets

Las 3 imágenes ya están provistas y nombradas correctamente:
```
public/images/products/bold.webp
public/images/products/tropical.webp
public/images/products/immersive.webp
```
1. Confirma el `alt` text de cada una — descriptivo de la ilustración real
   de la funda (no genérico). Ejemplo: la funda Bold muestra una ilustración
   de una persona sentada en una cafetería con un mural de montañas; Tropical
   muestra una persona en una escena activa/outdoor; Immersive muestra una
   persona preparando café en casa con un Chemex/V60.
2. ¿El `imageAlt` debe mencionar que es "la funda/empaque" o describir la
   ilustración + el nombre del producto? Define el patrón para los 3.

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Decisión sobre `Product`/`ProductSize` (precio fijo vs. sizes con 1 elemento) justificada
- [ ] `PRODUCTS[]` completo con los 3 productos reales, copy adaptado al tono del sitio
- [ ] Decisión sobre `origin` (regiones de Fase 7 vs. genérico) justificada
- [ ] `SizeSelector`: decisión de eliminar o dejar sin uso, justificada
- [ ] Layout simplificado de `ProductCard` sin selector
- [ ] Mapeo actualizado del CoffeeQuiz (intenso→bold, medio→immersive, suave→tropical)
- [ ] `questions.ts` revisado por referencias a los productos viejos
- [ ] Mensajes de resultado del quiz actualizados para los 3 productos reales
- [ ] `HeroTransition` con texto de precio coherente (con/sin "Desde")
- [ ] `alt` text descriptivo y real para las 3 imágenes

---

## Después de mi aprobación — BUILD

Implementa en este orden exacto:

```
Paso 1   src/types/index.ts          ← ajustar Product/ProductSize según 7.1A
Paso 2   src/data/products.ts        ← PRODUCTS reales (Bold/Tropical/Immersive)
Paso 3   ProductCard/index.tsx       ← layout simplificado, sin SizeSelector
Paso 4   ProductCard/SizeSelector.tsx ← eliminar o dejar según decisión 7.1C
Paso 5   CoffeeQuiz/useQuizLogic.ts  ← actualizar mapeo intensidad→producto
Paso 6   CoffeeQuiz/questions.ts     ← revisar/actualizar referencias a productos
Paso 7   CoffeeQuiz/index.tsx        ← actualizar mensajes de resultado
Paso 8   HeroScroll/HeroTransition.tsx ← verificar texto de precio con Bold real
```

Reglas del BUILD:
- `npx tsc --noEmit` limpio después de cada paso.
- Si eliminar `SizeSelector.tsx` rompe imports en otros archivos, actualízalos
  en el mismo paso.
- Las imágenes ya están en `public/images/products/` — no es necesario
  copiarlas, solo referenciarlas desde `products.ts`.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 7.1 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Visual confirmado:**
- [ ] Las 3 ProductCards muestran imágenes reales (bold/tropical/immersive)
- [ ] Precio fijo $36.50 visible, sin selector de tamaño
- [ ] CTA "Agregar"→"Agregado ✓" sigue funcionando
- [ ] HeroTransition muestra Bold Relief con datos/precio correctos al final del hero

**CoffeeQuiz:**
- [ ] Cada combinación de respuestas recomienda bold/immersive/tropical correctamente
- [ ] Mensajes de resultado coherentes con los 3 productos reales
- [ ] Highlight + scroll a la card recomendada sigue funcionando

**Accesibilidad:**
- [ ] alt text descriptivo en las 3 imágenes
- [ ] Jerarquía de headings sin cambios respecto a Fase 7

**Código:**
- [ ] Sin imports rotos tras eliminar/deshabilitar SizeSelector
- [ ] Sin valores arbitrarios [] nuevos
```

---

## Nota sobre el HANDOFF.md

Al terminar, actualiza el `HANDOFF.md`:
- `PRODUCTS` real documentado (tabla con Bold/Tropical/Immersive, precios, SKUs)
- Mapeo CoffeeQuiz actualizado en la sección de Fase 7
- Decisión sobre `SizeSelector` (eliminado o código muerto documentado)
- Decisión sobre `origin` — actualizar tabla de regiones si cambia
- Roadmap: anotar que los 3 bundles (Origin Collection, Roaster Selection
  2.2lb, Roaster's Bulk 5lb) son contenido pendiente para `/tienda`
- Assets pendientes: remover `valle-chota.webp`/`pichincha-2850.webp`/
  `zamora-kraft.webp` de la lista de "pendientes" (ya no aplican) y confirmar
  `bold.webp`/`tropical.webp`/`immersive.webp` como "recibidos"

---

Empieza con la SPEC completa.
Responde cada sección (7.1A hasta 7.1F) antes de escribir código.
Si necesitas leer `src/types/index.ts`, `ProductCard/index.tsx`,
`SizeSelector.tsx`, `useQuizLogic.ts`, `questions.ts` o `HeroTransition.tsx`
para fundamentar la SPEC, hazlo antes de responder.
