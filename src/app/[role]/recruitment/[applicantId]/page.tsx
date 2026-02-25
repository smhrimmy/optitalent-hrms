
'use client';

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, FileText, Send, User, MessageSquare, Award, Calendar, Check, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState, memo, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StandardAssessmentsTab } from "@/components/standard-assessments-tab";
import { supabase } from "@/lib/supabase";

type Note = {
    id: string;
    interviewer: string;
    role: string;
    note: string;
    timestamp: string;
};

const NoteCard = memo(function NoteCard({ note }: { note: Note }) {
    return (
        <div className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
                <AvatarFallback>{note.interviewer.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{note.interviewer} <span className="text-xs text-muted-foreground font-normal">({note.role})</span></p>
                    <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{note.note}</p>
            </div>
        </div>
    )
});


export default function ApplicantProfilePage() {
    const params = useParams();
    const applicantId = params.applicantId as string;
    const [applicant, setApplicant] = useState<any>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get current user and employee ID
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                     const { data: userData } = await supabase
                        .from('users')
                        .select('role, full_name, tenant_id, employees(id)')
                        .eq('id', user.id)
                        .single();
                     
                     if (userData) {
                         setTenantId(userData.tenant_id);
                         if (userData.employees && userData.employees[0]) {
                             setEmployeeId(userData.employees[0].id);
                         }
                     }
                }

                // Fetch applicant
                const { data: appData, error: appError } = await supabase
                    .from('applicants')
                    .select('*')
                    .eq('id', applicantId)
                    .single();
                
                if (appError) throw appError;
                setApplicant(appData);

                // Fetch notes
                const { data: notesData, error: notesError } = await supabase
                    .from('interview_notes')
                    .select('id, notes, created_at, employees(user_id, job_title, users(full_name))')
                    .eq('applicant_id', applicantId)
                    .order('created_at', { ascending: false });

                if (notesError) throw notesError;

                if (notesData) {
                    const mappedNotes: Note[] = notesData.map((n: any) => ({
                        id: n.id,
                        interviewer: n.employees?.users?.full_name || 'Unknown',
                        role: n.employees?.job_title || 'Interviewer',
                        note: n.notes,
                        timestamp: new Date(n.created_at).toLocaleDateString() + ' ' + new Date(n.created_at).toLocaleTimeString()
                    }));
                    setNotes(mappedNotes);
                }

            } catch (error: any) {
                console.error("Error fetching data:", error);
                toast({ title: "Error", description: "Failed to load applicant data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [applicantId, toast]);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newNote.trim()) return;
        
        if (!employeeId || !tenantId) {
             toast({ title: "Error", description: "You must be an employee to add notes.", variant: "destructive" });
             return;
        }

        try {
            const { data, error } = await supabase.from('interview_notes').insert({
                tenant_id: tenantId,
                applicant_id: applicantId,
                interviewer_id: employeeId,
                notes: newNote
            }).select('id, notes, created_at, employees(user_id, job_title, users(full_name))').single();

            if (error) throw error;

            // Optimistic update or refetch. 
            // Since we select with join, we might need to rely on the return.
            // But the return of insert with deep select might not work perfectly depending on RLS/Permissions for joins on insert return.
            // Let's just refetch or manually construct.
            
            // Constructing manually for immediate feedback (simplified)
            // Ideally we would use the returned data if the select query works.
            
            // Re-fetch to be safe
             const { data: newNoteData } = await supabase
                    .from('interview_notes')
                    .select('id, notes, created_at, employees(user_id, job_title, users(full_name))')
                    .eq('id', data.id)
                    .single();
             
             if (newNoteData) {
                 const mappedNote: Note = {
                    id: newNoteData.id,
                    interviewer: newNoteData.employees?.users?.full_name || 'Me',
                    role: newNoteData.employees?.job_title || 'Interviewer',
                    note: newNoteData.notes,
                    timestamp: 'Just now'
                };
                setNotes(prev => [mappedNote, ...prev]);
             }
            
            setNewNote('');
            toast({ title: 'Note Added', description: 'Your feedback has been saved.' });
        } catch (error: any) {
             toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }

    const handleAction = (action: 'schedule' | 'reject') => {
        if(action === 'schedule') {
            toast({
                title: 'Interview Scheduled',
                description: `An interview has been scheduled with ${applicant?.full_name}.`,
            });
        } else {
            toast({
                title: 'Application Rejected',
                description: `An email has been sent to ${applicant?.full_name} informing them of the decision.`,
                variant: 'destructive',
            });
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!applicant) {
        return (
             <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold">Applicant Not Found</h1>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    // Safely access resume data
    const resumeData = applicant.resume_data || { skills: [], workExperience: [], education: [] };

    return (
        <div className="space-y-6">
            <Alert variant="destructive" className="border-yellow-500/50 text-yellow-900 dark:text-yellow-200 [&>svg]:text-yellow-500">
                <FileText className="h-4 w-4" />
                <AlertTitle className="text-yellow-600 dark:text-yellow-300">Applicant Profile</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                    Viewing details for {applicant.full_name}.
                </AlertDescription>
            </Alert>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-primary">
                            <AvatarImage src={resumeData.profile_picture_url || `https://ui-avatars.com/api/?name=${applicant.full_name}&background=random`} data-ai-hint="person portrait" alt={applicant.full_name} />
                            <AvatarFallback>{applicant.full_name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold font-headline">{applicant.full_name}</h1>
                            <div className="text-muted-foreground mt-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4"/>
                                    <span>Applied for: <strong>{resumeData.workExperience?.[0]?.title || 'General'}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4"/>
                                    <span>Applied on: {new Date(applicant.created_at).toLocaleDateString()} (ID: {applicantId.substring(0,8)}...)</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    <span>Status: <Badge variant="outline">{applicant.status}</Badge></span>
                                </div>
                            </div>
                        </div>
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button onClick={() => handleAction('schedule')}><Check className="mr-2 h-4 w-4"/> Schedule Interview</Button>
                            <Button variant="outline" onClick={() => handleAction('reject')}><X className="mr-2 h-4 w-4"/> Reject Application</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                    <TabsTrigger value="profile">Profile & Resume</TabsTrigger>
                    <TabsTrigger value="notes">Interviewer Notes</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText /> AI-Parsed Resume Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Key Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills?.map((skill: string) => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    )) || <p className="text-muted-foreground text-sm">No skills listed</p>}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Work Experience</h4>
                                <ul className="space-y-3">
                                    {resumeData.workExperience?.map((exp: any, i: number) => (
                                        <li key={i} className="flex gap-3">
                                            <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{exp.title}</p>
                                                <p className="text-sm text-muted-foreground">{exp.company} &middot; {exp.dates}</p>
                                            </div>
                                        </li>
                                    )) || <p className="text-muted-foreground text-sm">No experience listed</p>}
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Education</h4>
                                 <ul className="space-y-3">
                                    {resumeData.education?.map((edu: any, i: number) => (
                                        <li key={i} className="flex gap-3">
                                            <Award className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{edu.degree}</p>
                                                <p className="text-sm text-muted-foreground">{edu.institution} &middot; {edu.year}</p>
                                            </div>
                                        </li>
                                    )) || <p className="text-muted-foreground text-sm">No education listed</p>}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notes">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageSquare /> Interviewer Notes</CardTitle>
                            <CardDescription>Feedback and comments from the hiring team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="flex items-start gap-4 mb-6" onSubmit={handleAddNote}>
                                <Textarea 
                                    placeholder="Add your feedback for this candidate..." 
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                />
                                <Button type="submit" size="icon"><Send className="h-4 w-4"/></Button>
                            </form>
                            <Separator className="mb-6"/>
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-6 pr-4">
                                {notes.length > 0 ? notes.map(note => <NoteCard key={note.id} note={note} />) : <p className="text-center text-muted-foreground">No notes yet.</p>}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="assessments">
                     <StandardAssessmentsTab applicantId={applicantId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
