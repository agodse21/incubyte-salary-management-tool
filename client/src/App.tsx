import { NavLink, Route, Routes } from 'react-router-dom';
import { EmployeesPage } from './pages/EmployeesPage';
import { InsightsPage } from './pages/InsightsPage';

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">SalaryDesk</h1>
        <p className="logo-sub">HR salary management</p>
        <nav>
          <NavLink to="/" end>
            Employees
          </NavLink>
          <NavLink to="/insights">Insights</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>
    </div>
  );
}
