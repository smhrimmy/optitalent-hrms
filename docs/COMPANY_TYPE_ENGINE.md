# Company Type Engine

A serious HRMS does not look the same for every company. OptiTalent generates configuration from:

industry + size + workforce type + countries + entities + locations + operating model

## Flow

1. `/setup` or **Company type** in the nav — blueprint wizard
2. Proposed modules, org tree, worker types, roles, policies
3. **Generate this HRMS** writes `dataQuery.company`
4. Nav hides industry-only modules (plants, stores, credentials, fleet, sites) unless enabled
5. Admins override via **Feature matrix**, **Role builder**, **Policy engine**

## Hierarchy

GLOBAL → TENANT → LEGAL ENTITY → COUNTRY → STATE → LOCATION → BUSINESS UNIT → DEPARTMENT → JOB FAMILY → EMPLOYMENT TYPE → EMPLOYEE

The blueprint is the starting point. Effective policy is calculated down this stack.

## Roles

Not only Admin / HR / Employee. System roles include platform owner, org admin, HR super, HR manager, HR exec, recruiter, hiring manager, payroll, attendance admin, finance, manager, employee, store manager.

Each role has **scope** (location, department, region, worker type, entity), **module actions**, and **field-level** access (salary, bank, tax, performance, medical).

## Demo presets

- Software startup 50 India remote
- Manufacturing 2,800 four plants
- Retail 85 stores seasonal
- Healthcare licensed 24/7
- Banking
- Consulting billable
