# Security Test Matrix

This matrix tracks the intersection of Testing Domains against Target Actors.

## Multi-Company Test Matrix

| Actor / Target | Company A Data | Company B Data | Global Data |
|---|---|---|---|
| **Company A Employee** | 🟡 Restricted (Self/Public) | 🔴 DENY | 🔴 DENY |
| **Company A Manager** | 🟡 Restricted (Team/Self) | 🔴 DENY | 🔴 DENY |
| **Company A HR Admin** | 🟢 ALLOW (All A) | 🔴 DENY | 🔴 DENY |
| **Company B HR Admin** | 🔴 DENY | 🟢 ALLOW (All B) | 🔴 DENY |
| **Super Admin** | 🟢 ALLOW | 🟢 ALLOW | 🟢 ALLOW |
| **Platform Auditor** | 🟡 Read Only | 🟡 Read Only | 🟡 Read Only |

## Role Escalation Matrix

| Attack Vector | Expected Result | Actual Result |
|---|---|---|
| Employee -> Manager API Call | 403 Forbidden | PASS |
| Manager -> HR API Call | 403 Forbidden | PASS |
| HR -> Super Admin API Call | 403 Forbidden | PASS |
| Client Role Modification | Ignored | PASS |
| Client `company_id` Modification | Ignored | PASS |

## Integration Matrix

| Integration | Auth Type | Scope | Test Result |
|---|---|---|---|
| Payroll Webhooks | HMAC | Write-only | STATIC PASS |
| AI Tool Calls | System Injection | Strict Company Bounds | SIMULATED PASS |
