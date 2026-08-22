
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, BarChart3, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">O</span>
            </div>
            <span className="text-xl font-bold font-headline">OptiTalent</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/login?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Workforce OS · not another module pack
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-6">
              The HRMS is generated from the company — not copied from a feature list
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Industry, size, workforce type, and geography decide plants vs stores vs credentials vs projects. Then intelligence explains why and the Chief of Staff executes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/setup">
                  Configure company type <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                <Link href="/login">
                  View Demo
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 rounded-xl border bg-background/50 backdrop-blur-sm shadow-2xl p-2"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="rounded-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-headline mb-4">Intelligence on top of the system of record</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Payroll, leave, and ATS stay table stakes. Differentiation is predict → explain → recommend → execute.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Workforce digital twin"
              description="Org tree plus per-person skills, load, engagement, and compensation position — a live model, not a static org chart."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Why engine + risk"
              description="Every metric has contributors and an intervention. Attrition attention is decision support, not a verdict."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="What-if simulator"
              description="Hire 20 developers and see cost, manager span, induction desks, and bottlenecks before the req."
            />
            <FeatureCard 
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Talent & opportunity market"
              description="Skill gaps, internal matches, projects, and mentors — mobility before another external hire."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Chief of Staff agents"
              description="Onboarding packs, approvals, and recipes actually write to the graph — greytHR NAVOS direction, on one record."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="India compliance IQ"
              description="PF, ESI, PT, TDS, LWF, gratuity, and working-hours health — not only a payslip line."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">O</span>
            </div>
            <span className="font-bold">OptiTalent</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 OptiTalent. Workforce operating system.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link>
            <Link href="mailto:support@optitalent.com" className="text-muted-foreground hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-md bg-background hover:shadow-xl transition-all duration-300">
      <CardContent className="pt-6">
        <div className="mb-4 p-3 bg-muted rounded-md inline-block">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
