
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { type User, type UserProfile } from '@/lib/mock-data/employees';
import { supabase } from '@/lib/supabase';
import { dataQuery, DEMO_PASSWORD, hydrateDataQuery } from '@/lib/dataquery';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  login: (employeeId: string) => Promise<{ error: { message: string } | null }>;
  loginWithCredentials: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  logout: () => Promise<void>;
  signUp: (data: any) => Promise<{ error: { message: string } | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistSession(user: User) {
  sessionStorage.setItem('authUser', JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    hydrateDataQuery();

    const initializeAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user && mounted) {
                const local = dataQuery.getUserByEmail(session.user.email || '');
                const appUser: User = local || {
                    id: session.user.id,
                    email: session.user.email || '',
                    role: (session.user.user_metadata?.role as UserProfile['role']) || 'employee',
                    profile: {
                        id: `profile-${session.user.id}`,
                        full_name: session.user.user_metadata?.full_name || 'User',
                        department: { name: "General" },
                        department_id: "d-000",
                        job_title: 'Employee',
                        role: (session.user.user_metadata?.role as UserProfile['role']) || 'employee',
                        employee_id: `SUPA-${session.user.id.substring(0, 6)}`,
                        profile_picture_url: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.user_metadata?.full_name || 'User'}&background=random`,
                        phone_number: '',
                        status: 'Active',
                    }
                };
                setUser(appUser);
            } else {
                const storedUser = sessionStorage.getItem('authUser');
                if (storedUser && mounted) {
                    setUser(JSON.parse(storedUser));
                }
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            const storedUser = sessionStorage.getItem('authUser');
            if (storedUser && mounted) {
                setUser(JSON.parse(storedUser));
            }
        } finally {
            if (mounted) setLoading(false);
        }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user && mounted) {
             const local = dataQuery.getUserByEmail(session.user.email || '');
             const appUser: User = local || {
                id: session.user.id,
                email: session.user.email || '',
                role: (session.user.user_metadata?.role as UserProfile['role']) || 'employee',
                profile: {
                    id: `profile-${session.user.id}`,
                    full_name: session.user.user_metadata?.full_name || 'User',
                    department: { name: "General" },
                    department_id: "d-000",
                    job_title: 'Employee',
                    role: (session.user.user_metadata?.role as UserProfile['role']) || 'employee',
                    employee_id: `SUPA-${session.user.id.substring(0, 6)}`,
                    profile_picture_url: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.user_metadata?.full_name || 'User'}&background=random`,
                    phone_number: '',
                    status: 'Active',
                }
            };
            setUser(appUser);
        } else if (mounted) {
             const storedUser = sessionStorage.getItem('authUser');
             if (!storedUser) {
                 setUser(null);
             }
        }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const completeLogin = (userToLogin: User, next?: string) => {
    setUser(userToLogin);
    persistSession(userToLogin);
    router.push(next || `/${userToLogin.role}/dashboard`);
  };

  const login = async (employeeId: string) => {
    setLoading(true);
    const userToLogin = dataQuery.getSnapshot().employees.find(u => u.profile.employee_id === employeeId);

    if (userToLogin) {
      completeLogin(userToLogin);
      setLoading(false);
      return { error: null };
    } else {
      setLoading(false);
      return { error: { message: "Invalid Employee ID." } };
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    const local = dataQuery.getUserByEmail(email);
    if (local && password === DEMO_PASSWORD) {
      completeLogin(local);
      setLoading(false);
      return { error: null };
    }

    if (dataQuery.isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        const { data: { user: su } } = await supabase.auth.getUser();
        const matched = su?.email ? dataQuery.getUserByEmail(su.email) : undefined;
        if (matched) completeLogin(matched);
        else if (su) {
          completeLogin({
            id: su.id,
            email: su.email || email,
            role: (su.user_metadata?.role as UserProfile['role']) || 'employee',
            profile: {
              id: `profile-${su.id}`,
              full_name: su.user_metadata?.full_name || 'User',
              department: { name: 'General' },
              department_id: 'd-000',
              job_title: 'Employee',
              role: (su.user_metadata?.role as UserProfile['role']) || 'employee',
              employee_id: `SUPA-${su.id.substring(0, 6)}`,
              profile_picture_url: `https://ui-avatars.com/api/?name=User&background=random`,
              phone_number: '',
              status: 'Active',
            },
          });
        }
        setLoading(false);
        return { error: null };
      }
      setLoading(false);
      return { error: { message: error.message } };
    }

    setLoading(false);
    return { error: { message: local ? 'Incorrect password. Demo password is password123.' : 'No account found for that email.' } };
  };
  
  const signUp = async (data: any) => {
    setLoading(true);
    const { email, password, firstName, lastName } = data;

    if (dataQuery.getUserByEmail(email)) {
        setLoading(false);
        return { error: { message: "An account with this email already exists." } };
    }

    const created = dataQuery.addEmployee({
      name: `${firstName} ${lastName}`,
      email,
      department: 'Engineering',
      jobTitle: 'New Hire',
      role: 'employee',
    });
    
    completeLogin(created, '/setup');
    setLoading(false);
    void password;
    return { error: null };
  }

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore when supabase is not configured
    }
    setUser(null);
    setSearchTerm('');
    sessionStorage.removeItem('authUser');
    router.push('/login');
    setLoading(false);
  };

  const value = { user, loading, searchTerm, setSearchTerm, login, loginWithCredentials, logout, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
