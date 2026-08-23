import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { getCompanyContext } from '@/lib/auth-server';
import { authorize } from '@/lib/authorization/engine';

export async function POST(req: Request) {
  try {
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Supabase is not configured in this environment. Company provisioning is unavailable.' },
        { status: 503 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const context = await getCompanyContext();
    const authResult = authorize({
      context,
      resource: 'platform.company',
      action: 'create'
    });

    if (!authResult.allowed) {
        return NextResponse.json({ error: authResult.reason }, { status: 403 });
    }

    // 2. Parse Body
    const { name, plan, adminEmail } = await req.json();

    if (!name || !adminEmail) {
      return NextResponse.json({ error: 'Missing required fields: name, adminEmail' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    // 3. Create Company
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        name,
        slug,
        status: 'Active',
      })
      .select()
      .single();

    if (companyError) {
      console.error('Company Creation Error:', companyError);
      return NextResponse.json({ error: `Failed to create company: ${companyError.message}` }, { status: 500 });
    }

    // 4. Invite Admin User & Create Platform Identity
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(adminEmail, {
      data: {
        company_id: company.id,
        full_name: 'Admin User',
      },
    });

    if (inviteError) {
      console.error('Invite Error:', inviteError);
      await supabaseAdmin.from('companies').delete().eq('id', company.id);
      return NextResponse.json({ error: `Failed to invite admin: ${inviteError.message}` }, { status: 500 });
    }
    
    const userId = inviteData.user.id;

    // Upsert Platform Identity
    await supabaseAdmin.from('platform_identities').upsert({
      id: userId,
      email: adminEmail,
      full_name: 'Admin User',
      platform_role: 'none',
      status: 'ACTIVE'
    });

    // 5. Create Company Membership
    const { data: membership, error: membershipError } = await supabaseAdmin.from('company_memberships').insert({
      identity_id: userId,
      company_id: company.id,
      status: 'ACTIVE'
    }).select().single();

    if (membershipError) {
       console.error('Membership Creation Error:', membershipError);
    } else {
       // Ideally we would also assign them the 'Company Admin' role here.
       // E.g. finding the 'Company Admin' role for this company and inserting into role_assignments.
    }

    return NextResponse.json({ success: true, company, user: inviteData.user });
  } catch (error: unknown) {
    console.error('Provision Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
