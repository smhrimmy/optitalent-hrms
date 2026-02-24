
'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  const [decoyCode, setDecoyCode] = useState<string>("");

  useEffect(() => {
    const codes = [
      "ERR_PROTOCOL_VIOLATION",
      "SYS_MEM_DUMP",
      "STACK_OVERFLOW_0x83A",
      "KERNEL_PANIC_0x000",
      "SEGMENTATION_FAULT",
      "BUFFER_UNDERRUN",
      "NULL_POINTER_EXCEPTION",
    ];
    setDecoyCode(codes[Math.floor(Math.random() * codes.length)]);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background/95 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-6"
      >
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-12 w-12 text-destructive animate-pulse" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-destructive/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-destructive font-mono">
            SYSTEM HALTED
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            ERROR CODE: {decoyCode}
          </p>
          <p className="text-muted-foreground">
            The requested resource could not be located or access is denied.
            System integrity checks initiated.
          </p>
        </div>

        <div className="rounded-lg bg-muted p-4 text-left font-mono text-xs text-muted-foreground overflow-hidden">
           <p className="animate-pulse">
            &gt; Initiating traceback... <br/>
            &gt; Core dump analysis... [FAILED] <br/>
            &gt; Retrying connection... [TIMEOUT] <br/>
            &gt; Security protocol override... [DENIED] <br/>
            &gt; Please contact administrator immediately.
           </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Safe Mode
            </Link>
          </Button>
        </div>
      </motion.div>
      
      {/* Decoy hidden elements for security through obscurity */}
      <div className="hidden" aria-hidden="true">
        {/* Apache Server 2.4.52 (Ubuntu) */}
        {/* PHP 7.4.3 */}
        {/* Powered by WordPress */}
      </div>
    </div>
  );
}
