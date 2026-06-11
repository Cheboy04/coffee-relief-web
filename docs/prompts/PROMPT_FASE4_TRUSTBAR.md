# Fase 4 — TrustBar
# Primera sección de contenido después del HeroScroll

---

Retomamos Coffee Relief Web.
Lee el `HANDOFF.md` y el `DESIGN.md` antes de continuar.
Ejecuta `pnpm build` — debe pasar limpio antes de tocar cualquier archivo.

Fases 0–3 completadas y verificadas. Avanzamos a la **Fase 4 — TrustBar**.
Ciclo SDD obligatorio: SPEC → mi aprobación → BUILD → VERIFY.

---

## Contexto narrativo

La TrustBar es la primera sección que el usuario ve después de que el hero
termina su viaje (taza → granos → funda kraft).
Su función es una sola: **aterrizar la credibilidad de la marca en 3 segundos**.
No es decorativa. Es el momento donde Coffee Relief dice sin decir:
*"somos reales, reconocidos y confiables."*

Visualmente debe ser **sobria y rápida** — un marquee horizontal que se mueve
solo, sin que el usuario tenga que interactuar. Contrasta con la intensidad
del hero: después de 300vh de scroll, el usuario descansa aquí.

---

## Lo que ya existe y debes respetar

Del HANDOFF.md, sección 16:

**Keyframes ya definidos en `globals.css`:**
```css
--animate-trust-scroll: trust-scroll 30s linear infinite;
@keyframes trust-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```
Usa `animate-trust-scroll` como clase. No redefinir los keyframes.

**Tokens disponibles relevantes:**
```
bg-surface-low       #f6f3f2   ← fondo de la sección
border-primary/10               ← bordes superior e inferior
text-on-surface-variant         ← color del texto de ítems
text-label-md uppercase         ← estilo tipográfico de ítems
py-6                            ← padding vertical de la sección
```

**Implicación de Tailwind v4:**
No existe `tailwind.config.ts`. Si durante el BUILD necesitas un token
que no existe, agrégalo en el bloque `@theme {}` de `globals.css`.
Nunca valores arbitrarios `[]` en className.

---

## SPEC — lo que necesito ANTES de que escribas código

### SPEC 4A — Arquitectura de archivos

Lista exacta de archivos a crear. Para cada uno:
ruta, responsabilidad, Server o Client Component, y por qué.

La TrustBar no tiene estado ni interacción — ¿puede ser 100% Server Component?
¿O la animación CSS requiere `'use client'`? Justifica.

¿Necesita su propio directorio (`TrustBar/`) o un archivo único
(`TrustBar.tsx`) es suficiente dada su complejidad?

### SPEC 4B — Tipos y contratos

Define los tipos TypeScript para los ítems del marquee:

```typescript
// ¿Qué forma tiene cada ítem del TrustBar?
interface TrustItem {
  // id, label, icon/logo, ¿url?, ¿tipo (award | stat | attribute)?
}

// ¿Los datos viven en /data/trustBar.ts o están hardcodeados en el componente?
// Justifica — ¿es contenido que cambia con frecuencia?
```

### SPEC 4C — Contenido de los ítems

Propón los ítems exactos del marquee. Considera:
- La marca tiene: Sprudge Awards, SCA, 4.7★ Google, 700+ reseñas,
  "Tostado en origen", "Comercio directo", "Quito, Ecuador",
  años de experiencia, cafetería física.

Usa este formato para cada ítem:
```typescript
{ id: '', label: '', icon: '...' }
// icon puede ser: emoji, SVG path, texto símbolo (·, ★, etc.), o 'none'
```

Propón entre 6 y 8 ítems. Suficientes para que el loop se vea natural.
El contenido se duplica en el DOM para el loop seamless —
con 6–8 ítems originales el total visible es 12–16, perfecto para marquee.

Tono: `text-label-md uppercase` — conciso, máximo 4 palabras por ítem.

### SPEC 4D — Layout y estructura HTML

Muéstrame el esqueleto HTML exacto (sin implementar, solo estructura):

```html
<section ...>        ← ¿qué clases? ¿aria-label?
  <div ...>          ← overflow-hidden wrapper
    <div ...>        ← marquee track (flex, animación)
      <!-- ítem original × N -->
      <!-- ítem duplicado × N (para seamless loop) -->
    </div>
  </div>
</section>
```

Responde:
1. ¿El track duplicado se genera en JSX con `.concat()` o con CSS?
   (JSX duplicado es más simple y SSR-friendly — CSS requiere pseudo-elements)
2. ¿Los ítems duplicados tienen `aria-hidden="true"` para no repetirlos
   a lectores de pantalla?
3. ¿Hay un separador visual entre ítems? ¿Qué elemento/símbolo?
4. ¿La sección tiene `role="marquee"` o algún aria attribute especial?

### SPEC 4E — Diseño de cada ítem

Define la anatomía visual de un ítem individual:

```
[icono/logo]  [texto label]
```

Responde:
1. ¿El ícono es un SVG inline, un emoji, o un símbolo tipográfico?
   Para Sprudge y SCA: ¿usamos texto abreviado o un SVG de logo?
   (Nota: los logos reales de premios tienen restricciones de uso —
   propón una alternativa si no tenemos los assets.)
