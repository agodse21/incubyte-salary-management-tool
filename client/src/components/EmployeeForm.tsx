import { useState } from 'react';
import { COUNTRIES, DEPARTMENTS, JOB_TITLES } from '@shared/employeeOptions';
import type { Employee, EmployeeInput } from '../types/employee';

type Props = {
  initial?: Employee;
  onSubmit: (data: EmployeeInput) => Promise<void>;
  onCancel: () => void;
};

const emptyForm: EmployeeInput = {
  fullName: '',
  jobTitle: '',
  country: '',
  salary: 0,
  email: '',
  department: '',
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const list =
    value && !options.includes(value) ? [value, ...options] : [...options];

  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled>
          Select…
        </option>
        {list.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmployeeForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<EmployeeInput>(
    initial
      ? {
          fullName: initial.fullName,
          jobTitle: initial.jobTitle,
          country: initial.country,
          salary: initial.salary,
          email: initial.email,
          department: initial.department,
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof EmployeeInput>(key: K, value: EmployeeInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit employee' : 'Add employee'}</h3>
      {error && <p className="form-error">{error}</p>}

      <label>
        Full name
        <input
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          required
        />
      </label>

      <SelectField
        label="Job title"
        value={form.jobTitle}
        options={JOB_TITLES}
        onChange={(v) => updateField('jobTitle', v)}
      />

      <SelectField
        label="Country"
        value={form.country}
        options={COUNTRIES}
        onChange={(v) => updateField('country', v)}
      />

      <SelectField
        label="Department"
        value={form.department}
        options={DEPARTMENTS}
        onChange={(v) => updateField('department', v)}
      />

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
      </label>

      <label>
        Salary
        <input
          type="number"
          min={1}
          value={form.salary || ''}
          onChange={(e) => updateField('salary', Number(e.target.value))}
          required
        />
      </label>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
