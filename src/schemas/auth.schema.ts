import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'login.error.email' }),
  password: z.string().min(6, { error: 'login.error.password' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;