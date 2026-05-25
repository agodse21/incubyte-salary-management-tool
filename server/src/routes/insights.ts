import { Router } from 'express';
import type { InsightsService } from '../services/insightsService';

export function createInsightsRoutes(service: InsightsService) {
  const router = Router();

  router.get('/summary', async (_req, res) => {
    const summary = await service.getOverallSummary();
    res.json(summary);
  });

  router.get('/by-country', async (_req, res) => {
    const stats = await service.getCountryStats();
    res.json(stats);
  });

  router.get('/by-job-title', async (req, res) => {
    const country = req.query.country as string;
    if (!country) {
      res.status(400).json({ error: 'country query parameter is required' });
      return;
    }
    const stats = await service.getJobTitleStatsByCountry(country);
    res.json(stats);
  });

  return router;
}
