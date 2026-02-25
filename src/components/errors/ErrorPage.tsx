
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export interface ErrorPageProps {
  code: string | number;
  title: string;
  description: string;
  animationData?: any; // JSON for Lottie
  imageUrl?: string; // Fallback image
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode; // For custom content like login forms or debug info
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  title,
  description,
  animationData,
  imageUrl,
  actionLabel = "Go Home",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  children
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground overflow-hidden relative", className)}>
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-3xl flex flex-col md:flex-row items-center gap-12">
        
        {/* Visual Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          {animationData ? (
            <div className="w-full max-w-[400px]">
              <Lottie animationData={animationData} loop={true} />
            </div>
          ) : imageUrl ? (
            <div className="relative w-full max-w-[400px] aspect-square">
                {/* Use standard img for now to avoid next/image config issues with external URLs in this generic component */}
                <img src={imageUrl} alt={title} className="object-contain w-full h-full drop-shadow-2xl" />
            </div>
          ) : (
             <div className="text-[150px] font-black text-muted/20 select-none">
                {code}
             </div>
          )}
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2 text-center md:text-left space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-primary">{code}</h1>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Custom Content Slot (e.g., Login Form, Tech Details) */}
          {children && (
            <div className="p-4 bg-card rounded-lg border border-border shadow-sm text-left">
                {children}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Button 
                size="lg" 
                onClick={onAction || (() => window.location.href = '/')}
                className="font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {actionLabel}
            </Button>
            
            {secondaryActionLabel && (
                <Button 
                    variant="outline" 
                    size="lg"
                    onClick={onSecondaryAction}
                    className="font-semibold transition-all hover:scale-105 active:scale-95"
                >
                    {secondaryActionLabel}
                </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
