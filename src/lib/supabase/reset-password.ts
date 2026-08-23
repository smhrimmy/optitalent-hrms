
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
  const newPassword = 'password123'; // Hardcoded for recovery

  console.log(`🔐 Attempting to reset password for: ${email}`);

  try {
    // 1. List users to find the ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`❌ User ${email} NOT FOUND in Supabase Auth!`);
        console.log('Available users:', users.map(u => u.email));
        return;
    }

    console.log(`✅ Found User ID: ${user.id}`);
    console.log(`   - Current Status: ${user.email_confirmed_at ? 'Confirmed' : 'Unconfirmed'}`);

    // 2. Force Update Password
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id, 
        { 
            password: newPassword,
            email_confirm: true, // Force confirm email just in case
            user_metadata: { ...user.user_metadata, email_verified: true }
        }
    );

    if (updateError) {
        throw new Error(`Failed to update password: ${updateError.message}`);
    }

    console.log(`🎉 Password successfully reset to: ${newPassword}`);
    console.log(`   - Email marked as confirmed.`);
    
  } catch (error: any) {
    console.error('❌ Reset Failed:', error.message);
  }
}

main();
