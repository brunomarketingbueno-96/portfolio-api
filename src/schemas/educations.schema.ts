import { z } from 'zod';

const educationTranslationSchema = z.object({
  language: z.string().max(4).min(2, { error: 'errors.educations.language' }),
  name: z.string().min(3, { error: 'errors.educations.name' }),
  institution: z.string().min(2, { error: 'errors.educations.institution' }),
  description: z.string().min(10, { error: 'errors.educations.description' }),
}).strict();

export const educationSchema = z.object({
  startDate: z.string().min(10, { error: 'errors.educations.start_date' }),
  endDate: z.string().min(10, { error: 'errors.educations.end_date' }).optional().nullable().or(z.literal('')),

  type: z.enum(['college', 'course', 'certification', 'bootcamp'], {
    error: 'errors.educations.type',
  }),

  durationHours: z.literal('')
    .transform(() => undefined)
    .or(
      z.coerce.number().int().positive({ error: 'errors.educations.duration_hours' })
    )
    .optional()
    .nullable(),


  imageUrl: z.url({ error: 'errors.educations.image_url' })
    .startsWith('http', { error: 'errors.educations.image_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  certificateUrl: z.url({ error: 'errors.educations.certificate_url' })
    .startsWith('http', { error: 'errors.educations.certificate_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  status: z.string().min(2, { error: 'errors.educations.status' }),
  translations: z.array(educationTranslationSchema).min(1, { error: 'errors.educations.translations_required' }),
}).strict();

export type Education = z.infer<typeof educationSchema>;