import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface p-16 flex flex-col gap-16">

      {/* ── SectionTitle variants ─────────────────────────────────────── */}
      <section className="flex flex-col gap-12">
        <SectionTitle as="h1" size="display" eyebrow="Quito · Ecuador · Est. 2018">
          Del origen ecuatoriano al grano perfecto
        </SectionTitle>

        <SectionTitle size="headline-md" eyebrow="Nuestra historia">
          Café de especialidad tostado en origen
        </SectionTitle>

        <SectionTitle size="headline-sm">
          Proceso lavado · 2800 msnm
        </SectionTitle>

        <SectionTitle size="headline-md" align="center" eyebrow="Awards">
          Reconocimiento internacional
        </SectionTitle>
      </section>

      {/* ── Button variants × sizes ───────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <SectionTitle size="headline-sm" eyebrow="Componente">Button</SectionTitle>

        {/* Primary */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Comprar — sm</Button>
          <Button size="md">Comprar — md</Button>
          <Button size="lg">Comprar — lg</Button>
        </div>

        {/* Secondary */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="secondary" size="sm">Ver menú — sm</Button>
          <Button variant="secondary" size="md">Ver menú — md</Button>
          <Button variant="secondary" size="lg">Ver menú — lg</Button>
        </div>

        {/* Ghost */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="ghost" size="sm">Leer más — sm</Button>
          <Button variant="ghost" size="md">Leer más — md</Button>
          <Button variant="ghost" size="lg">Leer más — lg</Button>
        </div>

        {/* Link */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="link" size="sm">Ver todos — sm</Button>
          <Button variant="link" size="md">Ver todos — md</Button>
          <Button variant="link" size="lg">Ver todos — lg</Button>
        </div>

        {/* Loading states */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button loading>Procesando...</Button>
          <Button variant="secondary" loading>Cargando...</Button>
          <Button variant="ghost" loading>Enviando...</Button>
        </div>

        {/* Disabled */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button disabled>Agotado</Button>
          <Button variant="secondary" disabled>No disponible</Button>
        </div>

        {/* As anchor */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button href="/shop">Ir a la tienda →</Button>
          <Button variant="secondary" href="/menu">Ver menú →</Button>
        </div>
      </section>

    </main>
  )
}
