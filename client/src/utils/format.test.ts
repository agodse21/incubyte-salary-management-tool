import { describe, expect, it } from 'vitest';
import { formatSalary } from './format';

describe('formatSalary', () => {
  it('formats US salaries in USD', () => {
    expect(formatSalary(85000, 'United States')).toContain('85,000');
  });

  it('formats India salaries in INR', () => {
    const formatted = formatSalary(1200000, 'India');
    expect(formatted).toMatch(/INR|₹/);
  });
});
