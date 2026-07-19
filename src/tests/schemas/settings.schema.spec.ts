import { describe, it, expect } from 'vitest';
import { settingsSchema } from '../../schemas/settings.schema.js';

describe('Settings Zod Schema', () => {
  const validPayload = {
    theme: 'dark' as const,
    panelLanguage: 'en',
    siteUrl: 'https://site.com',
    publicEmail: 'contact@site.com',
    logoUrl: 'https://site.com/logo.png',
    customConfig: { featureFlag: true },
  };

  it('should validate a correct payload successfully', () => {
    const result = settingsSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('should allow optional fields to be null or empty string', () => {
    const payload = {
      theme: 'light' as const,
      panelLanguage: 'es',
      siteUrl: null,
      publicEmail: '',
      logoUrl: '',
      customConfig: null,
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.siteUrl).toBeNull();
      expect(result.data.publicEmail).toBe('');
      expect(result.data.logoUrl).toBe('');
      expect(result.data.customConfig).toBeNull();
    }
  });

  it('should fail if theme is invalid', () => {
    const payload = {
      theme: 'invalid-theme',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    // Note: error messages might be different since it's a z.enum with custom error map
    // We check message matches
  });

  it('should fail if panelLanguage is less than 2 characters', () => {
    const payload = {
      theme: 'dark' as const,
      panelLanguage: 'e',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.panel_language');
    }
  });

  it('should fail if siteUrl is not a valid url or doesn\'t start with http', () => {
    const payload = {
      theme: 'dark' as const,
      panelLanguage: 'en',
      siteUrl: 'not-a-url',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.site_url');
    }
  });

  it('should fail if publicEmail is not a valid email', () => {
    const payload = {
      theme: 'dark' as const,
      panelLanguage: 'en',
      publicEmail: 'not-an-email',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.public_email');
    }
  });

  it('should fail if logoUrl is not a valid url or doesn\'t start with http', () => {
    const payload = {
      theme: 'dark' as const,
      panelLanguage: 'en',
      logoUrl: 'not-a-url',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.logo_url');
    }
  });

  it('should fail and block request if unrecognized keys are sent at root level', () => {
    const payload = {
      ...validPayload,
      extraField: 'not-allowed',
    };
    const result = settingsSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.code).toBe('unrecognized_keys');
    }
  });
});
