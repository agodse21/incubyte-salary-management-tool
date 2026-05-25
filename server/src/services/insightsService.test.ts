import { InsightsService } from './insightsService';
import { EmployeeRepository } from '../repositories/employeeRepository';
import { createTestPool } from '../test/testDb';

describe('InsightsService', () => {
  const { pool } = createTestPool();
  const insights = new InsightsService(pool);
  const repo = new EmployeeRepository(pool);

  beforeEach(async () => {
    await pool.query('DELETE FROM employees');
  });

  it('returns min, max, and average salary per country', async () => {
    await repo.create({
      fullName: 'A One',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 1000000,
      email: 'a1@test.com',
      department: 'Eng',
    });
    await repo.create({
      fullName: 'A Two',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 2000000,
      email: 'a2@test.com',
      department: 'Eng',
    });
    await repo.create({
      fullName: 'B One',
      jobTitle: 'Designer',
      country: 'US',
      salary: 80000,
      email: 'b1@test.com',
      department: 'Design',
    });

    const stats = await insights.getCountryStats();
    const india = stats.find((s) => s.country === 'India');

    expect(india).toEqual({
      country: 'India',
      minSalary: 1000000,
      maxSalary: 2000000,
      avgSalary: 1500000,
      employeeCount: 2,
    });
  });

  it('returns average salary by job title within a country', async () => {
    await repo.create({
      fullName: 'Eng 1',
      jobTitle: 'Software Engineer',
      country: 'US',
      salary: 100000,
      email: 'eng1@test.com',
      department: 'Eng',
    });
    await repo.create({
      fullName: 'Eng 2',
      jobTitle: 'Software Engineer',
      country: 'US',
      salary: 120000,
      email: 'eng2@test.com',
      department: 'Eng',
    });
    await repo.create({
      fullName: 'Mgr 1',
      jobTitle: 'Manager',
      country: 'US',
      salary: 150000,
      email: 'mgr1@test.com',
      department: 'Eng',
    });

    const byTitle = await insights.getJobTitleStatsByCountry('US');
    const engineers = byTitle.find((s) => s.jobTitle === 'Software Engineer');

    expect(engineers?.avgSalary).toBe(110000);
    expect(engineers?.employeeCount).toBe(2);
  });
});
