# Phase 4H.8: Team Capacity & Skills OS Implementation Plan

## Goal
Transform the Manager OS into a comprehensive team operating system answering: "Do I have the right people, skills, capacity, and workload to deliver the team's objectives?" 
Build `/manager/capacity` and `/manager/skills` by projecting data from the existing Digital Twin, Skills Engine, and Workforce Planning modules, without creating parallel databases.

## 4H.8 Implementation Scope

### 1. Executive Team Capacity View (`/manager/capacity`)
- **Focus**: Clear visual indicators of workload health (Available vs. Allocated capacity).
- **Classifications**: Healthy, Watch, Overloaded, Critical, Underutilized (based purely on organizational data, not psychological judgments).
- **Components**:
  - Capacity overview bars.
  - Drill-down into specific employee capacity (Current allocation, working schedule, project assignments, attendance signals).
  - Explicit UI links to the Workforce Planning Simulator for scenario actions (e.g., "What happens if two engineers take leave?").

### 2. Team Skills Matrix (`/manager/skills`)
- **Focus**: Identifying skill coverage vs. required competencies for specific roles.
- **Components**:
  - A dense, sortable matrix showing Employee, Skill, Proficiency, Evidence, Target, and Gap.
  - Roll-up metrics highlighting critical gaps (e.g., "Cloud architecture: 41% coverage - Critical gap").
  - Clear intervention pathways: Train (links to Learning OS), Reallocate, or Hire (links to Hiring OS), rather than defaulting to hiring.

### 3. Manager AI Assistant (Capacity/Skills context)
- Integrate the AI to answer complex scenario and capacity questions ("Why is my team over capacity?", "Who could potentially take this project?").
- **Constraints**: 
  - Every recommendation must expose its evidence, reasoning summary, limitations, and recommended action.
  - Strictly enforce `PermissionService` to ensure managers cannot bypass access rules for matrix/dotted-line reports or cross-tenant data.

## User Review Required

> [!CAUTION]
> **Scenario Simulation Scope:** The plan involves exposing a UI for scenario simulation (e.g., "Can this team deliver the new project without hiring?"). Should this simulator execute completely client-side based on the current fetched Digital Twin payload to ensure immediate interactivity, or should it submit a formal "Simulation Request" payload to a mocked server endpoint to demonstrate async planning capabilities?
> 
> My recommendation is a **hybrid approach**: Client-side interactive sliders for basic capacity rebalancing, backed by an async "Run Detailed Simulation" button for complex scenarios involving internal mobility or hiring.

## Execution Order
1. Build the Team Skills Matrix (`/manager/skills`).
2. Build the Executive Capacity Dashboard (`/manager/capacity`).
3. Implement the interactive Employee Capacity Detail drawer.
4. Integrate the Scenario Simulation UI.
5. Execute Security, RBAC, and State Coverage QA.
