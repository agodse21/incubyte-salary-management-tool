# Performance notes

## Seed script (~10,000 rows)

- Inserts in batches of **500** rows per statement inside a single transaction.
- Uses multi-row `INSERT ... VALUES (...), (...)` to cut round trips.
- Name lists are read once from disk; salary values use a cheap deterministic formula (no `Math.random()` overhead per row).

On a typical laptop with local Postgres, expect sub-second to a few seconds for the full seed.

## API list endpoint

- Pagination defaults to 20 rows; hard cap at 100.
- `ILIKE` search uses indexed columns where possible; at 10k rows this remains acceptable for HR tooling.

## Insights

- Aggregations run in SQL (`GROUP BY`) so the API never loads all employees into memory.
