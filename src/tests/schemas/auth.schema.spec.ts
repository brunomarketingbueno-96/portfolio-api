import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../schemas/auth.schema.js';

describe('Auth Zod Schema', () => {
  const validPayload = {
    email: 'admin@portfolio.com',
    password: 'securePassword123',
  };

  it('should validate a correct payload successfully', () => {
    const result = loginSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('should fail if email is missing', () => {
    const payload = { password: 'securePassword123' };
    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(issue => issue.path[0]);
      expect(paths).toContain('email');
    }
  });

  it('should fail if email format is invalid', () => {
    const payload = { email: 'not-an-email', password: 'securePassword123' };
    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('errors.login.email');
    }
  });

  it('should fail if password is too short', () => {
    const payload = { email: 'admin@portfolio.com', password: '12345' };
    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('errors.login.password');
    }
  });
});
