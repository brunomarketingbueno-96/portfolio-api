import { z } from 'zod';

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'] as const, {
    error: 'errors.settings.theme'
  }),

  panelLanguage: z.string().min(2, { error: 'errors.settings.panel_language' }),

  siteUrl: z.url({ error: 'errors.settings.site_url' })
    .startsWith('http', { error: 'errors.settings.site_url' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  publicEmail: z.string().email({ error: 'errors.settings.public_email' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  logoUrl: z.url({ error: 'errors.settings.logo_url' })
    .startsWith('http', { error: 'errors.settings.logo_url' })
    .optional()
    .or(z.literal(''))
    .nullable(),

  customConfig: z.record(z.string(), z.any())
    .optional()
    .nullable(),
}).strict();

export type Settings = z.infer<typeof settingsSchema>;
