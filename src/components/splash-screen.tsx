'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LoadingLogo } from '@/components/loading-logo';

const KEY = 'optitalent_splash_seen';

export function SplashScreen() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(KEY);
    if (seen) return;
    setVisible(true);
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, '1');
      setVisible(false);
    }, reduce ? 200 : 1400);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeIn' }}
        >
          <LoadingLogo label="Stamping today’s roster…" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
