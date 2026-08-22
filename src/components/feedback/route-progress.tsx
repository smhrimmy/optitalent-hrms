'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const done = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(done);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="ot-route-progress" role="progressbar" aria-hidden>
      <span />
    </div>
  );
}
