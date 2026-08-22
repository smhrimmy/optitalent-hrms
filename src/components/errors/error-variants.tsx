'use client';

import React from 'react';
import { ErrorPage } from './ErrorPage';

export const NotFoundError = () => (
  <ErrorPage
    code="404"
    title="This page is not on the org chart"
    description="The URL does not match a screen in OptiTalent. Return to the dashboard or use search to find a person or module."
    actionLabel="Go to dashboard"
    onAction={() => (window.location.href = '/dashboard')}
    secondaryActionLabel="Contact support"
    onSecondaryAction={() => window.open('mailto:support@optitalent.com')}
  />
);

export const UnauthorizedError = () => (
  <ErrorPage
    code="401"
    title="Sign in to continue"
    description="This screen holds employee records. Sign in with your work account to open it."
    actionLabel="Sign in"
    onAction={() => (window.location.href = '/login')}
  />
);

export const ForbiddenError = () => (
  <ErrorPage
    code="403"
    title="You do not have this clearance"
    description="Your role can see the rest of OptiTalent, but this record is limited to HR, payroll, or the employee’s manager."
    actionLabel="Back to dashboard"
    onAction={() => (window.location.href = '/dashboard')}
    secondaryActionLabel="Request access"
    onSecondaryAction={() => alert('Access request recorded for your tenant admin.')}
  />
);

export const BadRequestError = () => (
  <ErrorPage
    code="400"
    title="That request could not be read"
    description="A field is missing or the date range is invalid. Check the form and submit again."
    actionLabel="Go back"
    onAction={() => window.history.back()}
  />
);

export const ServerError = ({ errorId }: { errorId?: string }) => (
  <ErrorPage
    code="500"
    title="The people system hit a snag"
    description="We logged this with a trace ID. Payroll and attendance writes were not applied. Retry, or send the ID to support."
    actionLabel="Try again"
    onAction={() => window.location.reload()}
    secondaryActionLabel="Email support"
    onSecondaryAction={() => window.open('mailto:support@optitalent.com')}
  >
    {errorId && (
      <div className="mt-4 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">Trace ID: {errorId}</div>
    )}
  </ErrorPage>
);

export const BadGatewayError = () => (
  <ErrorPage
    code="502"
    title="A connected service failed"
    description="Payroll or identity provider did not respond. Wait a minute and retry. Attendance already saved locally is still on this device."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
  />
);

export const MaintenanceError = () => (
  <ErrorPage
    code="503"
    title="Scheduled maintenance"
    description="We are applying a payroll calendar update. Clock-in is paused until this window ends."
    actionLabel="Open status"
    onAction={() => (window.location.href = '/api/health')}
  />
);

export const GatewayTimeoutError = () => (
  <ErrorPage
    code="504"
    title="The request timed out"
    description="The server did not finish in time. Do not resubmit payroll until you confirm the last run in the payslip list."
    actionLabel="Check payroll"
    onAction={() => (window.location.href = '/dashboard')}
  />
);

export const RateLimitError = ({ retryAfter }: { retryAfter?: number }) => (
  <ErrorPage
    code="429"
    title="Too many attempts"
    description="Login and ticket create are rate-limited to protect employee data. Pause, then try again."
    actionLabel="Reload"
    onAction={() => window.location.reload()}
  >
    {retryAfter && <p className="text-sm font-medium">Retry after {retryAfter} seconds.</p>}
  </ErrorPage>
);

export const OfflineError = () => (
  <ErrorPage
    code="Offline"
    title="You are offline"
    description="Clock-in, leave drafts, and tickets already on this device still work. New payroll runs need a connection."
    actionLabel="Retry connection"
    onAction={() => window.location.reload()}
  />
);

export const SessionExpiredError = () => (
  <ErrorPage
    code="Session"
    title="Your session ended"
    description="For payroll and profile safety we signed you out after idle time. Sign in again — unsaved form fields were not stored."
    actionLabel="Sign in"
    onAction={() => (window.location.href = '/login')}
  />
);

export const PaymentFailedError = () => (
  <ErrorPage
    code="Payment"
    title="Subscription payment failed"
    description="The tenant plan could not be charged. HR records stay readable; payroll run is locked until billing is updated."
    actionLabel="Open billing"
    onAction={() => (window.location.href = '/login')}
  />
);

export const SuspendedError = () => (
  <ErrorPage
    code="Suspended"
    title="This company account is paused"
    description="A platform admin suspended the tenant. Employees cannot clock in until the account is restored."
    actionLabel="Contact support"
    onAction={() => window.open('mailto:support@optitalent.com')}
  />
);

export const ComingSoonError = () => (
  <ErrorPage
    code="Soon"
    title="This module is not on yet"
    description="The screen exists in the product map but is switched off for your tenant in Feature Config."
    actionLabel="Back"
    onAction={() => window.history.back()}
  />
);

export const UnsupportedBrowserError = () => (
  <ErrorPage
    code="Browser"
    title="This browser is not supported"
    description="OptiTalent needs a current Chrome, Safari, Firefox, or Edge build for face attendance and payroll PDFs."
    actionLabel="Continue anyway"
    onAction={() => (window.location.href = '/')}
  />
);
