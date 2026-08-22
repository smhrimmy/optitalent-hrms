'use client';

import React from 'react';
import { ErrorPage } from './ErrorPage';

export const NotFoundError = () => (
  <ErrorPage
    code="404"
    title="That page is not in the file"
    description="The URL does not match a screen in OptiTalent. Check the link, or open the home page."
    actionLabel="Home"
    actionHref="/"
    secondaryActionLabel="Help"
    secondaryHref="/help"
  />
);

export const UnauthorizedError = () => (
  <ErrorPage
    code="401"
    title="Sign in required"
    description="This screen is for signed-in staff. Use a work email or a demo account."
    actionLabel="Sign in"
    actionHref="/login"
  />
);

export const ForbiddenError = () => (
  <ErrorPage
    code="403"
    title="Your role cannot open this"
    description="The record exists, but this account is not allowed to see it. Ask HR to change the role if you need it."
    actionLabel="Dashboard"
    actionHref="/dashboard"
    secondaryActionLabel="Contact"
    secondaryHref="/contact"
  />
);

export const BadRequestError = () => (
  <ErrorPage
    code="400"
    title="The request was incomplete"
    description="A required field or ID was missing. Go back and try the action again."
    actionLabel="Home"
    actionHref="/"
  />
);

export const ServerError = ({ errorId }: { errorId?: string }) => (
  <ErrorPage
    code="500"
    title="The server failed this request"
    description="OptiTalent could not finish the action. Retry once. If it fails again, send support the trace id."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
    secondaryActionLabel="Contact support"
    secondaryHref="/contact"
  >
    {errorId ? <p className="font-code text-xs text-muted-foreground">Trace: {errorId}</p> : null}
  </ErrorPage>
);

export const BadGatewayError = () => (
  <ErrorPage
    code="502"
    title="Upstream service failed"
    description="A connected service (auth or database) returned an invalid response. Wait a minute and retry."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
  />
);

export const MaintenanceError = () => (
  <ErrorPage
    code="503"
    title="OptiTalent is offline for maintenance"
    description="Schema or app updates are in progress. Attendance and leave are paused until this page clears."
    actionLabel="Home"
    actionHref="/"
  />
);

export const GatewayTimeoutError = () => (
  <ErrorPage
    code="504"
    title="The request timed out"
    description="The server did not answer in time. Retry. Avoid submitting payroll twice until you see a confirmation."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
  />
);

export const RateLimitError = ({ retryAfter }: { retryAfter?: number }) => (
  <ErrorPage
    code="429"
    title="Too many requests"
    description="This IP hit the per-minute cap. Wait, then continue. Do not hammer sign-in."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
  >
    {retryAfter ? <p className="text-sm">Wait about {retryAfter} seconds.</p> : null}
  </ErrorPage>
);

export const OfflineError = () => (
  <ErrorPage
    code="offline"
    title="This device is offline"
    description="Clock-in and live lists need a network. Reconnect, then reload."
    actionLabel="Retry"
    onAction={() => window.location.reload()}
  />
);

export const SessionExpiredError = () => (
  <ErrorPage
    code="session"
    title="Your session ended"
    description="Sign in again to keep working. Unsaved form fields on this tab were not stored."
    actionLabel="Sign in"
    actionHref="/login"
  />
);

export const PaymentFailedError = () => (
  <ErrorPage
    code="payment"
    title="The payment did not go through"
    description="The card or bank declined this charge. No seat was added. Try another method or ask finance."
    actionLabel="Back to billing"
    actionHref="/contact"
  />
);

export const SuspendedError = () => (
  <ErrorPage
    code="suspended"
    title="This account is suspended"
    description="HR or a super-admin locked the tenant or user. Mail support@optitalent.com from the company domain."
    actionLabel="Contact"
    actionHref="/contact"
  />
);

export const ComingSoonError = () => (
  <ErrorPage
    code="soon"
    title="This module is not shipped yet"
    description="The button is real; the workflow is not. Use the modules in the sidebar that already run."
    actionLabel="Dashboard"
    actionHref="/dashboard"
  />
);

export const UnsupportedBrowserError = () => (
  <ErrorPage
    code="browser"
    title="This browser is too old"
    description="Use a current Chrome, Firefox, Safari, or Edge. Internet Explorer is not supported."
    actionLabel="Home"
    actionHref="/"
  />
);

export const EmptySearchError = () => (
  <ErrorPage
    code="search"
    title="No matching records"
    description="Nothing in this tenant matches that search. Clear the box or try a name, email, or employee id."
    actionLabel="Home"
    actionHref="/"
  />
);
