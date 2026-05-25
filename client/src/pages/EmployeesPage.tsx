import { useCallback, useEffect, useRef, useState } from 'react';
import { COUNTRIES } from '@shared/employeeOptions';
import { api } from '../api/client';
import { EmployeeForm } from '../components/EmployeeForm';
import type { Employee, EmployeeInput } from '../types/employee';
import { formatSalary } from '../utils/format';

const SEARCH_DEBOUNCE_MS = 400;

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const hasLoadedOnce = useRef(false);

  const pageSize = 20;

  // Debounce typing — API runs only after user pauses
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [countryFilter]);

  const load = useCallback(async () => {
    if (!hasLoadedOnce.current) {
      setLoading(true);
    } else {
      setIsSearching(true);
    }
    setError('');

    try {
      const data = await api.listEmployees({
        page,
        pageSize,
        search: searchQuery || undefined,
        country: countryFilter || undefined,
      });
      setEmployees(data.items);
      setTotal(data.total);
      hasLoadedOnce.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [page, searchQuery, countryFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(data: EmployeeInput) {
    await api.createEmployee(data);
    setShowForm(false);
    setPage(1);
    await load();
  }

  async function handleUpdate(data: EmployeeInput) {
    if (!editing) return;
    await api.updateEmployee(editing.id, data);
    setEditing(null);
    await load();
  }

  async function handleDelete(emp: Employee) {
    if (!confirm(`Delete ${emp.fullName}?`)) return;
    await api.deleteEmployee(emp.id);
    await load();
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>Employees</h2>
          <p className="muted">{total.toLocaleString()} total records</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Add employee
        </button>
      </header>

      <div className="toolbar">
        <input
          placeholder="Search name, email, or title…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-busy={isSearching}
        />
        {isSearching && <span className="search-hint muted">Searching…</span>}
        <select
          aria-label="Filter by country"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="banner-error">{error}</p>}

      {(showForm || editing) && (
        <EmployeeForm
          initial={editing ?? undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {loading ? (
        <p>Loading employees…</p>
      ) : (
        <div className={`table-wrap${isSearching ? ' is-loading' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Country</th>
                <th>Department</th>
                <th>Salary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <strong>{emp.fullName}</strong>
                    <div className="muted small">{emp.email}</div>
                  </td>
                  <td>{emp.jobTitle}</td>
                  <td>{emp.country}</td>
                  <td>{emp.department}</td>
                  <td>{formatSalary(emp.salary, emp.country)}</td>
                  <td className="actions">
                    <button
                      className="btn-link"
                      onClick={() => {
                        setShowForm(false);
                        setEditing(emp);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-link danger" onClick={() => handleDelete(emp)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          disabled={page <= 1 || isSearching}
          onClick={() => setPage((p) => p - 1)}
          className="btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages || isSearching}
          onClick={() => setPage((p) => p + 1)}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}
