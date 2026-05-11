import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

import { authMiddleware } from '../../middlewares/auth.js'

vi.mock('hono/cookie', () => ({
  getCookie: vi.fn()
}))

vi.mock('hono/jwt', () => ({
  verify: vi.fn()
}))

describe('Auth Middleware', () => {
  let mockContext: any
  let mockNext: any

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'

    mockContext = {
      json: vi.fn((data, status) => ({ data, status })),
      set: vi.fn()
    }

    mockNext = vi.fn()
  })

  it('should return 401 if no token is provided', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined)

    const response = await authMiddleware(mockContext, mockNext)

    expect(getCookie).toHaveBeenCalledWith(mockContext, 'auth_token')
    expect(mockContext.json).toHaveBeenCalledWith({ message: 'Unauthorized' }, 401)
    expect(mockNext).not.toHaveBeenCalled()
    expect(response).toEqual({ data: { message: 'Unauthorized' }, status: 401 })
  })

  it('should return 401 if token is invalid or expired', async () => {
    vi.mocked(getCookie).mockReturnValue('invalid-token')
    vi.mocked(verify).mockRejectedValue(new Error('JwtTokenInvalid'))

    const response = await authMiddleware(mockContext, mockNext)

    expect(verify).toHaveBeenCalledWith('invalid-token', 'test-secret', 'HS256')
    expect(mockContext.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' }, 401)
    expect(mockNext).not.toHaveBeenCalled()
    expect(response).toEqual({ data: { message: 'Invalid or expired token' }, status: 401 })
  })

  it('should set jwtPayload and call next if token is valid', async () => {
    const mockPayload = { userId: '123', email: 'test@example.com' }
    vi.mocked(getCookie).mockReturnValue('valid-token')
    vi.mocked(verify).mockResolvedValue(mockPayload)

    await authMiddleware(mockContext, mockNext)

    expect(verify).toHaveBeenCalledWith('valid-token', 'test-secret', 'HS256')
    expect(mockContext.set).toHaveBeenCalledWith('jwtPayload', mockPayload)
    expect(mockNext).toHaveBeenCalled()
  })
})
