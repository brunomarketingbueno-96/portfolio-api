import { describe, it, expect } from 'vitest';
import { aiProviderSchema } from '../../schemas/ai-providers.schema.js';

describe('AI Providers Zod Schema', () => {
  const validPayload = {
    name: 'OpenAI Test',
    provider: 'openai' as const,
    key: 'sk-some-secret-key-that-is-long',
    isActive: true,
  };

  it('should validate a correct payload successfully', () => {
    const result = aiProviderSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('should default isActive to false if omitted', () => {
    const { isActive, ...payloadWithoutActive } = validPayload;
    const result = aiProviderSchema.safeParse(payloadWithoutActive);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });

  it('should fail if name is less than 3 characters', () => {
    const payload = {
      ...validPayload,
      name: 'Op',
    };
    const result = aiProviderSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.ai_provider_name_min');
    }
  });

  it('should fail if provider is invalid', () => {
    const payload = {
      ...validPayload,
      provider: 'invalid-provider' as any,
    };
    const result = aiProviderSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.ai_provider');
    }
  });

  it('should fail if key is empty', () => {
    const payload = {
      ...validPayload,
      key: '',
    };
    const result = aiProviderSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('settings.error.ai_provider_key_required');
    }
  });

  it('should fail if unrecognized keys are sent', () => {
    const payload = {
      ...validPayload,
      extraField: 'not-allowed',
    };
    const result = aiProviderSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('unrecognized_keys');
    }
  });
});
