# Clinical Trials Dashboard

Full-stack **PERN** app (Postgres · Express · React · Node), TypeScript end-to-end,
in an npm-workspaces monorepo.

```
.
├─ client/   # React 19 + Vite + TanStack Query + Tailwind (SPA)
├─ server/   # Express + Prisma REST API
├─ data/     # seed CSVs (contracts, invoices)
└─ docker-compose.yml   # local Postgres
```

## Prerequisites
- Node 20+
- Docker Desktop (for local Postgres)

## First-time setup
```bash
npm install                 # installs both workspaces
npm run db:up               # start Postgres (docker-compose)
npm -w server run migrate   # apply Prisma migrations
npm -w server run seed      # load data/*.csv into the DB
```

Copy `server/.env.example` to `server/.env` (already present for local dev).

## Run (both apps together)
```bash
npm run dev     # client on http://localhost:5173, API on http://localhost:4000
```
The Vite dev server proxies `/api/*` to the Express API, so the browser stays
same-origin (no CORS) in development.

## API
Base path `/api`. All money fields are numbers, dates are ISO strings.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | liveness check |
| GET/POST | `/api/contracts` | list / create (Zod-validated) |
| PATCH/DELETE | `/api/contracts/:id` | update / delete |
| GET/POST | `/api/invoices` | list / create (Zod-validated) |
| PATCH/DELETE | `/api/invoices/:id` | update / delete |
| GET | `/api/dashboard/summary` | KPI cards, alerts, user status |
| GET | `/api/dashboard/revenue?granularity=daily\|weekly\|monthly` | revenue trend |

## Useful scripts
```bash
npm -w server run studio    # Prisma Studio (browse the DB)
npm -w server run dev       # API only, watch mode
npm -w client run dev       # client only
npm run build               # build both workspaces
```

## Deployment
- **Client** → Netlify (`netlify.toml` sets `base = "client"`). Set `VITE_API_URL`
  to the deployed API origin.
- **API** → any Node host (Render / Railway / Fly). Set `DATABASE_URL` (managed
  Postgres, e.g. Neon) and `CORS_ORIGIN` (the Netlify site URL). Run
  `npm run migrate:deploy` on release.

## Deferred (next pass)
JWT auth (register/login, protected write routes) · API Dockerfile · Vitest +
Supertest API tests · Contract↔Invoice foreign-key relation.
