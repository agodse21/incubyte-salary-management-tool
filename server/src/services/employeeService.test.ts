import { EmployeeService } from './employeeService';
import type { EmployeeRepository } from '../repositories/employeeRepository';
import type { Employee } from '../domain/employee';

function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 'uuid-1',
    fullName: 'Test User',
    jobTitle: 'Engineer',
    country: 'India',
    salary: 100000,
    email: 'test@example.com',
    department: 'Engineering',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createMockRepo(): jest.Mocked<EmployeeRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<EmployeeRepository>;
}

describe('EmployeeService', () => {
  it('returns validation error for invalid create payload', async () => {
    const repo = createMockRepo();
    const service = new EmployeeService(repo);

    const result = await service.create({ fullName: '' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeTruthy();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('creates employee when payload is valid', async () => {
    const repo = createMockRepo();
    const employee = makeEmployee();
    repo.create.mockResolvedValue(employee);
    const service = new EmployeeService(repo);

    const result = await service.create({
      fullName: 'Test User',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 100000,
      email: 'test@example.com',
      department: 'Engineering',
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.employee).toEqual(employee);
  });

  it('returns not found when updating missing employee', async () => {
    const repo = createMockRepo();
    repo.update.mockResolvedValue(null);
    const service = new EmployeeService(repo);

    const result = await service.update('missing-id', { salary: 120000 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.notFound).toBe(true);
    }
  });
});
