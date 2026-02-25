
"use client"

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { detectPayrollErrorsAction } from './actions';
import type { DetectPayrollErrorsOutput } from '@/ai/flows/detect-payroll-errors';
import { Bot, AlertTriangle, Download, FileText, Loader2, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const examplePayrollData = {
  "employees": [
    { "id": 1, "name": "Alice", "salary": 5000, "bonus": 500, "hours_worked": 160 },
    { "id": 2, "name": "Bob", "salary": 12000, "bonus": 1000, "hours_worked": 160 },
    { "id": 3, "name": "Charlie", "salary": 5500, "bonus": 0, "hours_worked": 150 },
    { "id": 4, "name": "Diana", "salary": -100, "bonus": 200, "hours_worked": 160 }
  ]
};

const payslipHistory = [
    { period: 'July 2024', date: '2024-07-31', amount: '$4,200', status: 'Paid' },
    { period: 'June 2024', date: '2024-06-30', amount: '$4,200', status: 'Paid' },
    { period: 'May 2024', date: '2024-05-31', amount: '$4,150', status: 'Paid' },
];

const payrollSummary = [
  { label: "Net Pay", value: "$3,450", icon: DollarSign, color: "text-green-500" },
  { label: "Gross Pay", value: "$4,200", icon: TrendingUp, color: "text-blue-500" },
  { label: "Deductions", value: "$750", icon: CreditCard, color: "text-red-500" },
];

const trendData = [
  { month: 'Jan', amount: 3800 },
  { month: 'Feb', amount: 3900 },
  { month: 'Mar', amount: 4100 },
  { month: 'Apr', amount: 4100 },
  { month: 'May', amount: 4150 },
  { month: 'Jun', amount: 4200 },
];

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

type Payslip = {
    id: string;
    period: string;
    date: string;
    amount: string;
    status: string;
};

export default function PayrollPage() {
  const [result, setResult] = useState<DetectPayrollErrorsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [payrollData, setPayrollData] = useState(JSON.stringify(examplePayrollData, null, 2));
  const { toast } = useToast();
  const params = useParams();
  const role = params.role as string;
  
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [summary, setSummary] = useState({ net: 0, gross: 0, deductions: 0 });

  const isAdminOrFinance = role === 'admin' || role === 'finance' || role === 'super-admin';

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
      try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: userData } = await supabase
              .from('users')
              .select('tenant_id, employees(id)')
              .eq('id', user.id)
              .single();
          
          if (!userData?.tenant_id) return;

          let query = supabase
              .from('payroll_history')
              .select('*')
              .eq('tenant_id', userData.tenant_id)
              .order('pay_period', { ascending: false });

          if (!isAdminOrFinance) {
              if (userData.employees?.[0]?.id) {
                  query = query.eq('employee_id', userData.employees[0].id);
              } else {
                  // If no employee record, they shouldn't see payroll
                  return; 
              }
          }

          const { data, error } = await query;
          if (error) throw error;

          if (data) {
              const mappedPayslips = data.map((p: any) => ({
                  id: p.id,
                  period: new Date(p.pay_period).toLocaleString('default', { month: 'long', year: 'numeric' }),
                  date: p.pay_period,
                  amount: `$${p.net_salary}`,
                  status: p.status || 'Paid'
              }));
              setPayslips(mappedPayslips);

              // Calculate summary (most recent payslip or aggregate)
              // For summary cards, let's show the LATEST payslip details for the employee
              if (data.length > 0) {
                  const latest = data[0];
                  setSummary({
                      net: latest.net_salary,
                      gross: latest.gross_salary,
                      deductions: latest.deductions
                  });
              }
          }

      } catch (error) {
          console.error("Error fetching payroll:", error);
      }
  };

  const handleDetectErrors = async () => {
    setLoading(true);
    setResult(null);
    try {
      JSON.parse(payrollData); // Validate JSON
    } catch (error) {
      toast({ title: "Invalid JSON", description: "The payroll data is not valid JSON.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const response = await detectPayrollErrorsAction({ payrollData });
      setResult(response);
      toast({ title: "Analysis Complete", description: `Found ${response.errors.length} potential errors.` });
    } catch (e) {
      console.error(e);
      toast({ title: "Analysis Failed", description: "There was an error analyzing the payroll data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-black">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const handleDownloadPayslip = (period: string) => {
    toast({
        title: "Downloading Payslip",
        description: `Your payslip for ${period} is being downloaded.`
    })
  }

  // Dynamic Summary based on latest payslip
  const dynamicSummary = [
      { label: "Net Pay", value: `$${summary.net}`, icon: DollarSign, color: "text-green-500" },
      { label: "Gross Pay", value: `$${summary.gross}`, icon: TrendingUp, color: "text-blue-500" },
      { label: "Deductions", value: `$${summary.deductions}`, icon: CreditCard, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Payroll</h1>
            <p className="text-muted-foreground">{isAdminOrFinance ? "Process salaries and manage compensations." : "View and download your payslips."}</p>
        </div>
        {!isAdminOrFinance && <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Download Tax Report</Button>}
      </div>
      
      {!isAdminOrFinance && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dynamicSummary.map((item) => (
                    <Card key={item.label}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                            </div>
                            <div className={`p-3 rounded-full bg-muted/50 ${item.color}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Income Trend</CardTitle>
                    <CardDescription>Your gross income over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value) => [`$${value}`, 'Amount']}
                            />
                            <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
      )}

      {isAdminOrFinance ? (
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
                <Bot /> AI Payroll Error Detection
            </CardTitle>
            <CardDescription>
                Paste your payroll data (in JSON format) to detect discrepancies before processing.
            </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <Textarea
                placeholder="Paste payroll JSON here..."
                className="min-h-[400px] font-mono text-xs"
                value={payrollData}
                onChange={(e) => setPayrollData(e.target.value)}
                />
                <Button onClick={handleDetectErrors} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Analyzing...' : 'Detect Errors with AI'}
                </Button>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold">Analysis Result</h3>
                {loading && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-4">Analyzing payroll data...</p></div>}
                {result ? (
                <div className="space-y-4 flex-grow overflow-y-auto">
                    <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </CardContent>
                    </Card>
                    <div className="space-y-2">
                    {result.errors.length > 0 ? result.errors.map((error, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-md border p-3">
                        <AlertTriangle className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{error.field}</p>
                            {getSeverityBadge(error.severity)}
                            </div>
                            <p className="text-sm text-muted-foreground">{error.description}</p>
                        </div>
                        </div>
                    )) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>No errors detected in the provided data.</p>
                        </div>
                    )}
                    </div>
                </div>
                ) : (
                !loading && <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Results will be displayed here.</p>
                </div>
                )}
            </div>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Payslip History</CardTitle>
                <CardDescription>Download your salary slips for each pay period.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><FileText className='inline-block mr-2 h-4 w-4' />Pay Period</TableHead>
                            <TableHead>Generated On</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payslips.map(slip => (
                            <TableRow key={slip.id}>
                                <TableCell className="font-medium">{slip.period}</TableCell>
                                <TableCell>{slip.date}</TableCell>
                                <TableCell>{slip.amount}</TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{slip.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadPayslip(slip.period)}>
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
