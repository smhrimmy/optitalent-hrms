# OptiTalent — AI Workforce Operating System

OptiTalent still contains a full HRMS (core HR, payroll, attendance, ATS). The product is **not** “more modules.” It is an operating system that **predicts, explains why, recommends, simulates, and executes** on a unified employee graph.

Demo login: `admin@optitalent.com` / `password123` (also `hr@`, `manager@`, `employee@`).

Open **People OS** after login (`/{role}/command-center`).

## Documentation

* [Company Type Engine](./docs/COMPANY_TYPE_ENGINE.md) — industry blueprints, roles, policies
* [Architecture](./docs/ARCHITECTURE_SPEC.md) — DNA, engines, repository, audit
* [Design system](./docs/DESIGN_SYSTEM.md)
* [Launch checklist](./docs/PROJECT_CHECKLIST.md)

## Why this exists

Workday, SAP SuccessFactors, Oracle HCM, Darwinbox, Keka, greytHR, Zoho People, BambooHR, Rippling, ADP, and UKG already cover records + payroll + talent suites. greytHR NAVOS and SAP recruiting AI show the market moving to **agentic, skills-aware** products. Adding a chatbot to an HRMS is not a strategy.

OptiTalent’s stack: **HRMS + graph + intelligence + agents + simulation**.

## Tech

Next.js App Router, TypeScript, Tailwind, optional Supabase. Local `dataquery` so every module works without credentials.

## Table-stakes HRMS (included, not the USP)

Core HR, ATS, leave, attendance, payroll, helpdesk, expenses, assets, OKRs, and inbox still run on `src/lib/dataquery.ts` so the demo works without Supabase.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Demo passwords are `password123`. Supabase env vars are optional.

Any seeded `@optitalent.com` account uses the same password.


