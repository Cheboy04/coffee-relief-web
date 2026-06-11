---
name: Coffee Relief
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4f453f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#81756e'
  outline-variant: '#d2c4bc'
  surface-tint: '#705a4c'
  primary: '#26170c'
  on-primary: '#ffffff'
  primary-container: '#3d2b1f'
  on-primary-container: '#ac9181'
  inverse-primary: '#dec1af'
  secondary: '#755a34'
  on-secondary: '#ffffff'
  secondary-container: '#fdd7a7'
  on-secondary-container: '#785c36'
  tertiary: '#1a1a18'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f2f2c'
  on-tertiary-container: '#989692'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fbddca'
  primary-fixed-dim: '#dec1af'
  on-primary-fixed: '#28180d'
  on-primary-fixed-variant: '#574335'
  secondary-fixed: '#ffddb3'
  secondary-fixed-dim: '#e5c192'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5b421f'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is built for a premium, artisanal coffee experience that bridges the gap between Ecuadorian volcanic soil and the refined global palate. The brand personality is **sophisticated, intentional, and warm**, evoking the quiet atmosphere of a high-end tasting room. 

The aesthetic leverages **Editorial Minimalism**. It prioritizes high-quality photography and generous whitespace to create a sense of calm and luxury. Drawing inspiration from modern editorial design and sustainable packaging, the UI uses organic textures and a tactile feel to reinforce the brand's commitment to craftsmanship and sustainability. The emotional goal is to move the user from a transactional mindset to an appreciative, storytelling-driven journey.

## Colors

The palette is derived from the lifecycle of coffee and sustainable materials. 
- **Espresso (Primary):** A deep, rich brown used for primary actions and grounding elements.
- **Roasted Bean (Secondary):** A warm, golden-brown used for accents, highlights, and subtle callouts.
- **Kraft/Cream (Surface):** The primary background color, providing a soft, natural alternative to pure white. It evokes the texture of specialty coffee packaging.
- **Ink Black (Neutral):** Used for maximum legibility in body text and precise borders.

Color application should be hierarchical, using the tertiary Cream for large surfaces and the Primary Espresso for structural elements and key interactions.

## Typography

This design system utilizes a high-contrast typographic pair to achieve an editorial feel.
- **Display & Headings:** **Libre Caslon Text** provides an authoritative, literary elegance. It should be used for storytelling beats, product names, and section headers. Use tight letter-spacing for large display sizes to maintain a modern look.
- **Body & Interface:** **Hanken Grotesk** offers a clean, contemporary contrast. Its high x-height ensures readability for product descriptions, brewing guides, and checkout flows.
- **Labels:** Small caps with increased letter spacing are used for category tags and metadata to provide a technical, "roaster's log" aesthetic.

## Layout & Spacing

The layout philosophy is a **fixed-center grid** with expansive outer margins to emphasize the minimalist "gallery" feel. 
- **Desktop:** A 12-column grid with 24px gutters. Content should be comfortably inset with 64px side margins. 
- **Mobile:** A 4-column grid with 16px gutters and 20px margins.
- **Rhythm:** A strict 8px baseline grid maintains vertical harmony.
- **Sectioning:** Use large vertical gaps (120px+) between story blocks to allow the brand imagery to breathe. Asymmetric layouts are encouraged for artisanal storytelling sections, where text might occupy 5 columns and imagery 7.

## Elevation & Depth

To maintain the "tactile" and "sustainable" theme, depth is achieved through **tonal layering and soft ambient shadows**. 
- **Surfaces:** Use subtle changes in background tint (e.g., from Cream to a slightly darker Sand) to define card areas rather than heavy shadows.
- **Shadows:** When used (primarily for active states or floating carts), shadows should be extremely diffused and tinted with the primary espresso color (low opacity) to avoid a "plastic" look. 
- **Borders:** Use 1px solid borders in the primary color at 10-15% opacity to provide structure without breaking the minimalist flow.
- **Textures:** Subtle "paper grain" overlays on large background surfaces are encouraged to reinforce the Kraft paper aesthetic.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding removes the harshness of a brutalist grid, making the UI feel more approachable and organic, similar to the edges of a coffee bag or a ceramic cup. 
- **Small elements:** Buttons and inputs use 4px (0.25rem) radius.
- **Large elements:** Cards and containers use 8px (0.5rem) radius.
- **Imagery:** Product photography should either be sharp-edged for a grid-like editorial look or use the same soft rounding as containers.

## Components

- **Buttons:** Primary buttons are solid Espresso with Cream text. Secondary buttons use a transparent background with a 1px border. All buttons should have a subtle hover transition involving a slight lift or a shift in background tone.
- **Input Fields:** Minimalist design with only a bottom border (1px) in the neutral color, shifting to Primary Espresso on focus. Labels should use the `label-md` style.
- **Cards:** Use "Ghost Cards"—no background fill, defined by the `body-md` typography and thin, low-opacity borders or generous spacing.
- **Chips/Tags:** Used for "Origin," "Roast Level," and "Notes." These should be pill-shaped with a light Sand background and Espresso text.
- **Interactive Story Scroller:** A custom component for origin stories where text fades in/out based on scroll position, paired with full-bleed background imagery.
- **Progressive Disclosure:** Use for "Brewing Instructions" or "Flavor Profiles" to keep the initial view clean.
