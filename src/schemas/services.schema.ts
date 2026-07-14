import { z } from 'zod'

export const serviceSchema = z.object({
  link: z.url({ error: 'services.error.link' })
    .startsWith('http', { error: 'services.error.link' })
    .optional()
    .or(z.literal('')),

  imageUrl: z.url({ error: 'services.error.image_url' })
    .startsWith('http', { error: 'services.error.image_url' })
    .optional()
    .or(z.literal('')),

  translations: z.array(z.object({
    language: z.string().min(2, { error: 'services.error.language' }),
    title: z.string().min(3, { error: 'services.error.title' }),
    description: z.string().min(10, { error: 'services.error.description' }),
  }).strict()).min(1, { error: 'services.error.translations_required' }),
}).strict()

export type Service = z.infer<typeof serviceSchema>
