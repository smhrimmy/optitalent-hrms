'use client';
import { RateLimitError } from '@/components/errors/error-variants';
export default function Page() { return <RateLimitError retryAfter={60} />; }
