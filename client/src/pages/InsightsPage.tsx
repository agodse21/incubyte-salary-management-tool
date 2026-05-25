import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { CountryStats, JobTitleStats, OrgSummary } from '../types/employee';
import { formatSalary } from '../utils/format';

export function InsightsPage() {
  const [summary, setSummary] = useState<OrgSummary | null>(null);
  const [byCountry, setByCountry] = useState<CountryStats[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [byTitle, setByTitle] = useState<JobTitleStats[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [summaryData, countryData] = await Promise.all([
          api.getSummary(),
          api.getCountryStats(),
        ]);
        setSummary(summaryData);
        setByCountry(countryData);
        if (countryData.length > 0) {
          setSelectedCountry(countryData[0].country);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load insights');
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    api
      .getJobTitleStats(selectedCountry)
      .then(setByTitle)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load job title stats')
      );
  }, [selectedCountry]);

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>Salary insights</h2>
          <p className="muted">Compensation overview for HR planning</p>
        </div>
      </header>

      {error && <p className="banner-error">{error}</p>}

      {summary && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Total employees</span>
            <span className="stat-value">{summary.totalEmployees.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Countries</span>
            <span className="stat-value">{summary.countryCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Org average salary</span>
            <span className="stat-value">{summary.avgSalary.toLocaleString()}</span>
          </div>
        </div>
      )}

      <section className="section">
        <h3>By country</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Employees</th>
                <th>Min</th>
                <th>Max</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {byCountry.map((row) => (
                <tr key={row.country}>
                  <td>{row.country}</td>
                  <td>{row.employeeCount}</td>
                  <td>{formatSalary(row.minSalary, row.country)}</td>
                  <td>{formatSalary(row.maxSalary, row.country)}</td>
                  <td>{formatSalary(row.avgSalary, row.country)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h3>Average salary by job title</h3>
        <label className="inline-label">
          Country
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {byCountry.map((c) => (
              <option key={c.country} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
        </label>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job title</th>
                <th>Employees</th>
                <th>Average salary</th>
              </tr>
            </thead>
            <tbody>
              {byTitle.map((row) => (
                <tr key={row.jobTitle}>
                  <td>{row.jobTitle}</td>
                  <td>{row.employeeCount}</td>
                  <td>{formatSalary(row.avgSalary, row.country)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
