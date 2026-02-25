'use client';

import React from 'react';
import { ErrorPage } from './ErrorPage';

// --- 404 Not Found ---
export const NotFoundError = () => (
  <ErrorPage
    code="404"
    title="Lost in Space?"
    description="This page seems to have drifted into deep space. Let's navigate you back to civilization."
    imageUrl="https://i.graphicmama.com/uploads/2021/6/60b6133de990e-Cute%20robot%20cartoon%20character%20feeling%20lost%20-%20stock%20vector%20graphic%20image.jpg"
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
    imageUrl="https://i.graphicmama.com/resources/toons/3d-little-boy-cartoon-character/9235/siteBigWatermarkedImages/62-lock%28concepts%29.jpg"
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
    imageUrl="https://png.pngtree.com/png-vector/20260108/ourmid/pngtree-broken-shield-logo-in-cartoon-style-vector-png-image_18457887.webp"
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
    imageUrl="https://png.pngtree.com/png-clipart/20241001/original/pngtree-robot-with-gears-clipart-illustration-png-image_16138398.png"
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
    imageUrl="https://cdn.vectorstock.com/i/1000v/30/24/map-on-vintage-icon-cartoon-style-vector-26223024.jpg"
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
    imageUrl="https://cdn.dribbble.com/userupload/30697565/file/original-6404f8c7b2dbd5df2583f8eab7fcce02.jpg?format=webp&resize=400x300&vertical=center"
    actionLabel="I'm Calm Now"
    onAction={() => window.location.reload()}
  >
      {retryAfter && (
          <div className="text-center font-bold text-primary animate-pulse">
              Retry available in {retryAfter} seconds
          </div>
      )}
  </ErrorPage>
);
