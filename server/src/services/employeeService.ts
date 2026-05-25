import type { EmployeeRepository } from '../repositories/employeeRepository';
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '../domain/employee';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from '../domain/employeeValidation';
import type { ListEmployeesOptions, ListEmployeesResult } from '../repositories/employeeRepository';

export class EmployeeService {
  constructor(private repo: EmployeeRepository) {}

  async create(input: unknown): Promise<{ ok: true; employee: Employee } | { ok: false; error: string }> {
    const validated = validateCreateEmployee(input);
    if (!validated.ok) return validated;

    try {
      const employee = await this.repo.create(validated.value);
      return { ok: true, employee };
    } catch (err: unknown) {
      if (isUniqueViolation(err)) {
        return { ok: false, error: 'An employee with this email already exists' };
      }
      throw err;
    }
  }

  async getById(id: string): Promise<Employee | null> {
    return this.repo.findById(id);
  }

  async list(options: ListEmployeesOptions): Promise<ListEmployeesResult> {
    const page = Math.max(1, options.page || 1);
    const pageSize = Math.min(100, Math.max(1, options.pageSize || 20));
    return this.repo.list({ ...options, page, pageSize });
  }

  async update(
    id: string,
    input: unknown
  ): Promise<
    | { ok: true; employee: Employee }
    | { ok: false; error: string; notFound?: boolean }
  > {
    const validated = validateUpdateEmployee(input);
    if (!validated.ok) return validated;

    try {
      const employee = await this.repo.update(id, validated.value);
      if (!employee) return { ok: false, error: 'Employee not found', notFound: true };
      return { ok: true, employee };
    } catch (err: unknown) {
      if (isUniqueViolation(err)) {
        return { ok: false, error: 'An employee with this email already exists' };
      }
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  );
}
