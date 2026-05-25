import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from './employeeValidation';

describe('validateCreateEmployee', () => {
  it('accepts a valid employee payload', () => {
    const result = validateCreateEmployee({
      fullName: 'Jane Doe',
      jobTitle: 'Software Engineer',
      country: 'India',
      salary: 1200000,
      email: 'jane@example.com',
      department: 'Engineering',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fullName).toBe('Jane Doe');
      expect(result.value.salary).toBe(1200000);
    }
  });

  it('rejects empty full name', () => {
    const result = validateCreateEmployee({
      fullName: '   ',
      jobTitle: 'Designer',
      country: 'US',
      salary: 80000,
      email: 'a@b.com',
      department: 'Design',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/full name/i);
  });

  it('rejects negative salary', () => {
    const result = validateCreateEmployee({
      fullName: 'John Smith',
      jobTitle: 'Analyst',
      country: 'UK',
      salary: -1,
      email: 'john@example.com',
      department: 'Finance',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/salary/i);
  });

  it('rejects invalid email', () => {
    const result = validateCreateEmployee({
      fullName: 'John Smith',
      jobTitle: 'Analyst',
      country: 'UK',
      salary: 50000,
      email: 'not-an-email',
      department: 'Finance',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/email/i);
  });
});

describe('validateUpdateEmployee', () => {
  it('allows partial updates', () => {
    const result = validateUpdateEmployee({ salary: 95000 });
    expect(result.ok).toBe(true);
  });

  it('rejects empty update object', () => {
    const result = validateUpdateEmployee({});
    expect(result.ok).toBe(false);
  });
});
