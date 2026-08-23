'use client';

import { useParams } from 'next/navigation';
import type { FC } from 'react';
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ServerError,
  MaintenanceError,
  RateLimitError,
  BadRequestError,
  BadGatewayError,
  GatewayTimeoutError,
} from '@/components/errors/error-variants';

const MAP: Record<string, FC> = {
  '400': BadRequestError,
  '401': UnauthorizedError,
  '403': ForbiddenError,
  '404': NotFoundError,
  '429': RateLimitError,
  '500': ServerError,
  '502': BadGatewayError,
  '503': MaintenanceError,
  '504': GatewayTimeoutError,
};

export default function ErrorCodePage() {
  const params = useParams();
  const code = String(params.code || '404');
  const Comp = MAP[code] || NotFoundError;
  return <Comp />;
}
