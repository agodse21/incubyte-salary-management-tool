import express from 'express';
import cors from 'cors';
import { pool } from './db/pool';
import { EmployeeRepository } from './repositories/employeeRepository';
import { EmployeeService } from './services/employeeService';
import { InsightsService } from './services/insightsService';
import { createEmployeeRoutes } from './routes/employees';
import { createInsightsRoutes } from './routes/insights';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const employeeRepo = new EmployeeRepository(pool);
  const employeeService = new EmployeeService(employeeRepo);
  const insightsService = new InsightsService(pool);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/employees', createEmployeeRoutes(employeeService));
  app.use('/api/insights', createInsightsRoutes(insightsService));

  return app;
}
