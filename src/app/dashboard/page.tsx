
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserPlus, Calendar, Clock, Briefcase, FileText, Shield, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function TenantDashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [tenantId, setTenantId] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>(''); // public.employees ID
  const router = useRouter();

  // Attendance State
  const [attendance, setAttendance] = useState<any>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Leave Request State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Sick Leave', start_date: '', end_date: '', reason: '' });

  // Dashboard Metrics State
  const [stats, setStats] = useState({
      totalEmployees: 0,
      onLeave: 0,
      openPositions: 0,
      activeJobs: 0,
      newApplicants: 0,
      interviewsToday: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [companyNews, setCompanyNews] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
             setUserId(user.id);
             const { data: userData } = await supabase
                .from('users')
                .select('role, full_name, tenant_id, employees(id)')
                .eq('id', user.id)
                .single();
             
             if (userData) {
                 setUserRole(userData.role || 'employee');
                 setUserName(userData.full_name || 'User');
                 setTenantId(userData.tenant_id);
                 if (userData.employees && userData.employees[0]) {
                     setEmployeeId(userData.employees[0].id);
                     fetchEmployeeSpecifics(userData.tenant_id, userData.employees[0].id);
                 }
                 
                 fetchAttendance(user.id);
                 fetchDashboardStats(userData.tenant_id, userData.role);
             }
        } else {
            router.push('/login');
        }
    };
    fetchUser();
  }, [router]);

  const fetchDashboardStats = async (tid: string, role: string) => {
      if (!tid) return;

      // Parallel fetching for performance ("snap of a finger")
      const promises = [];

      // 1. General Stats (for Admin/HR)
      if (['admin', 'hr', 'super-admin'].includes(role)) {
          promises.push(supabase.from('employees').select('*', { count: 'exact', head: true }).eq('tenant_id', tid).eq('status', 'Active').then(res => ({ key: 'totalEmployees', val: res.count || 0 })));
          
          const today = new Date().toISOString().split('T')[0];
          promises.push(supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('tenant_id', tid).eq('status', 'Approved').lte('start_date', today).gte('end_date', today).then(res => ({ key: 'onLeave', val: res.count || 0 })));
          
          promises.push(supabase.from('job_openings').select('*', { count: 'exact', head: true }).eq('tenant_id', tid).eq('status', 'Open').then(res => ({ key: 'openPositions', val: res.count || 0 })));
      }

      // 2. Recruitment Stats (for Recruiter)
      if (role === 'recruiter') {
           promises.push(supabase.from('job_openings').select('*', { count: 'exact', head: true }).eq('tenant_id', tid).eq('status', 'Open').then(res => ({ key: 'activeJobs', val: res.count || 0 })));
           promises.push(supabase.from('applicants').select('*', { count: 'exact', head: true }).eq('tenant_id', tid).eq('status', 'Applied').then(res => ({ key: 'newApplicants', val: res.count || 0 })));
           // Mock interview count for now or check calendar/notes
           promises.push(Promise.resolve({ key: 'interviewsToday', val: 0 })); 
      }

      // 3. Company Feed (Everyone)
      promises.push(
          supabase.from('company_feed_posts')
            .select('id, title, content, created_at, employees(users(full_name))')
            .eq('tenant_id', tid)
            .order('created_at', { ascending: false })
            .limit(2)
            .then(res => ({ key: 'companyNews', val: res.data || [] }))
      );

      // Execute all
      const results = await Promise.all(promises);
      
      const newStats = { ...stats };
      results.forEach((res: any) => {
          if (res.key === 'companyNews') {
              setCompanyNews(res.val);
          } else {
              // @ts-ignore
              newStats[res.key] = res.val;
          }
      });
      setStats(newStats);
  };

  const fetchEmployeeSpecifics = async (tid: string, eid: string) => {
      // Fetch Leave Balance
      const { data: balance } = await supabase.from('leave_balances').select('paid_time_off, sick_leave, casual_leave').eq('employee_id', eid).single();
      if (balance) {
          // Aggregate total remaining
          setLeaveBalance((balance.paid_time_off || 0) + (balance.sick_leave || 0) + (balance.casual_leave || 0));
      }
  };

  const fetchAttendance = async (uid: string) => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
          .from('attendance')
          .select('*')
          .eq('user_id', uid)
          .eq('date', today)
          .single();
      setAttendance(data);
  };

  const handleClockIn = async () => {
      if (!userId || !tenantId) return;
      setLoadingAttendance(true);
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      const { data, error } = await supabase.from('attendance').insert({
          user_id: userId,
          tenant_id: tenantId,
          date: today,
          clock_in: now,
          status: 'Present'
      }).select().single();

      if (error) {
          toast.error("Failed to clock in: " + error.message);
      } else {
          toast.success("Clocked in successfully!");
          setAttendance(data);
      }
      setLoadingAttendance(false);
  };

  const handleClockOut = async () => {
      if (!attendance) return;
      setLoadingAttendance(true);
      const now = new Date().toISOString();
      
      const { data, error } = await supabase.from('attendance').update({
          clock_out: now
      }).eq('id', attendance.id).select().single();

      if (error) {
          toast.error("Failed to clock out");
      } else {
          toast.success("Clocked out successfully!");
          setAttendance(data);
      }
      setLoadingAttendance(false);
  };

  const handleRequestLeave = async () => {
      if (!employeeId || !tenantId) {
          toast.error("Employee profile not found");
          return;
      }
      
      const { error } = await supabase.from('leave_requests').insert({
          tenant_id: tenantId,
          employee_id: employeeId,
          leave_type: leaveForm.type,
          start_date: leaveForm.start_date,
          end_date: leaveForm.end_date,
          reason: leaveForm.reason,
          status: 'Pending'
      });

      if (error) {
          toast.error(error.message);
      } else {
          toast.success("Leave request submitted!");
          setIsLeaveModalOpen(false);
          setLeaveForm({ type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
      }
  };

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
                    <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                    <p className="text-xs text-muted-foreground">Active Employees</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.onLeave}</div>
                    <p className="text-xs text-muted-foreground">Employees Absent</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.openPositions}</div>
                    <p className="text-xs text-muted-foreground">Hiring Now</p>
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
            <Button onClick={() => toast.info("Job Posting feature coming soon!")}>
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
                    <div className="text-2xl font-bold">{stats.activeJobs}</div>
                    <p className="text-xs text-muted-foreground">Active Roles</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Applicants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newApplicants}</div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.interviewsToday}</div>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
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
            <Button onClick={() => toast.info("Payroll processing coming soon!")}>
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
            <Button onClick={() => toast.info("New Post creation coming soon!")}>
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
                <Button variant="outline" onClick={() => router.push('/dashboard/profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    My Profile
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {/* Clock In/Out Widget */}
             <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Attendance
                    </CardTitle>
                    <CardDescription>Track your work hours</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Log In Time</p>
                            <p className="text-xl font-bold text-slate-700">
                                {attendance?.clock_in ? new Date(attendance.clock_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </p>
                        </div>
                         <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Log Out Time</p>
                            <p className="text-xl font-bold text-slate-400">
                                {attendance?.clock_out ? new Date(attendance.clock_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </p>
                        </div>
                    </div>
                    
                    {!attendance ? (
                        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 shadow-md" onClick={handleClockIn} disabled={loadingAttendance}>
                            {loadingAttendance ? 'Clocking In...' : 'Clock In'}
                        </Button>
                    ) : attendance.clock_out ? (
                        <Button className="w-full mt-6 bg-slate-400 cursor-not-allowed" disabled>
                            Clocked Out
                        </Button>
                    ) : (
                        <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 shadow-md" onClick={handleClockOut} disabled={loadingAttendance}>
                            {loadingAttendance ? 'Clocking Out...' : 'Clock Out'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-800">12</div>
                    <p className="text-xs text-muted-foreground">Days Remaining</p>
                    
                    <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-xs mt-2 text-blue-600">Apply Leave &rarr;</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Leave</DialogTitle>
                                <DialogDescription>Submit a leave request for approval.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Leave Type</Label>
                                    <Select onValueChange={(val) => setLeaveForm({...leaveForm, type: val})} defaultValue={leaveForm.type}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                            <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                            <SelectItem value="Paid Time Off">Paid Time Off</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input type="date" value={leaveForm.start_date} onChange={e => setLeaveForm({...leaveForm, start_date: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input type="date" value={leaveForm.end_date} onChange={e => setLeaveForm({...leaveForm, end_date: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason</Label>
                                    <Input value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} placeholder="Why do you need leave?" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleRequestLeave}>Submit Request</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Food Coupons</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-800">2400</div>
                    <p className="text-xs text-muted-foreground">Points Available</p>
                    <Button variant="link" onClick={() => toast.info("Coupon redemption coming soon!")} className="p-0 h-auto text-xs mt-2 text-blue-600">Redeem &rarr;</Button>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Feed / News */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Company News</CardTitle>
                    <CardDescription>Latest updates from HR and Management.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                         <div className="flex gap-4 items-start">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-slate-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">Q3 All Hands Meeting</h4>
                                <p className="text-sm text-slate-600 mt-1">Join us this Friday for the quarterly all-hands meeting. We will be discussing...</p>
                                <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
                            </div>
                         </div>
                         <div className="flex gap-4 items-start">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                <Users className="h-6 w-6 text-slate-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">Welcome New Joiners!</h4>
                                <p className="text-sm text-slate-600 mt-1">Please welcome Sarah and Mike to the Engineering team. Say hi when you see them!</p>
                                <p className="text-xs text-slate-400 mt-2">Yesterday</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* Birthdays & Events */}
            <Card>
                 <CardHeader>
                    <CardTitle>Celebrations</CardTitle>
                    <CardDescription>Birthdays & Work Anniversaries</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                <span className="text-xs font-bold">JD</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Jane Doe</p>
                                <p className="text-xs text-muted-foreground">Birthday - Today! 🎂</p>
                            </div>
                         </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <span className="text-xs font-bold">MS</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Mike Smith</p>
                                <p className="text-xs text-muted-foreground">5 Year Anniversary - Tomorrow 🎉</p>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
