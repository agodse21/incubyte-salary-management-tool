# Planning notes

## Persona

HR Manager needs to maintain employee records and compare compensation by country and role.

## MVP scope

1. Employee CRUD (name, title, country, salary + email, department)
2. Insights: min/max/avg by country; avg by job title within country; headcount
3. Seed 10k rows from first/last name lists
4. Paginated employee list (10k is too large for one page)

## Out of scope (for minimal MVP)

- Auth / RBAC
- Audit logs
- Multi-currency conversion

## TDD order

1. Domain validation
2. Repository (integration tests against Postgres test DB or pg-mem)
3. Employee + insights services
4. HTTP routes
5. UI components and pages
