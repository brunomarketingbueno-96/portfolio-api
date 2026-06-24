import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import servicesRoutes from '../../routes/services.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'

vi.mock('../../controllers/services.controller.js', () => ({
  getServices: vi.fn((c) => c.json([{ id: 1, link: 'https://example-service.com' }])),
  getServiceById: vi.fn((c) => c.json({ id: c.req.param('id'), link: 'https://example-service.com' })),
  createService: vi.fn((c) => c.json({ success: true }, 201)),
  updateService: vi.fn((c) => c.json({ success: true })),
  deleteService: vi.fn((c) => c.json({ message: 'Deleted' }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => await next())
}))

describe('Services Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/services', servicesRoutes)
  })

  describe('Public Routes', () => {
    it('should return a list of services on GET /api/services', async () => {
      const res = await app.request('/api/services')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([{ id: 1, link: 'https://example-service.com' }])
    })

    it('should return a specific service on GET /api/services/:id', async () => {
      const res = await app.request('/api/services/42')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '42', link: 'https://example-service.com' })
    })
  })

  describe('Protected Routes', () => {
    it('should create a service if user is authenticated on POST /api/services', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: 'https://new-service.com' })
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toEqual({ success: true })
    })

    it('should update a service if user is authenticated on PUT /api/services/:id', async () => {
      const res = await app.request('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: 'https://updated-service.com' })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true })
    })

    it('should delete a service if user is authenticated on DELETE /api/services/:id', async () => {
      const res = await app.request('/api/services/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ message: 'Deleted' })
    })

    it('should block POST /api/services if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: 'https://hacked-service.com' })
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })

    it('should block PUT /api/services/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: 'https://hacked-update.com' })
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })

    it('should block DELETE /api/services/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })
  })
})
