import { randomUUID } from 'crypto';
import type { Pool } from 'pg';
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '../domain/employee';

type EmployeeRow = {
  id: string;
  full_name: string;
  job_title: string;
  country: string;
  salary: string;
  email: string;
  department: string;
  created_at: Date;
  updated_at: Date;
};

function mapRow(row: EmployeeRow): Employee {
  return {
    id: row.id,
    fullName: row.full_name,
    jobTitle: row.job_title,
    country: row.country,
    salary: Number(row.salary),
    email: row.email,
    department: row.department,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type ListEmployeesOptions = {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
};

export type ListEmployeesResult = {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
};

export class EmployeeRepository {
  constructor(private db: Pool) {}

  async create(input: CreateEmployeeInput): Promise<Employee> {
    const id = randomUUID();
    const result = await this.db.query<EmployeeRow>(
      `INSERT INTO employees (id, full_name, job_title, country, salary, email, department)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id,
        input.fullName,
        input.jobTitle,
        input.country,
        input.salary,
        input.email,
        input.department,
      ]
    );
    return mapRow(result.rows[0]);
  }

  async findById(id: string): Promise<Employee | null> {
    const result = await this.db.query<EmployeeRow>(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) return null;
    return mapRow(result.rows[0]);
  }

  async list(options: ListEmployeesOptions): Promise<ListEmployeesResult> {
    const { page, pageSize, search, country } = options;
    const offset = (page - 1) * pageSize;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(
        `(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR job_title ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (country) {
      conditions.push(`country = $${paramIndex}`);
      params.push(country);
      paramIndex++;
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM employees ${where}`,
      params
    );

    const listParams = [...params, pageSize, offset];
    const listResult = await this.db.query<EmployeeRow>(
      `SELECT * FROM employees ${where}
       ORDER BY full_name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      listParams
    );

    return {
      items: listResult.rows.map(mapRow),
      total: Number(countResult.rows[0].count),
      page,
      pageSize,
    };
  }

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    const columnMap: Record<keyof UpdateEmployeeInput, string> = {
      fullName: 'full_name',
      jobTitle: 'job_title',
      country: 'country',
      salary: 'salary',
      email: 'email',
      department: 'department',
    };

    for (const key of Object.keys(input) as (keyof UpdateEmployeeInput)[]) {
      const value = input[key];
      if (value !== undefined) {
        fields.push(`${columnMap[key]} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const result = await this.db.query<EmployeeRow>(
      `UPDATE employees SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    if (result.rowCount === 0) return null;
    return mapRow(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM employees WHERE id = $1', [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}
