import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

// npm -w server runs with cwd=server/, so load root .env explicitly
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add it to the .env file at the project root.'
  );
}

export const pool = new pg.Pool({ connectionString });
