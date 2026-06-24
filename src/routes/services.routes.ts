import { Hono } from 'hono';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const service = new Hono();

service.get('/', getServices);
service.get('/:id', getServiceById);

service.post('/', authMiddleware, createService);
service.put('/:id', authMiddleware, updateService);
service.delete('/:id', authMiddleware, deleteService);

export default service;
