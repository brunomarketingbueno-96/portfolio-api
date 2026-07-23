import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, { error: 'errors.users.name' }).optional(),
  email: z.email({ error: 'errors.users.email' }).optional(),
  avatarUrl: z.url({ error: 'errors.users.avatar_url' }).optional().nullable().or(z.literal('')),
}).strict().refine((data) => Object.keys(data).length > 0, {
  error: 'errors.users.empty_payload',
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, { error: 'errors.users.old_password' }),
  newPassword: z.string().min(6, { error: 'errors.users.new_password' }),
}).strict();

export const passwordFormSchema = changePasswordSchema
  .extend({
    confirmPassword: z.string().min(6, { error: 'errors.users.new_password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'errors.profile.password_mismatch',
    path: ['confirmPassword'],
  });

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
