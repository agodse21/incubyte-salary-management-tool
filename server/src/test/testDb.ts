import { newDb, type IMemoryDb } from 'pg-mem';
import type { Pool } from 'pg';

const schema = `
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  country TEXT NOT NULL,
  salary NUMERIC(12, 2) NOT NULL CHECK (salary > 0),
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export function createTestPool(): { pool: Pool; db: IMemoryDb } {
  const db = newDb();

  db.public.none(schema);

  const { Pool: MemPool } = db.adapters.createPg();
  const pool = new MemPool();

  return { pool, db };
}
