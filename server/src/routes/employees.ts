import { Router } from 'express';
import type { EmployeeService } from '../services/employeeService';

export function createEmployeeRoutes(service: EmployeeService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const search = req.query.search as string | undefined;
    const country = req.query.country as string | undefined;

    const result = await service.list({ page, pageSize, search, country });
    res.json(result);
  });

  router.get('/:id', async (req, res) => {
    const employee = await service.getById(req.params.id);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(employee);
  });

  router.post('/', async (req, res) => {
    const result = await service.create(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json(result.employee);
  });

  router.put('/:id', async (req, res) => {
    const result = await service.update(req.params.id, req.body);
    if (!result.ok) {
      res.status(result.notFound ? 404 : 400).json({ error: result.error });
      return;
    }
    res.json(result.employee);
  });

  router.delete('/:id', async (req, res) => {
    const deleted = await service.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.status(204).send();
  });

  return router;
}
