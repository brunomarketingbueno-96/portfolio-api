import { describe, it, expect } from 'vitest';
import { BlogPrompts, BlogPostPromptContext } from '../../prompts/blog.prompts.js';

describe('BlogPrompts', () => {
  const context: BlogPostPromptContext = {
    title: 'Meu Post Incrível',
    slug: 'meu-post-incrivel',
    excerpt: 'Um resumo de teste sobre o post.',
    language: 'pt',
  };

  describe('buildHtmlSystemPrompt', () => {
    it('should return Portuguese prompt when language is pt', () => {
      const result = BlogPrompts.buildHtmlSystemPrompt({
        ...context,
        language: 'pt',
      });

      expect(result).toContain('Você é um redator sênior especialista em SEO');
      expect(result).toContain('PORTUGUÊS (BR)');
      expect(result).toContain(`Título: ${context.title}`);
      expect(result).toContain(`Resumo/Direção (Excerpt): ${context.excerpt}`);
      expect(result).toContain(`Slug (URL - Use para entender as palavras-chave principais): ${context.slug}`);
    });

    it('should return Spanish prompt when language is es', () => {
      const result = BlogPrompts.buildHtmlSystemPrompt({
        ...context,
        language: 'es',
      });

      expect(result).toContain('Eres un redactor senior experto en SEO');
      expect(result).toContain('ESPAÑOL');
      expect(result).toContain(`Título: ${context.title}`);
      expect(result).toContain(`Resumen/Dirección (Excerpt): ${context.excerpt}`);
      expect(result).toContain(`Slug (URL - Úsalo para entender las palabras clave principales): ${context.slug}`);
    });

    it('should return English prompt when language is en', () => {
      const result = BlogPrompts.buildHtmlSystemPrompt({
        ...context,
        language: 'en',
      });

      expect(result).toContain('You are a senior SEO and Copywriting expert');
      expect(result).toContain('ENGLISH');
      expect(result).toContain(`Title: ${context.title}`);
      expect(result).toContain(`Summary/Direction (Excerpt): ${context.excerpt}`);
      expect(result).toContain(`Slug (URL - Use to understand main keywords): ${context.slug}`);
    });

    it('should default to English prompt when language is unsupported or default', () => {
      const result = BlogPrompts.buildHtmlSystemPrompt({
        ...context,
        language: 'fr' as any, // force unsupported language
      });

      expect(result).toContain('You are a senior SEO and Copywriting expert');
      expect(result).toContain('ENGLISH');
      expect(result).toContain(`Title: ${context.title}`);
    });
  });

  describe('getUserPrompt', () => {
    it('should return Portuguese user prompt for pt', () => {
      const result = BlogPrompts.getUserPrompt('pt');
      expect(result).toBe('Desenvolva o texto principal com alta qualidade e profundidade.');
    });

    it('should return Spanish user prompt for es', () => {
      const result = BlogPrompts.getUserPrompt('es');
      expect(result).toBe('Escriba el texto principal con alta calidad y profundidad.');
    });

    it('should return English user prompt for en', () => {
      const result = BlogPrompts.getUserPrompt('en');
      expect(result).toBe('Write the main text with high quality and depth.');
    });

    it('should return English user prompt for unsupported or default language', () => {
      const result = BlogPrompts.getUserPrompt('fr');
      expect(result).toBe('Write the main text with high quality and depth.');
    });
  });
});
