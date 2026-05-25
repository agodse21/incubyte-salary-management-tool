import { EmployeeRepository } from './employeeRepository';
import { createTestPool } from '../test/testDb';

describe('EmployeeRepository', () => {
  const { pool } = createTestPool();
  const repo = new EmployeeRepository(pool);

  beforeEach(async () => {
    await pool.query('DELETE FROM employees');
  });

  it('creates and finds an employee', async () => {
    const created = await repo.create({
      fullName: 'Alice Johnson',
      jobTitle: 'HR Manager',
      country: 'India',
      salary: 1500000,
      email: 'alice@company.com',
      department: 'HR',
    });

    expect(created.id).toBeDefined();
    expect(created.fullName).toBe('Alice Johnson');

    const found = await repo.findById(created.id);
    expect(found?.email).toBe('alice@company.com');
  });

  it('lists employees with pagination', async () => {
    for (let i = 0; i < 5; i++) {
      await repo.create({
        fullName: `Person ${i}`,
        jobTitle: 'Engineer',
        country: 'US',
        salary: 100000 + i,
        email: `person${i}@test.com`,
        department: 'Engineering',
      });
    }

    const page1 = await repo.list({ page: 1, pageSize: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(5);

    const page3 = await repo.list({ page: 3, pageSize: 2 });
    expect(page3.items).toHaveLength(1);
  });

  it('updates an employee', async () => {
    const emp = await repo.create({
      fullName: 'Bob Lee',
      jobTitle: 'Designer',
      country: 'UK',
      salary: 70000,
      email: 'bob@company.com',
      department: 'Design',
    });

    const updated = await repo.update(emp.id, { salary: 75000 });
    expect(updated?.salary).toBe(75000);
  });

  it('deletes an employee', async () => {
    const emp = await repo.create({
      fullName: 'Carol Wu',
      jobTitle: 'Analyst',
      country: 'Germany',
      salary: 65000,
      email: 'carol@company.com',
      department: 'Finance',
    });

    const deleted = await repo.delete(emp.id);
    expect(deleted).toBe(true);
    expect(await repo.findById(emp.id)).toBeNull();
  });
});
