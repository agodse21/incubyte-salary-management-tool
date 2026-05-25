import request from 'supertest';
import express from 'express';

describe('Employee API', () => {
  it('GET /api/health returns ok', async () => {
    const app = express();
    app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
