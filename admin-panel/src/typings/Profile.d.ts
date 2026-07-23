import { z } from 'zod'
import { updateProfileSchema, changePasswordSchema } from '../../../src/schemas/users.schema';
import { loginSchema } from '../../../src/schemas/auth.schema';

type Profile = z.infer<typeof updateProfileSchema>;

export type ChangePassword = z.infer<typeof changePasswordSchema> & {
  confirmPassword: string;
};

export type LoginForm = z.infer<typeof loginSchema>;