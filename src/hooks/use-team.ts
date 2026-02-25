
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: userData } = await supabase
                .from('users')
                .select('tenant_id')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id) return;

            // Fetch all employees in tenant for now (since we don't have org chart hierarchy yet)
            // Ideally we filter by manager_id = current_user.employee_id
            const { data: employees, error } = await supabase
                .from('employees')
                .select(`
                    id,
                    employee_id,
                    job_title,
                    profile_picture_url,
                    users!inner (
                        full_name,
                        email
                    )
                `)
                .eq('tenant_id', userData.tenant_id);

            if (error) throw error;

            if (employees) {
                const members = employees.map((e: any) => ({
                    id: e.id, // Use UUID for internal linking
                    employeeId: e.employee_id, // Use display ID
                    name: e.users?.full_name || 'Unknown',
                    role: e.job_title,
                    avatar: e.profile_picture_url || `https://ui-avatars.com/api/?name=${e.users?.full_name}&background=random`,
                    email: e.users?.email,
                    status: 'Active', // Mock status for now
                    performance: 85, // Mock performance score
                    tasksCompleted: 10,
                    tasksPending: 2
                }));
                setTeamMembers(members);
            }
        } catch (error) {
            console.error("Error fetching team:", error);
        }
    }
    fetchTeam();
  }, []);

  return teamMembers;
}
