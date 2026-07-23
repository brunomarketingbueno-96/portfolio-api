import { z } from 'zod'

export const serviceSchema = z.object({
  link: z.url({ error: 'errors.services.link' })
    .startsWith('http', { error: 'errors.services.link' })
    .optional()
    .or(z.literal('')),

  imageUrl: z.url({ error: 'errors.services.image_url' })
    .startsWith('http', { error: 'errors.services.image_url' })
    .optional()
    .or(z.literal('')),

  translations: z.array(z.object({
    language: z.string().min(2, { error: 'errors.services.language' }),
    title: z.string().min(3, { error: 'errors.services.title' }),
    description: z.string().min(10, { error: 'errors.services.description' }),
  }).strict()).min(1, { error: 'errors.services.translations_required' }),
}).strict()

export type Service = z.infer<typeof serviceSchema>
