
"use client"

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Bot, Search, Filter, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { ConfigureWalkInDialog } from "@/components/recruitment/configure-walkin-dialog";

type Applicant = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  appliedDate: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
};

const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
        case 'Interview':
            return <Badge variant="default">Interview</Badge>;
        case 'Offer':
            return <Badge className="bg-blue-500 text-white">Offer</Badge>;
        case 'Hired':
            return <Badge className="bg-green-500 text-white">Hired</Badge>;
        case 'Screening':
            return <Badge variant="secondary">Screening</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}


export default function RecruitmentPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const role = params.role || 'admin';

  useEffect(() => {
    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: userData } = await supabase
                .from('users')
                .select('tenant_id')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('applicants')
                .select('id, full_name, status, created_at, resume_data')
                .eq('tenant_id', userData.tenant_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedApplicants: Applicant[] = data.map((app: any) => ({
                    id: app.id,
                    name: app.full_name,
                    avatar: app.resume_data?.profile_picture_url || `https://ui-avatars.com/api/?name=${app.full_name}&background=random`,
                    role: app.resume_data?.workExperience?.[0]?.title || 'General Application',
                    appliedDate: new Date(app.created_at).toLocaleDateString(),
                    status: app.status
                }));
                setApplicants(mappedApplicants);
            }
        } catch (error: any) {
            console.error("Error fetching applicants:", error);
            toast({ title: "Error", description: "Failed to load applicants.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    fetchApplicants();
  }, [toast]);

  const handleCopyWalkinLink = () => {
    const walkinUrl = `${window.location.origin}/walkin-drive`;
    navigator.clipboard.writeText(walkinUrl);
    toast({
      title: "Link Copied!",
      description: "The walk-in registration link has been copied to your clipboard.",
    });
  };

  const filteredApplicants = React.useMemo(() => {
    return applicants.filter(applicant =>
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, applicants]);

  return (
     <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Recruitment</h1>
            <p className="text-muted-foreground">Manage your hiring pipeline and walk-in drives.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>All Applicants</CardTitle>
                <CardDescription>Track and manage all candidates in your hiring pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
                    <div className="relative flex-1 md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            className="w-full pl-10" 
                            placeholder="Search by name or role..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" onClick={() => toast({ title: 'Filter Clicked', description: 'This would normally open a filter dialog.' })}>
                            <Filter className="mr-2 h-4 w-4" />
                            <span>Filter by job</span>
                        </Button>
                        <Link href={`/${role}/recruitment/parse`}>
                            <Button variant="outline">
                                <Bot className="mr-2 h-4 w-4" /> Parse Resume
                            </Button>
                        </Link>
                        <ConfigureWalkInDialog />
                         <Button onClick={handleCopyWalkinLink}>
                            <Link2 className="mr-2 h-4 w-4" /> Copy Walk-in Link
                        </Button>
                    </div>
                </div>

                <div className="mt-4 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : applicants.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No applicants found.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Applied For</TableHead>
                                            <TableHead>Applied Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredApplicants.map((applicant) => (
                                            <TableRow key={applicant.id} className="cursor-pointer" onClick={() => router.push(`/${role}/recruitment/${applicant.id}`)}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={applicant.avatar} alt="Avatar" data-ai-hint="person avatar" />
                                                            <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        {applicant.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{applicant.role}</TableCell>
                                                <TableCell>{applicant.appliedDate}</TableCell>
                                                <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">View Profile</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
