import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'errors.login.email' }),
  password: z.string().min(6, { error: 'errors.login.password' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;