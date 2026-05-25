# Trade-offs

## SQLite vs PostgreSQL

Assessment allows SQLite; we chose **PostgreSQL** per your preference. Slightly more setup locally (Docker) but closer to production and better for concurrent HR usage.

## Monolith API vs microservices

Single Express app keeps the assessment scope small. Insights run as SQL aggregates instead of a separate analytics service.

## Auth omitted

HR tool assumes a trusted internal network for MVP. Adding auth would be the first production hardening step.

## Seed determinism

Salaries use a simple deterministic formula from index rather than `Math.random()` so re-seeding is predictable in dev and tests.

## Vercel + long-running seed

Seed runs locally or in CI, not on Vercel serverless (timeout limits). Production DB is populated before deploy or via a one-off script.
