import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmployeeForm } from './EmployeeForm';

describe('EmployeeForm', () => {
  it('renders add employee heading', () => {
    render(
      <EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: /add employee/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<EmployeeForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.selectOptions(screen.getByLabelText(/job title/i), 'Software Engineer');
    await user.selectOptions(screen.getByLabelText(/country/i), 'India');
    await user.selectOptions(screen.getByLabelText(/department/i), 'Engineering');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/salary/i), '900000');
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      jobTitle: 'Software Engineer',
      country: 'India',
      department: 'Engineering',
      email: 'jane@example.com',
      salary: 900000,
    });
  });
});
