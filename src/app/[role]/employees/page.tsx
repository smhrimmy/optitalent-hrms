
'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Loader2, Search, LayoutGrid, List } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { mockUsers, type UserProfile, type User } from '@/lib/mock-data/employees';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';

const AddEmployeeButton = dynamic(() => import('@/components/employees/add-employee-button'), {
    loading: () => <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Add Employee</Button>,
    ssr: false
});

export default function EmployeesPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useAuth();
  const role = params.role as string;
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");

  useEffect(() => {
    setEmployees(mockUsers.map(u => u.profile));
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(e => 
        e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const handleAddEmployee = (newEmployee: User) => {
    setEmployees(prev => [newEmployee.profile, ...prev].sort((a,b) => a.full_name.localeCompare(b.full_name)));
  }
  
  const handleAction = (action: string) => {
      toast({
          title: "Action Triggered",
          description: `This is a mock action for "${action}".`,
      });
  };

  const isTeamView = role === 'manager' || role === 'team-leader';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{isTeamView ? "My Team" : "Employee Directory"}</h1>
          <p className="text-muted-foreground">
            {employees.length} employees across all departments
          </p>
        </div>
        {!isTeamView && <AddEmployeeButton onEmployeeAdded={handleAddEmployee} />}
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
               className="pl-10" 
               placeholder="Search employees..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
            <Button 
                variant={view === "table" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("table")}
                className="h-8 px-2 lg:px-3"
            >
                <List className="h-4 w-4 mr-2" /> <span className="hidden lg:inline">Table</span>
            </Button>
            <Button 
                variant={view === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("grid")}
                className="h-8 px-2 lg:px-3"
            >
                <LayoutGrid className="h-4 w-4 mr-2" /> <span className="hidden lg:inline">Grid</span>
            </Button>
        </div>
      </div>

      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        {view === "table" ? (
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Employee</TableHead>
                                <TableHead className="hidden md:table-cell">Department</TableHead>
                                <TableHead className="hidden md:table-cell">Location</TableHead>
                                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.employee_id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/${role}/employees/${employee.employee_id}`)}>
                                    <TableCell className="pl-6 font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarImage src={employee.profile_picture_url || ''} alt={employee.full_name} />
                                                <AvatarFallback>{employee.full_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <p className="font-medium text-sm leading-none">{employee.full_name}</p>
                                                <p className="text-xs text-muted-foreground">{employee.job_title}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm">{employee.department.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-sm">New York, USA</TableCell>
                                    <TableCell className="hidden lg:table-cell text-sm">Jan 12, 2024</TableCell>
                                    <TableCell>
                                        <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'} className={employee.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none' : ''}>
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleAction('Edit')}}>Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={(e) => {e.stopPropagation(); handleAction('Deactivate')}}>Deactivate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee) => (
                    <Card key={employee.employee_id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/${role}/employees/${employee.employee_id}`)}>
                        <CardHeader className="p-0">
                            <div className={`h-24 w-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80`}></div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6 px-6 relative">
                            <Avatar className="h-20 w-20 border-4 border-background absolute -top-10 left-1/2 -translate-x-1/2">
                                <AvatarImage src={employee.profile_picture_url || ''} />
                                <AvatarFallback className="text-lg">{employee.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="mt-12 text-center space-y-1">
                                <h3 className="font-semibold text-lg">{employee.full_name}</h3>
                                <p className="text-sm text-muted-foreground">{employee.job_title}</p>
                                <Badge variant="secondary" className="mt-2">{employee.status}</Badge>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-center border-t pt-4">
                                <div>
                                    <p className="text-muted-foreground">Department</p>
                                    <p className="font-medium mt-0.5">{employee.department.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="font-medium mt-0.5">Remote</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </Suspense>
    </div>
  )
}
