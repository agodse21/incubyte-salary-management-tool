import { Pool } from 'pg';

const adminUrl =
  process.env.DATABASE_URL?.replace(/\/[^/]+$/, '/postgres') ??
  'postgresql://salaryapp:salaryapp@localhost:5432/postgres';

async function setup() {
  const pool = new Pool({ connectionString: adminUrl });
  try {
    const res = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = 'salary_management_test'`
    );
    if (res.rowCount === 0) {
      await pool.query('CREATE DATABASE salary_management_test');
      console.log('Created database salary_management_test');
    } else {
      console.log('Test database already exists');
    }
  } finally {
    await pool.end();
  }
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
