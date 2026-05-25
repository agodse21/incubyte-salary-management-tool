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

  const apiRouter = express.Router();

  apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  apiRouter.use('/employees', createEmployeeRoutes(employeeService));
  apiRouter.use('/insights', createInsightsRoutes(insightsService));

  // Local dev: server runs at :3001 with /api/* paths
  app.use('/api', apiRouter);

  // Vercel api/index.ts is mounted at /api — routes are relative (e.g. /employees)
  if (process.env.VERCEL) {
    app.use(apiRouter);
  }

  return app;
}
