'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';

const KEY = 'optitalent_tour_done';

export function OnboardingTour() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'This is your people file', body: 'Headcount, pending leave, and open jobs come from the same record as payroll — not a second spreadsheet.' },
    { title: 'Approvals sit in Inbox', body: 'Leave, expenses, timesheets, and offers wait in one queue so managers are not hunting email.' },
    { title: 'Jump with ⌘K', body: 'Search people and modules without walking the sidebar. Skip this tour anytime.' },
  ];

  useEffect(() => {
    if (!user) return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, [user]);

  const finish = () => {
    localStorage.setItem(KEY, '1');
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) finish(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{steps[step].title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{steps[step].body}</p>
        <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={finish}>Skip</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
          ) : (
            <Button onClick={finish}>Open dashboard</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
