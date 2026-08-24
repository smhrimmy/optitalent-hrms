# Evreghen Command Center: Route & Architecture Inventory

## Design System Overview (from {{DATA:DOCUMENT:DOCUMENT_1}})
- **Brand Identity:** Warm off-white workspace (`#fcfaf7`) with a dark frosted application shell (70% black opacity, 12px blur).
- **Primary Accent:** Orange telemetry (`#fe6e00`).
- **Typography:** Practical system-sans stack.
- **Layout:** 1400px centered container, 64px header, 256px sidebar.

## Initial Route Inventory (Target State)
Based on the "Command Center" and "Security Operations" persona, the following routes are required for a complete implementation:

| Route | Purpose | User Roles | Status |
|---|---|---|---|
| `/login` | Entry point & Auth | All | Planned |
| `/dashboard` | High-level SOC telemetry & KPIs | All | Planned |
| `/threat-analysis` | Detailed security event inspection | Analyst, Admin | Planned |
| `/endpoints` | Managed device/asset inventory | Analyst, Admin | Planned |
| `/reports` | Compliance and historical data | Admin, Manager | Planned |
| `/settings` | System & user configuration | Admin | Planned |

## Implementation Plan
1. **Foundation:** Confirm Design System tokens.
2. **Layout:** Build the dark frosted application shell (Sidebar + Header).
3. **Authentication:** Build the high-impact split-panel login screen.
4. **Operations:** Build the Dashboard and Threat Analysis screens with dense operational UI.
5. **Inventory:** Build Endpoint management tables.
6. **Interaction:** Connect navigation and wire up mock telemetry states.