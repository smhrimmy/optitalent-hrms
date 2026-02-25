
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Service Role Client directly here as well to ensure correct setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  try {
    // 1. Auth Check (Super Admin Only)
    // We can't verify the session token easily without middleware or passing it.
    // Assuming the caller is authenticated via frontend and we trust the request originates from there?
    // NO. We must verify the token.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Check role in public.users
    const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (userError || userData?.role !== 'super-admin') {
        return NextResponse.json({ error: 'Forbidden: Requires super-admin role' }, { status: 403 });
    }

    // 2. Parse Body
    const { name, plan, adminEmail } = await req.json();
    
    if (!name || !plan || !adminEmail) {
        return NextResponse.json({ error: 'Missing required fields: name, plan, adminEmail' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    // 3. Create Tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .insert({ 
            name, 
            slug, 
            plan, 
            status: 'Active' 
        })
        .select()
        .single();
    
    if (tenantError) {
        console.error("Tenant Creation Error:", tenantError);
        return NextResponse.json({ error: `Failed to create tenant: ${tenantError.message}` }, { status: 500 });
    }

    // 4. Invite Admin User
    // This creates a user in auth.users and sends an invitation email.
    // We also want to store tenant_id in user_metadata so triggers can pick it up if they existed.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(adminEmail, {
        data: { 
            tenant_id: tenant.id, 
            role: 'admin',
            full_name: 'Admin User' 
        }
    });

    if (inviteError) {
        console.error("Invite Error:", inviteError);
        // Rollback: delete the tenant we just created
        await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
        return NextResponse.json({ error: `Failed to invite admin: ${inviteError.message}` }, { status: 500 });
    }

    // 5. Create Public User Record
    // Since we don't have a trigger, we insert manually into public.users
    const { error: publicUserError } = await supabaseAdmin.from('users').insert({
        id: inviteData.user.id,
        tenant_id: tenant.id,
        email: adminEmail,
        role: 'admin',
        full_name: 'Admin User',
        status: 'Active' // Assuming status column exists or default
    });

    if (publicUserError) {
        console.error("Public User Creation Error:", publicUserError);
        // This is a partial failure. Auth user exists, Tenant exists, but public user record is missing.
        // We might want to delete the auth user and tenant to be clean, or just warn.
        // For now, return error but keep the tenant (admin can retry or fix manually).
        return NextResponse.json({ 
            success: true, 
            tenant, 
            message: "Tenant created and invite sent, but public user record creation failed. Please check logs." 
        });
    }

    return NextResponse.json({ success: true, tenant, user: inviteData.user });

  } catch (error: any) {
    console.error("Provision Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
