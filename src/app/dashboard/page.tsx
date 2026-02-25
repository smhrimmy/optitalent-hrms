
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserPlus, Calendar, Clock, Briefcase, FileText, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TenantDashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
             const { data: userData } = await supabase
                .from('users')
                .select('role, full_name')
                .eq('id', user.id)
                .single();
             setUserRole(userData?.role || 'employee');
             setUserName(userData?.full_name || 'User');
        } else {
            router.push('/login');
        }
    };
    fetchUser();
  }, [router]);

  if (!userRole) return <div className="p-10 text-center">Loading dashboard...</div>;

  // --- HR / ADMIN / SUPER-ADMIN / EXECUTIVE VIEW ---
  // Roles that need high-level oversight
  if (['admin', 'hr', 'super-admin', 'operations-manager', 'process-manager', 'account-manager', 'it-manager'].includes(userRole)) {
      return (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">Company Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userName} ({userRole}). Here's what's happening today.</p>
            </div>
            <div className="flex gap-2">
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
            </div>
          </div>
          
          {/* Executive Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Sick: 1, PTO: 2</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Engineering: 3, Sales: 2</p>
                </CardContent>
            </Card>
          </div>
          {/* Recent Activity & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions in your organization.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">New leave request from John Doe</p>
                                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Things that require your attention.</CardDescription>
              </CardHeader>
              <CardContent>
                   <div className="space-y-4">
                      {[1, 2].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                              <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-orange-600" />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">Review Performance Review for Jane Smith</p>
                                  <p className="text-xs text-muted-foreground">Due Tomorrow</p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-auto">View</Button>
                          </div>
                      ))}
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  // --- RECRUITER VIEW ---
  if (['recruiter'].includes(userRole)) {
       return (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">Recruitment Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userName}. Track your candidates here.</p>
            </div>
            <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Post Job
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">2 Engineering, 3 Sales</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Applicants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">Since last login</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">Next: 10:30 AM</p>
                </CardContent>
            </Card>
          </div>
        </div>
       );
  }

  // --- FINANCE VIEW ---
   if (['finance'].includes(userRole)) {
       return (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">Finance Dashboard</h1>
              <p className="text-muted-foreground">Payroll and Expense Overview.</p>
            </div>
            <Button>
                <FileText className="mr-2 h-4 w-4" />
                Process Payroll
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Pending</div>
                    <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,200</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
          </div>
        </div>
       );
   }

   // --- MARKETING VIEW ---
   if (['marketing'].includes(userRole)) {
       return (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">Marketing Dashboard</h1>
              <p className="text-muted-foreground">Campaigns and Company Feed.</p>
            </div>
            <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Post
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Q3 Hiring Push</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Feed Engagement</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2k</div>
                    <p className="text-xs text-muted-foreground">Views this week</p>
                </CardContent>
            </Card>
          </div>
        </div>
       );
   }


   // --- EMPLOYEE / MANAGER / OTHERS VIEW ---
   // Default fallback for any other role (employee, trainee, team-leader, etc.)
   return (
    <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userName}.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Leave
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12 Days</div>
                    <p className="text-xs text-muted-foreground">Remaining this year</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Holiday</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Dec 25</div>
                    <p className="text-xs text-muted-foreground">Christmas Day</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Team</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Active members</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
