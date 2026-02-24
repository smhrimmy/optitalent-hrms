
'use client';

import { motion } from "framer-motion";
import { Hammer, Wrench, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background/95 p-4 text-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-lg space-y-6 relative"
      >
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <HardHat className="h-24 w-24 text-yellow-500" />
            </motion.div>
            <motion.div 
                className="absolute -right-4 -top-2"
                animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <Wrench className="h-10 w-10 text-muted-foreground" />
            </motion.div>
             <motion.div 
                className="absolute -left-4 -bottom-2"
                animate={{ y: [0, -5, 0], rotate: [0, -20, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
            >
                <Hammer className="h-10 w-10 text-muted-foreground" />
            </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
            Under Maintenance
          </h1>
          <p className="text-muted-foreground text-lg">
            We are currently upgrading our systems to serve you better.
            Please check back in a few minutes.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg border border-yellow-500/20 text-sm font-mono text-left space-y-2">
             <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-yellow-500">In Progress</span>
             </div>
             <div className="flex justify-between">
                <span>Estimated Completion:</span>
                <span>15 Minutes</span>
             </div>
             <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
                 <motion.div 
                    className="h-full bg-yellow-500"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                 />
             </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" asChild>
             <Link href="mailto:support@optitalent.com">
               Contact Support
             </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
