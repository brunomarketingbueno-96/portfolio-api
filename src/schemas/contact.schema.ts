import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, { error: 'contact.error.name' }),
  company: z.string().min(3, { error: 'contact.error.company' }),
  email: z.email({ error: 'contact.error.email' }).optional().or(z.literal('')),
  whatsapp: z.string().min(10, { error: 'contact.error.whatsapp' }).optional().or(z.literal('')),
  message: z.string().min(10, { error: 'contact.error.message' }),

}).refine((data) => (data.email && data.email.trim() !== '') || (data.whatsapp && data.whatsapp.trim() !== ''), {
  error: 'contact.error.email_or_whatsapp',
  path: ['email'],
});

export type Contact = z.infer<typeof contactSchema>;
