'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  User, Briefcase, Heart, FileText, Mail, Phone, 
  MapPin, Calendar, Clock, Edit, Plus, ArrowLeft, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', location: '' });

  useEffect(() => {
    const fetchProfile = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            // Fetch public.users + employees data
            const { data: profile, error } = await supabase
                .from('users')
                .select(`
                    *,
                    employees!employees_user_id_fkey (
                        job_title,
                        employee_id,
                        phone_number,
                        profile_picture_url,
                        status
                    )
                `)
                .eq('id', authUser.id)
                .single();
            
            if (profile) {
                const emp = profile.employees?.[0] || {};
                setUser({
                    id: profile.id,
                    name: profile.full_name,
                    email: profile.email,
                    role: profile.role,
                    phone: emp.phone_number || 'N/A',
                    location: 'New York, USA', // Placeholder as location isn't in DB schema yet
                    job_title: emp.job_title || profile.role,
                    employee_id: emp.employee_id || 'N/A',
                    avatarUrl: emp.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`
                });
                setEditForm({
                    full_name: profile.full_name,
                    phone: emp.phone_number || '',
                    location: 'New York, USA'
                });
            }
        }
        setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
      if (!user) return;
      
      // Update users table
      const { error: userError } = await supabase
          .from('users')
          .update({ full_name: editForm.full_name })
          .eq('id', user.id);

      // Update employees table
      const { error: empError } = await supabase
          .from('employees')
          .update({ phone_number: editForm.phone })
          .eq('user_id', user.id);

      if (userError || empError) {
          toast.error("Failed to update profile");
      } else {
          toast.success("Profile updated successfully");
          setUser({ ...user, name: editForm.full_name, phone: editForm.phone, location: editForm.location });
          setIsEditOpen(false);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Top Profile Card */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6 items-start">
          <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mt-1">
                  {user.job_title}
                </span>
              </div>
              
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
                        <Edit className="h-3 w-3" />
                        Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>Make changes to your personal information here.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                          <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <Label>Location</Label>
                              <Input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                          <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                {user.phone}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {user.location}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* ... Rest of Tabs Code ... */}
      <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
        {/* ... TabsList ... */}
        <div className="relative">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 rounded-none gap-6 relative z-0">
          <TabsTrigger value="about" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700">
            <User className="h-4 w-4" /> About
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700">
            <Briefcase className="h-4 w-4" /> Professional
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700">
            <Heart className="h-4 w-4" /> Family & Health
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
        </TabsList>
        </div>

        <div className="mt-6 relative z-10">
          <TabsContent value="professional" className="space-y-6">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Work Experience</CardTitle>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.info("Feature coming soon!")} className="gap-1 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200">
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </CardHeader>
              <CardContent className="p-6 bg-white min-h-[200px] flex items-center justify-center text-slate-400">
                 <div className="text-center">
                    <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No work experience added yet.</p>
                 </div>
              </CardContent>
            </Card>

             <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Education</CardTitle>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.info("Feature coming soon!")} className="gap-1 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200">
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </CardHeader>
              <CardContent className="p-6 bg-white min-h-[150px] flex items-center justify-center text-slate-400">
                 <div className="text-center">
                    <p>No education details added yet.</p>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-6">
             <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Basic Information</CardTitle>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setIsEditOpen(true)} className="gap-1 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200">
                  <Edit className="h-3 w-3" /> Edit
                </Button>
              </CardHeader>
              <CardContent className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
                    <p className="text-sm font-medium text-slate-700">{user.name}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</p>
                    <p className="text-sm font-medium text-slate-700">{user.email}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm font-medium text-slate-700">{user.phone}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                    <p className="text-sm font-medium text-slate-700">{user.location}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Role</p>
                    <p className="text-sm font-medium text-slate-700">{user.role}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Employee ID</p>
                    <p className="text-sm font-medium text-slate-700">{user.employee_id}</p>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="family">
             <Card className="p-10 text-center text-muted-foreground bg-white">
                Family & Health Content Placeholder
             </Card>
          </TabsContent>
           <TabsContent value="documents">
             <Card className="p-10 text-center text-muted-foreground bg-white">
                Documents Content Placeholder
             </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
