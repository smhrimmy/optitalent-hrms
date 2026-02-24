
'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Users, BarChart3, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  // State variables for form inputs
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const router = useRouter();
  const { login: demoLogin } = useAuth(); // Helper for demo accounts

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    setIsLoading(true);

    try {
      if (isSignUp) {
        // 1. SIGN UP FLOW
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
        
      } else {
        // 2. LOGIN FLOW
        
        // Check for Demo Accounts (For testing purposes only)
        // In a real app, you would remove this block.
        if (email.endsWith('@optitalent.com')) {
           // Extract role from email (e.g. 'admin' from 'admin@optitalent.com')
           const role = email.split('@')[0];
           const demoIds: Record<string, string> = {
               'admin': 'PEP0001',
               'hr': 'PEP0002',
               'manager': 'PEP0003',
               'employee': 'PEP0012'
           };
           
           if (demoIds[role]) {
               await demoLogin(demoIds[role]);
               // The hook handles the redirect
               return; 
           }
        }

        // Standard Supabase Login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        // Reset attempts on success
        setLoginAttempts(0);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login Error Details:", error);
      
      let errorMessage = "Authentication failed";
      
      if (error?.message) {
        // Handle common network/DNS errors
        if (error.message.includes("Failed to fetch") || error.message.includes("Network request failed")) {
             errorMessage = "Connection failed. Please check your internet connection or DNS settings.";
        } else if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
             errorMessage = "Server unreachable (DNS Error). Please check if the Supabase project URL is correct.";
        } else if (error.message.includes("Invalid login credentials")) {
             setLoginAttempts(prev => prev + 1);
             errorMessage = "Incorrect email or password.";
             
             if (loginAttempts >= 2) {
                 errorMessage = "Incorrect password. Click 'Forgot Password?' to reset it.";
             }
        } else {
             errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      toast.error("Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL: Branding & Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0">
          <Image
            src="/login-illustration.jpg"
            alt="HR Management"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Layers className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">OptiTalent</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold leading-tight">
                Empowering Your
                <br />
                Workforce, Simplified.
              </h2>
              <p className="text-white/80 mt-4 text-lg max-w-md">
                The complete HR platform for modern teams. Manage people, payroll, and performance — all in one place.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: "500+", desc: "Companies" },
                { icon: Shield, label: "99.9%", desc: "Uptime" },
                { icon: BarChart3, label: "50K+", desc: "Employees" },
              ].map((stat) => (
                <div key={stat.desc} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon className="w-5 h-5 mb-2 text-white/80" />
                  <p className="text-2xl font-bold">{stat.label}</p>
                  <p className="text-xs text-white/70">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">
            © 2026 OptiTalent. All rights reserved. · Privacy Policy
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <h1 className="text-xl font-bold">OptiTalent</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome!</h1>
            <p className="text-muted-foreground mt-1">
              {isSignUp ? "Create your account to get started" : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                {!isSignUp && (
                  <button type="button" className="text-xs text-primary hover:underline font-medium">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-wide"
            >
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Log In"}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Login Button */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? "Redirecting..." : "Login with Google"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-semibold"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Protected by enterprise-grade security · AES-256 encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
