import { handleResponse } from '@/helpers/fetchHelpers';
import type { AIProvider } from '@/typings/AiProvider';

export const AiProviderService = {
  async create(payload: AIProvider): Promise<AIProvider> {
    const res = await fetch('/api/ai-providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(id: string, payload: Partial<AIProvider>): Promise<AIProvider> {
    const res = await fetch(`/api/ai-providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(id: string): Promise<{ id: string }> {
    const res = await fetch(`/api/ai-providers/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};
