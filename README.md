# Veri5 (By Syncode)

> **Status:** This project is under active development. The stack is in place and the UI and database schema are evolving quickly.

## Overview
Veri5 is a full-stack platform centered on STI testing workflows, verification, and partner status sharing. The repository contains:

- **Frontend:** Next.js app for the public site and dashboard experiences.
- **Backend:** Express/TypeScript service (currently scaffolding) with a Prisma-powered PostgreSQL schema.
- **Database:** PostgreSQL with a fairly complete relational model for users, clinics, appointments, verification history,orders, and shipments.

> **Note:** `backend/src/index.ts` is currently empty, so API routes and business logic are still being implemented.

## Prerequisites

- **Node.js** 20+
- **Docker** + **Docker Compose** (recommended for full-stack dev)
- **PostgreSQL** (only needed if you run the backend without Docker)

## Quick Start (Docker Compose)

Create a `.env` file in the repo root with Postgres credentials:

```bash
POSTGRES_USER=<example_user_name>
POSTGRES_PASSWORD=<example_password>
POSTGRES_DB=<example_db_name>
```

Then start the stack:

```bash
docker compose up --build
```
Seed the database (Run this once when you're setting up the project):

```bash
docker compose exec backend npx prisma db seed
```

This launches:

- **Postgres** on `localhost:5432`
- **Backend** on `localhost:5000`
- **Frontend** on `localhost:3000`

## Local Development (Without Docker)

### 1) Backend

```bash
cd backend
npm install
```

Set `DATABASE_URL` (e.g. in `backend/.env`):

```bash
DATABASE_URL="postgresql://veri5:veri5@localhost:5432/veri5"
```

Run Prisma migrations + generate client:

```bash
npx prisma migrate dev
npx prisma generate
```

Seed data (optional):

```bash
npx prisma db seed
```
Prisma Studio (for visually editing the DB)

```bash
npx prisma studio --config ./prisma.config.ts
```

Start the backend (once `src/index.ts` is implemented):

```bash
npx nodemon --watch src --exec ts-node src/index.ts
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Common Scripts

### Frontend

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — lint checks

### Backend

- `npx prisma migrate dev` — apply schema changes
- `npx prisma db seed` — seed database

## Project Structure

```
.
├── backend          # Express/TS backend with Prisma
├── frontend         # Next.js frontend
├── docker-compose.yml
└── README.md
```

## Contributing Notes

- The backend API surface is still being designed; expect breaking changes.
- Keep Prisma schema updates in sync with frontend views.
- Use Docker Compose for consistent local development.
