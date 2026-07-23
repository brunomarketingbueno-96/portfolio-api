import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(function(this: any) {
      return {
        emails: {
          send: vi.fn(),
        },
      };
    }),
  };
});

import { sendContactFormEmail } from '../../services/resend.service.js';
import { Resend } from 'resend';

describe('Resend Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'mock-resend-key';
  });

  it('should send contact form email successfully with replyTo when email is provided', async () => {
    const payload = {
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      whatsapp: '123456789',
      message: 'Hello!',
    };

    const mockResponse = { id: 'email-id-123' };
    const mockSend = vi.fn().mockResolvedValue(mockResponse);
    vi.mocked(Resend).mockImplementation(function(this: any) {
      return {
        emails: {
          send: mockSend,
        },
      };
    } as any);

    const result = await sendContactFormEmail(payload);

    expect(Resend).toHaveBeenCalledWith('mock-resend-key');
    expect(mockSend).toHaveBeenCalledWith({
      from: 'Formulário Portfólio <onboarding@resend.dev>',
      to: 'williandeivitidaniel@live.com',
      replyTo: 'john@acme.com',
      subject: 'Nova mensagem de contato: John Doe (Acme Corp)',
      html: expect.stringContaining('<h2>New Message Received!</h2>'),
    });
    expect(result).toEqual({ success: true, data: mockResponse });
  });

  it('should send contact form email successfully without replyTo when email is not provided', async () => {
    const payload = {
      name: 'John Doe',
      company: 'Acme Corp',
      whatsapp: '123456789',
      message: 'Hello!',
    };

    const mockResponse = { id: 'email-id-123' };
    const mockSend = vi.fn().mockResolvedValue(mockResponse);
    vi.mocked(Resend).mockImplementation(function(this: any) {
      return {
        emails: {
          send: mockSend,
        },
      };
    } as any);

    const result = await sendContactFormEmail(payload);

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Formulário Portfólio <onboarding@resend.dev>',
      to: 'williandeivitidaniel@live.com',
      subject: 'Nova mensagem de contato: John Doe (Acme Corp)',
      html: expect.stringContaining('<h2>New Message Received!</h2>'),
    });
    expect(result).toEqual({ success: true, data: mockResponse });
  });

  it('should return success false and log error when send fails', async () => {
    const payload = {
      name: 'John Doe',
      company: 'Acme Corp',
      message: 'Hello!',
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sendError = new Error('SMTP failure');
    const mockSend = vi.fn().mockRejectedValue(sendError);
    vi.mocked(Resend).mockImplementation(function(this: any) {
      return {
        emails: {
          send: mockSend,
        },
      };
    } as any);

    const result = await sendContactFormEmail(payload);

    expect(result).toEqual({ success: false, error: sendError });
    expect(consoleSpy).toHaveBeenCalledWith('Error in sendContactFormEmail:', sendError);
    consoleSpy.mockRestore();
  });
});
