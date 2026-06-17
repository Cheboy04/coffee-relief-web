import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://coffeereliefecuador.com'

// Idioma → URL. EN sin prefijo (/), ES con prefijo (/es) — localePrefix 'as-needed'.
const languages = {
  en: baseUrl,
  es: `${baseUrl}/es`,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/es`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
  ]
}
