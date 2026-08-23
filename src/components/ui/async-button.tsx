
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AsyncButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  retryAfter?: number | null; // Timestamp in ms when retry is allowed
}

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ isLoading, loadingText, retryAfter, children, className, disabled, ...props }, ref) => {
    const [timeLeft, setTimeLeft] = React.useState<number>(0);

    React.useEffect(() => {
      if (!retryAfter) {
        setTimeLeft(0);
        return;
      }

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.ceil((retryAfter - now) / 1000);
        if (diff <= 0) {
          setTimeLeft(0);
        } else {
          setTimeLeft(diff);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }, [retryAfter]);

    const isCooldown = timeLeft > 0;
    const isDisabled = disabled || isLoading || isCooldown;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn("relative transition-all", className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || "Please wait..."}
          </>
        ) : isCooldown ? (
          `Retry in ${timeLeft}s`
        ) : (
          children
        )}
      </Button>
    );
  }
);
AsyncButton.displayName = "AsyncButton";
