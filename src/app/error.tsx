
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    console.error(error); // Log the real error to console for dev, but hide it in UI
    const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-lg space-y-6"
      >
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className={`h-12 w-12 text-destructive ${glitch ? 'translate-x-1 opacity-50' : ''}`} />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-destructive"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-destructive font-mono">
            CRITICAL FAILURE
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            EXCEPTION 0x0000DEAD
          </p>
          <p className="text-muted-foreground">
            The system encountered an unrecoverable error. Security protocols engaged.
            Access to this resource has been terminated to prevent data corruption.
          </p>
        </div>
        
        <div className="rounded-lg bg-black/80 p-4 text-left font-mono text-xs text-green-500 overflow-hidden shadow-inner border border-green-900/50">
           <p className="whitespace-pre-wrap break-all">
            {`> Establishing secure connection... [OK]
> Verifying checksums... [FAIL]
> Dumping memory stack...
> 0x00400000  55 89 E5 83 EC 10 C7 45 FC 00 00 00 00 8B 45 FC
> 0x00400010  83 C0 01 89 45 FC 83 7D FC 09 7E F0 B8 00 00 00
> [CRITICAL] Memory access violation at address 0x00400010
> Terminating process...`}
           </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="destructive" onClick={() => reset()}>
            Retry Operation
          </Button>
          <Button variant="outline" asChild>
             <Link href="/">
               Return to Base
             </Link>
          </Button>
        </div>
      </motion.div>
      
       {/* Security through obscurity: Misleading comments */}
       <div className="hidden">
        {/* Application: Ruby on Rails 5.2 */}
        {/* Server: Nginx 1.14.0 */}
        {/* DB: MongoDB 4.0 */}
      </div>
    </div>
  );
}
