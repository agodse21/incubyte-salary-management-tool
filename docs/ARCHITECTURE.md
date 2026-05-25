# Architecture

## Overview

```
React (Vite)  --REST-->  Express API  -->  PostgreSQL
                              ^
                         Seed script
```

## Backend layers

| Layer | Responsibility |
|-------|----------------|
| `domain/` | Types and input validation |
| `repositories/` | SQL access for employees |
| `services/` | Business rules, insights aggregations |
| `routes/` | HTTP mapping and status codes |

## Frontend

- **Employees page**: paginated table, search, CRUD modals
- **Insights page**: country salary stats, job-title breakdown, org summary

## Database

- Table `employees` with indexes on `country`, `job_title`, and `(country, job_title)` for insight queries at 10k scale.

## Deployment (Vercel)

- Static UI from `client/dist`
- API via serverless wrapper in `api/index.ts`
- Hosted Postgres (Neon / Supabase / Vercel Postgres) via `DATABASE_URL`
