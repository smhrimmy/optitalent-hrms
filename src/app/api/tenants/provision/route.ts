import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Supabase is not configured in this environment. Tenant provisioning is unavailable.' },
        { status: 503 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super-admin') {
      return NextResponse.json({ error: 'Forbidden: Requires super-admin role' }, { status: 403 });
    }

    const { name, plan, adminEmail } = await req.json();

    if (!name || !plan || !adminEmail) {
      return NextResponse.json({ error: 'Missing required fields: name, plan, adminEmail' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name,
        slug,
        plan,
        status: 'Active',
      })
      .select()
      .single();

    if (tenantError) {
      console.error('Tenant Creation Error:', tenantError);
      return NextResponse.json({ error: `Failed to create tenant: ${tenantError.message}` }, { status: 500 });
    }

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(adminEmail, {
      data: {
        tenant_id: tenant.id,
        role: 'admin',
        full_name: 'Admin User',
      },
    });

    if (inviteError) {
      console.error('Invite Error:', inviteError);
      await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
      return NextResponse.json({ error: `Failed to invite admin: ${inviteError.message}` }, { status: 500 });
    }

    const { error: publicUserError } = await supabaseAdmin.from('users').insert({
      id: inviteData.user.id,
      tenant_id: tenant.id,
      email: adminEmail,
      role: 'admin',
      full_name: 'Admin User',
      status: 'Active',
    });

    if (publicUserError) {
      console.error('Public User Creation Error:', publicUserError);
      return NextResponse.json({
        success: true,
        tenant,
        message: 'Tenant created and invite sent, but public user record creation failed. Please check logs.',
      });
    }

    return NextResponse.json({ success: true, tenant, user: inviteData.user });
  } catch (error: unknown) {
    console.error('Provision Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
