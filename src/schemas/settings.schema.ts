import { z } from 'zod';

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'] as const, {
    error: 'settings.error.theme'
  }).default('system'),

  panelLanguage: z.string().min(2, { error: 'settings.error.panel_language' }).default('pt'),

  siteUrl: z.url({ error: 'settings.error.site_url' })
    .startsWith('http', { message: 'settings.error.site_url' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  publicEmail: z.string().email({ error: 'settings.error.public_email' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  logoUrl: z.url({ error: 'settings.error.logo_url' })
    .startsWith('http', { message: 'settings.error.logo_url' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  customConfig: z.record(z.string(), z.any())
    .optional()
    .nullable(),
}).strict();