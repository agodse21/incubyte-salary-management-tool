import fs from 'fs';
import path from 'path';
import {
  COUNTRIES,
  DEPARTMENTS,
  JOB_TITLES,
} from '../constants/employeeOptions';
import { pool } from '../db/pool';

const SEED_COUNT = 10_000;
const BATCH_SIZE = 500;

// Rough annual salary bands by country (local currency units, simplified)
const SALARY_RANGES: Record<string, [number, number]> = {
  India: [600_000, 3_500_000],
  'United States': [55_000, 180_000],
  'United Kingdom': [35_000, 95_000],
  Germany: [40_000, 100_000],
  Canada: [50_000, 120_000],
  Australia: [55_000, 130_000],
};

function loadLines(fileName: string): string[] {
  const filePath = path.join(__dirname, '../../data', fileName);
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

function randomInRange(min: number, max: number, seed: number): number {
  // Simple deterministic spread so repeated seeds look stable enough for dev
  const t = (seed * 9301 + 49297) % 233280;
  const ratio = t / 233280;
  return Math.round(min + ratio * (max - min));
}

function buildRows(
  firstNames: string[],
  lastNames: string[],
  count: number
): Array<[string, string, string, number, string, string]> {
  const rows: Array<[string, string, string, number, string, string]> = [];

  for (let i = 0; i < count; i++) {
    const first = pick(firstNames, i);
    const last = pick(lastNames, Math.floor(i / firstNames.length) + i);
    const fullName = `${first} ${last}`;
    const country = pick(COUNTRIES, i * 7);
    const jobTitle = pick(JOB_TITLES, i * 13);
    const department = pick(DEPARTMENTS, i * 11);
    const [min, max] = SALARY_RANGES[country];
    const salary = randomInRange(min, max, i);
    const email = `employee${i + 1}@seed.local`;

    rows.push([fullName, jobTitle, country, salary, email, department]);
  }

  return rows;
}

async function seed() {
  const started = Date.now();
  const firstNames = loadLines('first_names.txt');
  const lastNames = loadLines('last_names.txt');

  if (firstNames.length === 0 || lastNames.length === 0) {
    throw new Error('Name list files are empty');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE employees RESTART IDENTITY CASCADE');

    const rows = buildRows(firstNames, lastNames, SEED_COUNT);

    for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
      const batch = rows.slice(offset, offset + BATCH_SIZE);
      const values: unknown[] = [];
      const placeholders: string[] = [];

      batch.forEach((row, idx) => {
        const base = idx * 6;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`
        );
        values.push(...row);
      });

      await client.query(
        `INSERT INTO employees (full_name, job_title, country, salary, email, department)
         VALUES ${placeholders.join(', ')}`,
        values
      );

      console.log(`Inserted ${Math.min(offset + BATCH_SIZE, SEED_COUNT)} / ${SEED_COUNT}`);
    }

    await client.query('COMMIT');
    const elapsed = ((Date.now() - started) / 1000).toFixed(2);
    console.log(`Seeded ${SEED_COUNT} employees in ${elapsed}s`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
