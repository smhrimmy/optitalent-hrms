
'use client';

import { ServerError } from "@/components/errors/error-variants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerError errorId={error.digest} />;
}
