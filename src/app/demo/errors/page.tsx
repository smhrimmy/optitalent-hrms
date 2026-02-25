
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  NotFoundError, 
  UnauthorizedError, 
  ForbiddenError, 
  ServerError, 
  MaintenanceError, 
  RateLimitError 
} from "@/components/errors/error-variants";
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function ErrorShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const errors = [
    { component: <NotFoundError />, label: "404 Not Found" },
    { component: <UnauthorizedError />, label: "401 Unauthorized" },
    { component: <ForbiddenError />, label: "403 Forbidden" },
    { component: <ServerError errorId="ERR-500-DEMO" />, label: "500 Server Error" },
    { component: <MaintenanceError />, label: "503 Maintenance" },
    { component: <RateLimitError retryAfter={48} />, label: "429 Rate Limit" },
  ];

  const nextError = () => {
    setCurrentIndex((prev) => (prev + 1) % errors.length);
  };

  const prevError = () => {
    setCurrentIndex((prev) => (prev - 1 + errors.length) % errors.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-background/80 backdrop-blur-md p-2 rounded-full border border-border shadow-2xl">
        <Button variant="ghost" size="icon" onClick={prevError} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-bold min-w-[140px] text-center">
          {errors[currentIndex].label}
        </span>
        <Button variant="ghost" size="icon" onClick={nextError} className="rounded-full">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Render Current Error Page */}
      <div className="w-full h-full">
        {errors[currentIndex].component}
      </div>
    </div>
  );
}
