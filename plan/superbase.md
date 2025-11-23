## Supabase Integration Plan

This document tracks the complete rollout of Supabase for database and storage. It includes a progress tracker, task breakdown, owners/placeholders, acceptance criteria, and implementation notes.

### Progress Tracker

- [ ] Environment and secrets wiring (.env, CI secrets)
- [ ] Supabase client SDK installed and initialized
- [ ] Database schema modeled and migrations applied
- [ ] Storage buckets created with policies
- [ ] Data access layer (repositories) implemented
- [ ] Authentication and Row Level Security configured
- [ ] Seed scripts created and executed
- [ ] Backups, monitoring, and error handling in place
- [ ] CI/CD integration and local dev tooling set up

### Scope and Goals

- Centralize all persistent data in Supabase Postgres.
- Store binary assets (files, images) in Supabase Storage with fine-grained policies.
- Provide a clear, typed data access layer to the rest of the codebase.
- Enforce least-privilege via RLS and scoped keys.
- Ensure reproducible local dev and safe production operations.

### Non-Goals

- Vendor-specific business logic in SQL outside of constraints/policies.
- Replacing existing auth provider if one exists (we’ll integrate or migrate later as needed).

---

## Phase 0 — Discovery and Assumptions

- Codebase stack: UNKNOWN (server framework, runtime, build system). We’ll detect and adapt during SDK wiring.
- Secret management: Use `.env` for local; CI secrets for deploy pipelines.
- Node/TypeScript assumed for examples; adapt for other runtimes if detected.

Deliverables:

- [ ] Inventory of data models and files needing storage
- [ ] Decision on SDK variant (JS/TS, Python, etc.)

---

## Phase 1 — Environment and Secrets

Tasks:

- [ ] Create `.env` with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and database connection secrets if server needs direct SQL
- [ ] Add `.env.example` without secrets
- [ ] Configure CI secrets (production/staging) and mark required variables

Acceptance Criteria:

- Running app locally finds Supabase URL and keys from `.env`
- CI pipelines have non-empty values for required secrets

Notes:

- Use service role key only on server, never on client
- Keep anon key on client for public operations per policy

---

## Phase 2 — SDK Installation and Bootstrap

Tasks:

- [ ] Install Supabase client for the primary runtime (e.g., `@supabase/supabase-js`)
- [ ] Create a centralized client factory (e.g., `lib/supabaseClient.ts`)
- [ ] Server-side: configure a privileged client using service role key via env
- [ ] Client-side: configure anon client for safe reads/writes per RLS

Acceptance Criteria:

- Single import path for Supabase operations
- No key leakage into client bundles (service role restricted to server)

---

## Phase 3 — Database Schema and Migrations

Tasks:

- [ ] Model entities and relationships (users, items, collections, activity, etc.)
- [ ] Write SQL migrations (idempotent, forward-only)
- [ ] Add constraints, indexes, and foreign keys
- [ ] Create views/materialized views where helpful

Acceptance Criteria:

- Migrations apply cleanly on fresh database
- Query plans reasonable (indexes for hot paths)

Notes:

- Prefer UUID primary keys
- Add `created_at`, `updated_at` timestamps defaulted in SQL

---

## Phase 4 — Storage Buckets and Policies

Tasks:

- [ ] Create buckets (e.g., `public-assets`, `user-content`, `backups`)
- [ ] Define object key structure (e.g., `userId/entityId/filename`)
- [ ] Write storage policies limiting access by auth role and ownership
- [ ] Add upload/download utilities

Acceptance Criteria:

- Public assets readable without auth if intended
- User content readable/writeable only by owner or permitted roles

---

## Phase 5 — Data Access Layer (Repositories)

Tasks:

- [ ] Define repository interfaces for each domain entity
- [ ] Implement CRUD with Supabase query builders
- [ ] Add pagination, filtering, and transactional operations where needed
- [ ] Centralize error handling and result types

Acceptance Criteria:

- Business logic imports repositories only (no scattered SDK calls)
- Typed results and unified error shapes

---

## Phase 6 — Authentication and RLS

Tasks:

- [ ] Enable/auth integrate Supabase Auth or map existing auth to Supabase user IDs
- [ ] Write RLS policies per table for read/write/delete
- [ ] Add role/claims mapping strategy

Acceptance Criteria:

- All tables protected by RLS and unit-tested
- Privileged operations only via service role key on server

---

## Phase 7 — Seed Data

Tasks:

- [ ] Create seed scripts (idempotent)
- [ ] Include fixture media into storage if necessary

Acceptance Criteria:

- One command seeds baseline data for local/dev

---

## Phase 8 — Backups, Monitoring, and Error Handling

Tasks:

- [ ] Configure automated database backups and retention
- [ ] Add query error logging and structured metrics
- [ ] Document restore procedures and runbooks

Acceptance Criteria:

- Backup job verified and restore tested
- Observability dashboards capture key DB/storage metrics

---

## Phase 9 — CI/CD and Local Dev Tooling

Tasks:

- [ ] Wire Supabase secrets in CI/CD
- [ ] Add Supabase CLI for local workflows (optional)
- [ ] Pre-deploy check for pending migrations and policy diffs

Acceptance Criteria:

- CI can run migrations safely
- Local onboarding documented and reproducible

---

## Risk Log and Mitigations

- Data model drift: enforce migrations via CI and code review
- Key leakage: separate client/server env, never ship service role to client
- RLS gaps: default deny and add explicit, tested policies
- Large object storage costs: lifecycle and size limits per bucket

---

## Deliverables Checklist (Granular)

- [ ] `.env` and `.env.example`
- [ ] `lib/supabaseClient` (client + server variants)
- [ ] `migrations/` SQL files with versioning
- [ ] `storage/` policies and bucket setup scripts
- [ ] `repositories/` with typed interfaces and implementations
- [ ] `auth/` integration and RLS policies
- [ ] `scripts/seed` and optional fixture assets
- [ ] `ops/backup` procedures and configs
- [ ] CI jobs for migrate/seed/test

---

## Next Actions

1. Wire environment variables and secrets
2. Bootstrap SDK client(s)
3. Draft initial schema and storage buckets
4. Implement the first repository and end-to-end read/write test

When each step completes, check the boxes in this plan and reference commit SHAs.
