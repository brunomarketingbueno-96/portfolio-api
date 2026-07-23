import { streamText, LanguageModel } from 'ai';

import { createOpenAI } from '@ai-sdk/openai';
import { createGoogle } from '@ai-sdk/google';

export type ProviderType = 'groq' | 'openai' | 'gemini';

export class AiService {
  private model: LanguageModel;

  constructor(provider: ProviderType, modelName: string, apiKey: string) {
    if (provider === 'groq') {
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: apiKey,
      });
      this.model = groq(modelName);
    }

    else if (provider === 'openai') {
      const openai = createOpenAI({
        apiKey: apiKey,
      });
      this.model = openai(modelName);
    }

    else if (provider === 'gemini') {
      const google = createGoogle({
        apiKey: apiKey
      });
      this.model = google(modelName);
    }

    else {
      throw new Error(`Provedor não suportado: ${provider}`);
    }
  }

  async streamHtmlContent(systemPrompt: string, userPrompt: string) {
    const result = streamText({
      model: this.model,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1,
    });

    return result;
  }
}
