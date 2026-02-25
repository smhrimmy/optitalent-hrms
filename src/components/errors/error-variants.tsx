'use client';

import React from 'react';
import { ErrorPage } from './ErrorPage';

// Using external Lottie JSON URLs for better performance and to avoid bundling large JSON files
// In a real production app, you might download these to public/animations/

// --- 404 Not Found ---
export const NotFoundError = () => (
  <ErrorPage
    code="404"
    title="Lost in Space?"
    description="This page seems to have drifted into deep space. Let's navigate you back to civilization."
    // 404 Astronaut floating
    imageUrl="https://illustrations.popsy.co/amber/surr-404.svg"
    isLottieUrl={false}
    actionLabel="Take Me Home 🚀"
    onAction={() => window.location.href = '/dashboard'}
  />
);

// --- 401 Unauthorized ---
export const UnauthorizedError = () => (
  <ErrorPage
    code="401"
    title="Who Goes There?"
    description="You need the secret handshake to enter this area. Let's verify your identity first."
    // Lock animation
    imageUrl="https://illustrations.popsy.co/amber/surr-access-denied.svg" 
    isLottieUrl={false}
    actionLabel="Log In"
    onAction={() => window.location.href = '/login'}
  />
);

// --- 403 Forbidden ---
export const ForbiddenError = () => (
  <ErrorPage
    code="403"
    title="Access Denied"
    description="This area is restricted. You're close, but your clearance level doesn't grant access to this sector."
    // Shield/Security animation
    imageUrl="https://illustrations.popsy.co/amber/surr-fatal-error.svg" 
    isLottieUrl={false}
    actionLabel="Return to Dashboard"
    onAction={() => window.location.href = '/dashboard'}
    secondaryActionLabel="Request Access"
    onSecondaryAction={() => alert('Access request sent to admin!')}
  />
);

// --- 500 Server Error ---
export const ServerError = ({ errorId }: { errorId?: string }) => (
  <ErrorPage
    code="500"
    title="System Meltdown"
    description="Our servers are having a momentary existential crisis. Our engineering team has been dispatched."
    // Server Maintenance / Robot Repair
    imageUrl="https://illustrations.popsy.co/amber/surr-server-down.svg"
    isLottieUrl={false}
    actionLabel="Try Again"
    onAction={() => window.location.reload()}
    secondaryActionLabel="Contact Support"
    onSecondaryAction={() => window.open('mailto:support@optitalent.com')}
  >
    {errorId && (
        <div className="mt-4 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
            Error ID: {errorId}
        </div>
    )}
  </ErrorPage>
);

// --- 503 Service Unavailable ---
export const MaintenanceError = () => (
  <ErrorPage
    code="503"
    title="Under Maintenance"
    description="We're upgrading the spaceship. We'll be back shortly with a shiny new engine."
    // Construction / Maintenance
    imageUrl="https://illustrations.popsy.co/amber/surr-page-under-construction.svg"
    isLottieUrl={false}
    actionLabel="Check Status"
    onAction={() => window.open('https://status.optitalent.com')}
  />
);

// --- 429 Too Many Requests ---
export const RateLimitError = ({ retryAfter }: { retryAfter?: number }) => (
  <ErrorPage
    code="429"
    title="Whoa, Slow Down!"
    description="You're clicking faster than our servers can think. Take a breather."
    // Speedometer / Hourglass
    imageUrl="https://illustrations.popsy.co/amber/surr-loading.svg"
    isLottieUrl={false}
    actionLabel="Slow Down"
    onAction={() => window.location.reload()}
  >
      {retryAfter && (
          <div className="text-center font-bold text-primary animate-pulse">
              Retry available in {retryAfter} seconds
          </div>
      )}
  </ErrorPage>
);
