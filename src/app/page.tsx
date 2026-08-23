
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/90 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline font-semibold">OptiTalent</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <Link href="#records" className="hover:text-foreground">Records</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="#about" className="hover:text-foreground">About</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
            <Button asChild><Link href="/login">Open demo</Link></Button>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Personnel file</p>
          <h1 className="text-4xl md:text-5xl font-headline font-semibold tracking-tight mb-5">
            One folder per person: clock, leave, pay, hire.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            OptiTalent is the desk copy of HR. Sign in, open the people list, clock attendance, approve leave, run payroll, and track applicants — company by company.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild>
              <Link href="/login">Sign in with work email</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Try demo (password123)</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="records" className="py-16 border-t">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-2xl font-headline">What is in the file</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li><strong className="text-foreground">People.</strong> Names, roles, and status for the company.</li>
            <li><strong className="text-foreground">Time.</strong> Clock in/out and leave balances.</li>
            <li><strong className="text-foreground">Pay.</strong> Payroll runs and expense rows.</li>
            <li><strong className="text-foreground">Hire.</strong> Applicants, walk-in drives, resume parse.</li>
            <li><strong className="text-foreground">Tickets.</strong> IT and HR helpdesk threads.</li>
          </ul>
        </div>
      </section>

      <section id="pricing" className="py-16 border-t">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-headline mb-3">Pricing</h2>
          <p className="text-muted-foreground">Demo accounts are free. Production companys are billed per company once you provision one — mail support@optitalent.com.</p>
        </div>
      </section>

      <section id="about" className="py-16 border-t">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-headline mb-3">About</h2>
          <p className="text-muted-foreground">OptiTalent is an HR workspace on Next.js and Supabase. Data stays in your project. Demo logins: admin@, hr@, manager@, employee@optitalent.com with password123.</p>
        </div>
      </section>

      <footer className="py-10 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <span>© 2026 OptiTalent</span>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
            <Link href="/accessibility" className="hover:text-foreground">Accessibility</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/help" className="hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
