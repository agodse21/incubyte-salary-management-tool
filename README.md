# Salary Management Tool

Minimal HR salary management app for ~10,000 employees. Built with Node/TypeScript, PostgreSQL, and React (Vite).

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

## Setup

```bash
make setup   # install, .env, Postgres, migrate, seed
make dev
```

Or step by step: `make install`, `make env`, `make db-up`, `make db-migrate`, `make db-seed`, `make dev`.

- API: http://localhost:3001
- UI: http://localhost:5173

## Data seeding

After migrations, seed the database with **10,000 sample employees** (names from `server/data/`, deterministic salaries):

```bash
make db-seed
```

Or via npm:

```bash
npm run db:seed
```

`make setup` and `make setup-db` run migrate + seed automatically. To re-seed an existing database, run `make db-seed` again (requires `DATABASE_URL` in `.env` — local Postgres or Neon).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API + UI |
| `npm test` | Run all tests |
| `npm run db:seed` | Seed 10,000 employees |
| `make db-seed` | Same as `npm run db:seed` |


## Docs

- [Planning](docs/PLANNING.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Trade-offs](docs/TRADE_OFFS.md)