2. ¿Cuál es el gap entre ícono y texto? (token de spacing)
3. ¿Cuál es el gap entre un ítem y el siguiente?
4. ¿Los ítems de tipo "award" se ven diferente a los de tipo "stat"?
   (ej: Sprudge Award puede tener acento dorado `text-secondary`,
   mientras "Quito, Ecuador" es neutro `text-on-surface-variant`)

### SPEC 4F — Animación y velocidad

El keyframe `trust-scroll` ya existe con `30s linear infinite`.
Responde antes de implementar:

1. ¿30 segundos es la velocidad correcta para el número de ítems propuesto?
   Si cambia el número de ítems, ¿ajustamos la duración?
   Regla de thumb: ~80–100px por segundo se siente natural en marquees.
   Calcula: (ancho estimado del track / velocidad) = duración.

2. ¿La animación se pausa al hacer hover sobre el marquee?
   (`animation-play-state: paused` en hover)
   ¿O corre siempre? Justifica con UX.

3. `prefers-reduced-motion`: el HANDOFF dice "pausar la animación,
   mostrar los ítems estáticos". Define exactamente:
   - ¿Los ítems estáticos se muestran en una sola fila con overflow visible?
   - ¿O se muestran centrados con `justify-center`?
   - ¿Se oculta el contenido duplicado?

4. ¿Hay fade-in de entrada (Framer Motion) cuando la sección
   entra en viewport? ¿O aparece directamente sin animación?
   (Considera que el hero ya fue intenso — la TrustBar puede aparecer
   directamente sin fanfarria adicional.)

### SPEC 4G — Integración en page.tsx

La TrustBar es la segunda sección del home, inmediatamente debajo del HeroScroll.
Define cómo queda `src/app/page.tsx` después de esta fase:

```typescript
// Muéstrame el orden exacto de secciones en page.tsx
// incluyendo los placeholders de fases futuras
export default function HomePage() {
  return (
    <main>
      <HeroScroll />
      <TrustBar />
      {/* Fase 5: OriginStory */}
      {/* Fase 6: ExperienceCards */}
      {/* ... */}
    </main>
  )
}
```

¿La TrustBar necesita `id="trust"` u otro anchor? ¿Por qué o por qué no?

---

## Criterios de aprobación de la SPEC

Aprobaré cuando vea:

- [ ] Justificación Server vs. Client Component
- [ ] Tipo `TrustItem` completo
- [ ] Los 6–8 ítems propuestos con contenido real
- [ ] Esqueleto HTML con aria attributes
- [ ] Decisión sobre duplicado JSX vs. CSS
- [ ] Diseño de ítem individual (ícono + gap + texto)
- [ ] Cálculo de duración de animación según número de ítems
- [ ] Comportamiento `prefers-reduced-motion` definido
- [ ] Actualización de `page.tsx` con TrustBar integrada

---

## Después de mi aprobación — BUILD

La TrustBar es simple — un solo ciclo de build:

```
Paso 1  src/data/trustBar.ts (o constante en componente)  ← datos de ítems
Paso 2  src/components/sections/TrustBar.tsx              ← componente completo
Paso 3  src/app/page.tsx                                  ← integrar TrustBar
```

Confirma TypeScript limpio después de cada paso.
Si necesitas un token nuevo, agrégalo a `globals.css @theme` y documéntalo aquí.

---

## VERIFY — evidencia requerida al terminar

```markdown
## Fase 4 — Completada ✓

**Build:** [output de pnpm build — 0 errores]
**Types:** [output de npx tsc --noEmit — 0 errores]
**Lint:**  [output de pnpm lint — 0 warnings]

**Visual confirmado:**
- [ ] Marquee se mueve continuamente sin saltos ni glitches
- [ ] El loop es seamless (no se ve el reinicio)
- [ ] Ítems legibles: text-label-md uppercase, color correcto
- [ ] Separadores visibles entre ítems
- [ ] Bordes superior e inferior visibles (border-primary/10)
- [ ] Sección aparece inmediatamente debajo del HeroScroll sin gap raro
- [ ] reduced-motion: ítems estáticos, sin animación
- [ ] Hover pausa la animación (si se especificó en spec)
- [ ] No hay hydration errors en consola
- [ ] En mobile el marquee se ve y funciona correctamente

**Tokens:**
- [ ] Sin valores arbitrarios [] en ningún className
- [ ] Si se agregó token nuevo: documentado en HANDOFF.md sección 6
```

---

## Nota sobre el HANDOFF.md

Al terminar esta fase, actualiza el `HANDOFF.md`:
- Cambia el estado de Fase 4 a ✅ en la tabla de verificación (sección 11)
- Agrega cualquier decisión de diseño relevante a la sección 14
- Agrega cualquier bug encontrado y su resolución a la sección 13
- Actualiza "Fase siguiente" en la sección 16 a: **Fase 5 — OriginStory**

---

Empieza con la SPEC completa.
Responde cada sección (4A hasta 4G) antes de escribir código.
