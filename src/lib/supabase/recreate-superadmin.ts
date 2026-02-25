
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Database } from '../../database.types';

// Load environment variables
dotenv.config({ path: '.env' });

// Disable SSL verification for development/testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Mock fetch to bypass undici strictness if needed
// @ts-ignore
global.fetch = async (url, options) => {
    const { fetch: originalFetch } = await import('undici');
    return originalFetch(url, {
        ...options,
        dispatcher: new (await import('undici')).Agent({
            connect: {
                rejectUnauthorized: false
            }
        })
    });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: { 'Authorization': `Bearer ${supabaseServiceKey}` }
  }
});

async function main() {
  const email = 'superadmin@optitalent.com';
  const password = 'password123';
  const tenantSlug = 'optitalent';

  console.log(`🔥 Starting NUCLEAR RESET for Super Admin: ${email}`);

  try {
    // 1. Find User
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users.find(u => u.email === email);

    // 2. DELETE User if exists
    if (existingUser) {
        console.log(`   - Found existing user (ID: ${existingUser.id}). Deleting...`);
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
        if (deleteError) {
             console.error(`❌ Failed to delete user: ${deleteError.message}`);
             // If delete fails, we might not be able to proceed cleanly, but let's try recreating anyway if it was soft-deleted?
             // Actually, Supabase delete is usually hard delete.
        } else {
             console.log(`   - User deleted successfully.`);
        }
    } else {
        console.log(`   - User does not exist. Ready to create.`);
    }

    // 3. Find Tenant ID
    const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', tenantSlug)
        .single();
    
    if (tenantError || !tenant) {
        throw new Error(`Tenant '${tenantSlug}' not found! Run seed script first.`);
    }
    console.log(`   - Linked to Tenant ID: ${tenant.id}`);

    // 4. CREATE User fresh
    console.log(`   - Creating new user...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { 
            full_name: 'Super Admin', 
            tenant_id: tenant.id 
        }
    });

    if (createError) throw createError;
    console.log(`✅ User created! ID: ${newUser.user.id}`);

    // 5. Update Role in public.users
    // The trigger might have run, but let's force update to be 100% sure
    console.log(`   - Ensuring 'super-admin' role...`);
    
    // Wait a split second for trigger (optional but safe)
    await new Promise(r => setTimeout(r, 1000));

    const { error: roleError } = await supabase
        .from('users')
        .upsert({
            id: newUser.user.id,
            email: email,
            full_name: 'Super Admin',
            role: 'super-admin', // FORCE SUPER ADMIN
            tenant_id: tenant.id
        });

    if (roleError) throw roleError;
    console.log(`✅ Role updated to 'super-admin'.`);
    console.log(`🎉 READY! Login with: ${email} / ${password}`);

  } catch (error: any) {
    console.error('❌ Reset Failed:', error.message);
  }
}

main();
