import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

if (!process.env.VERCEL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add it to the .env file at the project root.'
  );
}

const isNeon = connectionString.includes('neon.tech');

export const pool = new pg.Pool({
  connectionString,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 10_000,
  max: process.env.VERCEL ? 1 : 10,
  ssl: isNeon ? { rejectUnauthorized: false } : undefined,
});
