import { Context } from 'hono'

import {
  findAllServices,
  findServiceById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../repositories/services.repository.js';

export const getServices = async (c: Context) => {
  try {
    const result = await findAllServices()
    return c.json(result)
  } catch (error: any) {
    return c.json({ message: 'Erro ao buscar serviços', error: error.message }, 500)
  }
}

export const getServiceById = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const service = await findServiceById(id)

    if (!service) {
      return c.json({ message: 'Serviço não encontrado' }, 404)
    }

    return c.json(service)
  } catch (error: any) {
    return c.json({ message: 'Erro ao procurar serviço', error: error.message }, 500)
  }
}

export const createService = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { translations, ...serviceData } = body

    const service = await createServiceRecord(serviceData, translations)

    return c.json(service, 201)
  } catch (error: any) {
    console.error('ERRO AO CRIAR SERVIÇO:', error)
    return c.json({
      message: 'Erro interno ao salvar serviço',
      error: error.message
    }, 500)
  }
}

export const updateService = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const body = await c.req.json()
    const { translations, ...serviceData } = body

    await updateServiceRecord(id, serviceData, translations)

    return c.json({ message: 'Serviço atualizado com sucesso' })
  } catch (error: any) {
    console.error('ERRO AO ATUALIZAR SERVIÇO:', error)
    return c.json({ message: 'Erro ao atualizar serviço', error: error.message }, 500)
  }
}

export const deleteService = async (c: Context) => {
  const id = c.req.param('id')

  try {
    await deleteServiceRecord(id)
    return c.json({ message: 'Serviço removido com sucesso' })
  } catch (error: any) {
    return c.json({ message: 'Erro ao remover serviço', error: error.message }, 500)
  }
}
