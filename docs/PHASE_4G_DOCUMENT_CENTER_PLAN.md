# Phase 4G.5: Document Center OS Implementation Plan

## Goal
Build a production-grade Employee Document Center OS. It must NOT be a simple upload/download page, but a secure document operating system that integrates with the existing lifecycle, permissions, requests, workflows, and audit architecture.

## Existing Infrastructure Audit
- **Models to extend/reuse**: `EmployeeContextService`, `EmployeeRequest`, `Workflow Runtime`, `PermissionService`, `EventRegistry`.
- **Components to reuse**: `<ActionCenter />`, `<RequestTimeline />`, `<StatusBadge />`.
- **Underlying Engines**: Policy Engine (for required documents based on country/role), Digital Twin (for verified certificates), Lifecycle Engine (onboarding/offboarding documents).

## UI Implementation

### 1. Document Dashboard (`/employee/documents`)
- **Top-level summary**: Total, Verified, Action Required, Expiring Soon.
- **Organization**: Configurable Categories (Identity, Payroll, Benefits, etc.), Search, Filters (Status, Category, Expiry).
- **Required Documents View**: `/employee/documents/required` with explanations of *why* they are required (linked to Policy Engine).

### 2. Document Detail & Viewer (`/employee/documents/[id]`)
- **Secure Viewer**: Support PDF/Images. Do not expose raw storage URLs. Must use signed URLs.
- **Metadata**: Category, Issued Date, Expiry, Uploaded, Verified By, Version history.
- **Lifecycle Actions**: Download, Replace, Request Change, Archive (where permitted).

### 3. Document Request Engine
- Integrate with Universal Request Engine. E.g., "Request salary certificate".
- Flow: Request -> Workflow -> Generated/Uploaded -> Notification -> Available in Document Center.

### 4. Upload & Verification Workflow
- Strict validation (MIME, size).
- States: Uploading -> Processing -> Under Review -> Verified -> Rejected.
- Never show "Uploaded" until it actually succeeds and is committed to storage.

## Security & Permissions
- **IDOR Protection**: Resolving document authorization server-side. Ensure `documentId` alone cannot grant access.
- **Field-level / Category-level Access**: Some documents (like payroll) have tighter restrictions than general policies.
- **Audit Logging**: Every view, download, upload, replace, verify, and reject action must be logged without exposing the document contents.

## AI & Integrations
- **Career/Skills**: When a certificate is uploaded, it does *not* immediately affect the Digital Twin. Only after the `Verified` state does it emit `skill.evidence_added`.
- **Onboarding/Lifecycle**: Document requirements driven by lifecycle state.

## Testing & QA
- **Mobile First**: Viewers and uploaders must work on 375px screens.
- **Security Testing**: Verify cross-tenant boundary, IDOR protection, and short-lived signed URLs.
- **Documentation**: Produce `PHASE_4G_DOCUMENT_QA.md` alongside the feature.
