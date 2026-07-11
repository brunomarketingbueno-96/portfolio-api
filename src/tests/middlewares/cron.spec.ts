import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cronMiddleware } from '../../middlewares/cron.js';

describe('Cron Middleware', () => {
  let mockContext: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-cron-secret';

    mockContext = {
      req: {
        header: vi.fn(),
      },
      json: vi.fn((data, status) => ({ data, status })),
    };

    mockNext = vi.fn();
  });

  it('should return 401 if Authorization header is missing', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue(undefined);

    const response = await cronMiddleware(mockContext, mockNext);

    expect(mockContext.req.header).toHaveBeenCalledWith('Authorization');
    expect(mockContext.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
    expect(mockNext).not.toHaveBeenCalled();
    expect(response).toEqual({ data: { error: 'Unauthorized' }, status: 401 });
  });

  it('should return 401 if Authorization header is invalid', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue('Bearer wrong-secret');

    const response = await cronMiddleware(mockContext, mockNext);

    expect(mockContext.req.header).toHaveBeenCalledWith('Authorization');
    expect(mockContext.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
    expect(mockNext).not.toHaveBeenCalled();
    expect(response).toEqual({ data: { error: 'Unauthorized' }, status: 401 });
  });

  it('should call next if Authorization header matches CRON_SECRET', async () => {
    vi.mocked(mockContext.req.header).mockReturnValue('Bearer test-cron-secret');

    await cronMiddleware(mockContext, mockNext);

    expect(mockContext.req.header).toHaveBeenCalledWith('Authorization');
    expect(mockContext.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
