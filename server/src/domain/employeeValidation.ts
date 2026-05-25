import { z } from 'zod';
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee';

const createSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  country: z.string().trim().min(1, 'Country is required'),
  salary: z.number().positive('Salary must be greater than zero'),
  email: z.string().trim().email('Invalid email address'),
  department: z.string().trim().min(1, 'Department is required'),
});

const updateSchema = createSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required for update' }
);

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function formatZodError(err: z.ZodError): string {
  return err.issues[0]?.message ?? 'Validation failed';
}

export function validateCreateEmployee(
  input: unknown
): ValidationResult<CreateEmployeeInput> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }
  return { ok: true, value: parsed.data };
}

export function validateUpdateEmployee(
  input: unknown
): ValidationResult<UpdateEmployeeInput> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) };
  }
  return { ok: true, value: parsed.data };
}
