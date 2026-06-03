import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    /* pt-navbar ensures content clears the fixed navbar on non-hero pages */
    <div className="min-h-screen bg-surface pt-navbar">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 flex flex-col gap-16">

        {/* SectionTitle variants */}
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

        {/* Button variants */}
        <section className="flex flex-col gap-8">
          <SectionTitle size="headline-sm" eyebrow="Componente">Button</SectionTitle>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Primary sm</Button>
            <Button size="md">Primary md</Button>
            <Button size="lg">Primary lg</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="sm">Secondary sm</Button>
            <Button variant="secondary">Secondary md</Button>
            <Button variant="secondary" size="lg">Secondary lg</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost" size="sm">Ghost sm</Button>
            <Button variant="ghost">Ghost md</Button>
            <Button variant="ghost" size="lg">Ghost lg</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="link" size="sm">Link sm</Button>
            <Button variant="link">Link md</Button>
            <Button variant="link" size="lg">Link lg</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button loading>Procesando...</Button>
            <Button variant="secondary" loading>Cargando...</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Agotado</Button>
            <Button variant="secondary" href="/shop">Como anchor →</Button>
          </div>
        </section>

      </div>
    </div>
  )
}
