# AI prompts and usage

How AI tools were used for this assessment, without replacing engineering judgment.

## During implementation

1. **TDD order** — validation → repository → services → routes → UI; red/green commits per layer.
2. **Vercel constraints** — static client + serverless API; seed and migrations run outside serverless (timeouts).
3. **Keep it simple** — layered structure only where it helps; no extra frameworks beyond Express, Zod, and pg.

## Manual review

- Naming and test descriptions were edited for clarity.
- HR fields (email, department) and insight metrics were chosen for the HR Manager persona.
- Repository tests use `pg-mem` so CI/local runs do not require Docker for every test run.
