import type { Pool } from 'pg';

export type CountrySalaryStats = {
  country: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
};

export type JobTitleSalaryStats = {
  country: string;
  jobTitle: string;
  avgSalary: number;
  employeeCount: number;
};

export class InsightsService {
  constructor(private db: Pool) {}

  async getCountryStats(): Promise<CountrySalaryStats[]> {
    const result = await this.db.query<{
      country: string;
      min_salary: string;
      max_salary: string;
      avg_salary: string;
      employee_count: string;
    }>(`
      SELECT
        country,
        MIN(salary)::text AS min_salary,
        MAX(salary)::text AS max_salary,
        AVG(salary)::text AS avg_salary,
        COUNT(*)::text AS employee_count
      FROM employees
      GROUP BY country
      ORDER BY country
    `);

    return result.rows.map((row) => ({
      country: row.country,
      minSalary: Number(row.min_salary),
      maxSalary: Number(row.max_salary),
      avgSalary: Math.round(Number(row.avg_salary)),
      employeeCount: Number(row.employee_count),
    }));
  }

  async getJobTitleStatsByCountry(
    country: string
  ): Promise<JobTitleSalaryStats[]> {
    const result = await this.db.query<{
      country: string;
      job_title: string;
      avg_salary: string;
      employee_count: string;
    }>(
      `
      SELECT
        country,
        job_title,
        AVG(salary)::text AS avg_salary,
        COUNT(*)::text AS employee_count
      FROM employees
      WHERE country = $1
      GROUP BY country, job_title
      ORDER BY job_title
    `,
      [country]
    );

    return result.rows.map((row) => ({
      country: row.country,
      jobTitle: row.job_title,
      avgSalary: Math.round(Number(row.avg_salary)),
      employeeCount: Number(row.employee_count),
    }));
  }

  async getOverallSummary() {
    const result = await this.db.query<{
      total_employees: string;
      avg_salary: string;
      country_count: string;
    }>(`
      SELECT
        COUNT(*)::text AS total_employees,
        AVG(salary)::text AS avg_salary,
        COUNT(DISTINCT country)::text AS country_count
      FROM employees
    `);

    const row = result.rows[0];
    return {
      totalEmployees: Number(row.total_employees),
      avgSalary: Math.round(Number(row.avg_salary) || 0),
      countryCount: Number(row.country_count),
    };
  }
}
