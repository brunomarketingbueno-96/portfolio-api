import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, { error: 'errors.contact.name' }),
  company: z.string().min(3, { error: 'errors.contact.company' }),
  email: z.email({ error: 'errors.contact.email' }).optional().or(z.literal('')),
  whatsapp: z.string().min(10, { error: 'errors.contact.whatsapp' }).optional().or(z.literal('')),
  message: z.string().min(10, { error: 'errors.contact.message' }),

}).refine((data) => (data.email && data.email.trim() !== '') || (data.whatsapp && data.whatsapp.trim() !== ''), {
  error: 'errors.contact.email_or_whatsapp',
  path: ['email'],
});

export type Contact = z.infer<typeof contactSchema>;
