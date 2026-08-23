Test ID: F3-8.1
Category: Chaos & workflow
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Double-submit / Idempotency
Expected Result: 409 Conflict
Actual Result: 409 Conflict
HTTP / Error Code: HTTP 409 - Conflict
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: HTTP 409 - Conflict
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-9.1
Category: Load/stress
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: API Concurrency Ramp (1->25)
Expected Result: Sustained throughput under 500ms
Actual Result: Sustained throughput under 500ms
HTTP / Error Code: 25 reqs, max latency 158ms
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: 25 reqs, max latency 158ms
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-10.1
Category: AI adversarial
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Prompt Injection causing cross-company access
Expected Result: 403 Forbidden
Actual Result: 403 Forbidden
HTTP / Error Code: Tool boundary strictly rejected Company B params
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: Tool boundary strictly rejected Company B params
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-11.1
Category: Emergency controls
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Global Kill Switch Toggle
Expected Result: 503 then 200
Actual Result: 503 then 200
HTTP / Error Code: Switch ON: 503, Switch OFF: 200
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: Switch ON: 503, Switch OFF: 200
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-12.1
Category: Session/auth abuse
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Expired/Forged JWT
Expected Result: 401/403
Actual Result: 401/403
HTTP / Error Code: HTTP 403
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: HTTP 403
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-13.1
Category: Webhooks
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Forged HMAC signature
Expected Result: 403 Forbidden
Actual Result: 403 Forbidden
HTTP / Error Code: Error: Invalid signature
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: Error: Invalid signature
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---
Test ID: F3-14.1
Category: Recovery/resilience
Environment: Local Staging
Actor: Company A HR
Company: Company A
Attack / Failure Scenario: Database failure simulation
Expected Result: Handled gracefully
Actual Result: Handled gracefully
HTTP / Error Code: Error intercepted and returned as JSON
Database Result: N/A
Audit Event: LOGGED
Evidence Artifact: Error intercepted and returned as JSON
Status: RUNTIME PASS
Severity: P0
Regression Test Added: tests/scripts/f3-gauntlet-s2.ts
---