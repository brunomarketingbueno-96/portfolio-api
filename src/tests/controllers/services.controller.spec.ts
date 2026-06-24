import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../../controllers/services.controller.js'

import {
  findAllServices,
  findServiceById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../../repositories/services.repository.js'

vi.mock('../../repositories/services.repository.js', () => ({
  findAllServices: vi.fn(),
  findServiceById: vi.fn(),
  createServiceRecord: vi.fn(),
  updateServiceRecord: vi.fn(),
  deleteServiceRecord: vi.fn()
}))

describe('Services Controller', () => {
  let mockContext: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockContext = {
      req: {
        param: vi.fn(),
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('getServices', () => {
    it('should return a list of services', async () => {
      const mockData = [{ id: '1', link: 'https://exemplo.com' }]
      vi.mocked(findAllServices).mockResolvedValue(mockData as any)

      const result = await getServices(mockContext)

      expect(findAllServices).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs', async () => {
      vi.mocked(findAllServices).mockRejectedValue(new Error('Database error'))

      const result = await getServices(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao buscar serviços', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getServiceById', () => {
    it('should return the service if found', async () => {
      const mockData = { id: '1', link: 'https://exemplo.com' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findServiceById).mockResolvedValue(mockData as any)

      const result = await getServiceById(mockContext)

      expect(findServiceById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 404 if service is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findServiceById).mockResolvedValue(undefined as any)

      const result = await getServiceById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Serviço não encontrado' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findServiceById).mockRejectedValue(new Error('Database error'))

      const result = await getServiceById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao procurar serviço', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createService', () => {
    it('should create a service and return 201', async () => {
      const mockBody = {
        link: 'https://servico.com',
        imageUrl: 'http://img.com/1.png',
        translations: [{ language: 'en', title: 'Service', description: 'Desc' }]
      }
      const mockCreatedRecord = { id: '1', link: 'https://servico.com', imageUrl: 'http://img.com/1.png' }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(createServiceRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createService(mockContext)

      expect(createServiceRecord).toHaveBeenCalledWith(
        { link: 'https://servico.com', imageUrl: 'http://img.com/1.png' },
        [{ language: 'en', title: 'Service', description: 'Desc' }]
      )
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 500 if creation fails', async () => {
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(createServiceRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro interno ao salvar serviço', error: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateService', () => {
    it('should update a service and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockBody = {
        link: 'https://novosite.com',
        translations: [{ language: 'pt', title: 'Serviço', description: 'Desc' }]
      }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(updateServiceRecord).mockResolvedValue(undefined as any)

      const result = await updateService(mockContext)

      expect(updateServiceRecord).toHaveBeenCalledWith(
        '1',
        { link: 'https://novosite.com' },
        [{ language: 'pt', title: 'Serviço', description: 'Desc' }]
      )
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Serviço atualizado com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if update fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(updateServiceRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao atualizar serviço', error: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteService', () => {
    it('should delete a service and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteServiceRecord).mockResolvedValue(undefined as any)

      const result = await deleteService(mockContext)

      expect(deleteServiceRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Serviço removido com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if deletion fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteServiceRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao remover serviço', error: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
