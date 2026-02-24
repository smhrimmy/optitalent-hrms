
"use client";

import React from 'react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

import { Layers } from 'lucide-react';

const LogoComponent = ({ className, showText }: LogoProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2 font-headline text-xl font-bold", className)}>
        <div className="relative flex items-center justify-center text-primary">
            <Layers className="w-8 h-8 text-[#8B5CF6] fill-current" />
        </div>
        <span className={cn('hidden text-white', { 'group-hover/sidebar:inline': !showText, 'inline': showText })}>OptiTalent</span>
    </div>
  );
}

export const Logo = React.memo(LogoComponent);
