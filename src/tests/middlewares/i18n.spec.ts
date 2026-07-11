import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18next from 'i18next';

vi.mock('i18next', () => {
  return {
    default: {
      init: vi.fn(),
      t: vi.fn((key, options) => `mock-translation-${key}`),
    },
  };
});

import { i18nMiddleware } from '../../middlewares/i18n.js';

describe('i18n Middleware', () => {
  let mockContext: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      req: {
        header: vi.fn(),
      },
      set: vi.fn(),
    };
    mockNext = vi.fn();
  });

  it('should set fallback language to "en" when accept-language header is not provided', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue(undefined);

    await i18nMiddleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith('language', 'en');
    expect(mockContext.set).toHaveBeenCalledWith('t', expect.any(Function));
    expect(mockNext).toHaveBeenCalled();

    // @ts-expect-error
    const tFunc = vi.mocked(mockContext.set).mock.calls.find(call => call[0] === 't')?.[1];
    expect(tFunc).toBeDefined();

    const result = tFunc('some.key', { opt: 1 });
    expect(i18next.t).toHaveBeenCalledWith('some.key', { lng: 'en', opt: 1 });
    expect(result).toBe('mock-translation-some.key');
  });

  it('should set language based on accept-language header when matching pt', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue('pt-BR,pt;q=0.9');

    await i18nMiddleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith('language', 'pt');
    expect(mockNext).toHaveBeenCalled();

    // @ts-expect-error
    const tFunc = vi.mocked(mockContext.set).mock.calls.find(call => call[0] === 't')?.[1];
    tFunc('another.key');
    expect(i18next.t).toHaveBeenCalledWith('another.key', { lng: 'pt' });
  });

  it('should set language based on accept-language header when matching es', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue('es-ES,es;q=0.8');

    await i18nMiddleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith('language', 'es');
    expect(mockNext).toHaveBeenCalled();

    // @ts-expect-error
    const tFunc = vi.mocked(mockContext.set).mock.calls.find(call => call[0] === 't')?.[1];
    tFunc('es.key');
    expect(i18next.t).toHaveBeenCalledWith('es.key', { lng: 'es' });
  });

  it('should fallback to en if accept-language is set but doesn\'t match pt/es/en', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue('fr-FR,fr;q=0.9');

    await i18nMiddleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith('language', 'en');
    expect(mockNext).toHaveBeenCalled();
  });
});
