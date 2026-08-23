
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers, type User, type UserProfile } from '@/lib/mock-data/employees';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { postLoginPath } from '@/lib/after-login';

interface Company {
    id: string;
    name: string;
    plan: string;
}

export interface Membership {
    company_id: string;
    status: string;
    company: Company;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  login: (employeeId: string) => Promise<{ error: { message: string } | null }>;
  logout: () => Promise<void>;
  signUp: (data: any) => Promise<{ error: { message: string } | null }>;
  memberships: Membership[];
  activeCompanyId: string | null;
  switchCompany: (companyId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function userFromSession(sessionUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}, roleOverride?: string): User {
  const role = (roleOverride ||
    (sessionUser.user_metadata?.role as string) ||
    'employee') as UserProfile['role'];
  const fullName =
    (sessionUser.user_metadata?.full_name as string) ||
    sessionUser.email?.split('@')[0] ||
    'User';
  return {
    id: sessionUser.id,
    email: sessionUser.email || '',
    role,
    profile: {
      id: `profile-${sessionUser.id}`,
      full_name: fullName,
      department: { name: 'General' },
      department_id: 'd-000',
      job_title: 'Employee',
      role,
      employee_id: `SUPA-${sessionUser.id.substring(0, 6)}`,
      profile_picture_url:
        (sessionUser.user_metadata?.avatar_url as string) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      phone_number: '',
      status: 'Active',
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
        try {
            // Check Supabase session first
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user && mounted) {
                let role = (session.user.user_metadata?.role as string) || undefined;
                try {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('role, full_name')
                        .eq('id', session.user.id)
                        .maybeSingle();
                    
                    const { data: userMemberships } = await supabase
                        .from('company_memberships')
                        .select('company_id, status, role, companies:company_id(id, name, plan)')
                        .eq('user_id', session.user.id);
                    
                    if (userMemberships && userMemberships.length > 0) {
                        const formattedMemberships = userMemberships.map(m => ({
                            company_id: m.company_id,
                            status: m.status,
                            company: Array.isArray(m.companies) ? m.companies[0] : m.companies,
                        })) as Membership[];
                        setMemberships(formattedMemberships);
                        const storedCompanyId = localStorage.getItem('activeCompanyId');
                        if (storedCompanyId && formattedMemberships.some(m => m.company_id === storedCompanyId)) {
                            setActiveCompanyId(storedCompanyId);
                        } else {
                            setActiveCompanyId(formattedMemberships[0].company_id);
                        }
                    }

                    if (userData?.role) role = userData.role;
                    if (userData?.full_name) {
                        session.user.user_metadata = {
                            ...session.user.user_metadata,
                            full_name: userData.full_name,
                            role,
                        };
                    }
                } catch (e) {
                    /* public.users may be empty on a new project */
                    console.error('Membership fetch error:', e);
                }
                setUser(userFromSession(session.user, role));
            } else {
                // Fallback to mock session storage
                const storedUser = sessionStorage.getItem('authUser');
                if (storedUser && mounted) {
                    setUser(JSON.parse(storedUser));
                }
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user && mounted) {
            setUser(userFromSession(session.user));
        } else if (mounted) {
            // Check if mock user is still there (e.g. strict logout from Supabase clears everything)
             const storedUser = sessionStorage.getItem('authUser');
             if (!storedUser) {
                 if (_event === 'SIGNED_OUT') {
                     window.dispatchEvent(new Event('ot-session-expired'));
                 }
                 setUser(null);
             }
        }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const login = async (employeeId: string) => {
    setLoading(true);
    const userToLogin = mockUsers.find(u => u.profile.employee_id === employeeId);

    if (userToLogin) {
      setUser(userToLogin);
      sessionStorage.setItem('authUser', JSON.stringify(userToLogin));
      window.location.href = postLoginPath(`/${userToLogin.role}/dashboard`);
      setLoading(false);
      return { error: null };
    } else {
      setLoading(false);
      return { error: { message: "Invalid Employee ID." } };
    }
  };
  
  const signUp = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setLoading(true);
    const { email, password, firstName, lastName } = data;
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || email.split('@')[0] },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      setLoading(false);
      if (error) return { error: { message: error.message } };
      return { error: null };
    }

    await new Promise((res) => setTimeout(res, 400));
    if (mockUsers.some((u) => u.email === email)) {
      setLoading(false);
      return { error: { message: 'An account with this email already exists.' } };
    }
    
    const newProfile: UserProfile = {
        id: `profile-${Date.now()}`,
        full_name: `${firstName} ${lastName}`,
        department: { name: "Engineering" },
        department_id: "d-001",
        job_title: 'New Hire',
        role: 'employee', // Default role for new signups
        employee_id: `PEP${String(mockUsers.length + 1).padStart(4,'0')}`,
        profile_picture_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        phone_number: '123-456-7890',
        status: 'Active',
    };
    
    const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        role: newProfile.role,
        profile: newProfile
    };
    
    // Add to our mock "database"
    mockUsers.push(newUser);
    
    // Log the user in
    setUser(newUser);
    sessionStorage.setItem('authUser', JSON.stringify(newUser));
    router.push(`/${newUser.role}/dashboard`);
    setLoading(false);
    return { error: null };
  }

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSearchTerm('');
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('ot_mfa_ok');
    router.push('/');
    setLoading(false);
  };

  const switchCompany = (companyId: string) => {
    setActiveCompanyId(companyId);
    localStorage.setItem('activeCompanyId', companyId);
    window.location.reload(); // Hard reload to apply new context globally
  };

  const value = { user, loading, searchTerm, setSearchTerm, login, logout, signUp, memberships, activeCompanyId, switchCompany };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
