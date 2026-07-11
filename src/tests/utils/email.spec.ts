import { describe, it, expect } from 'vitest';
import { buildContactFormEmail } from '../../utils/email.js';

describe('Email Utils', () => {
  describe('buildContactFormEmail', () => {
    it('should build contact email HTML with all fields', () => {
      const payload = {
        name: 'John Doe',
        company: 'Acme Corp',
        email: 'john@acme.com',
        whatsapp: '+5511999999999',
        message: 'Hello, this is a test message!',
      };

      const html = buildContactFormEmail(payload);

      expect(html).toContain('<h2>New Message Received!</h2>');
      expect(html).toContain('<strong>Name:</strong> John Doe');
      expect(html).toContain('<strong>Company:</strong> Acme Corp');
      expect(html).toContain('<strong>Email:</strong> john@acme.com');
      expect(html).toContain('<strong>WhatsApp:</strong> +5511999999999');
      expect(html).toContain('<p>Hello, this is a test message!</p>');
    });

    it('should omit email and whatsapp from HTML if they are not provided', () => {
      const payload = {
        name: 'Jane Doe',
        company: 'Globex Corp',
        message: 'Short message.',
      };

      const html = buildContactFormEmail(payload);

      expect(html).toContain('<strong>Name:</strong> Jane Doe');
      expect(html).toContain('<strong>Company:</strong> Globex Corp');
      expect(html).not.toContain('<strong>Email:</strong>');
      expect(html).not.toContain('<strong>WhatsApp:</strong>');
      expect(html).toContain('<p>Short message.</p>');
    });
  });
});
