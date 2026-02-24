
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Bypass self-signed cert errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function deploySchema() {
  console.log('🚀 Starting schema deployment...');

  // Use non-pooling URL for DDL/Migrations to avoid transaction pooler issues
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    throw new Error('POSTGRES_URL (or POSTGRES_URL_NON_POOLING) is not defined in .env file');
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    const schemaPath = path.resolve(__dirname, '../src/lib/supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 executing schema.sql...');
    await client.query(schemaSql);

    console.log('✅ Schema deployed successfully!');
  } catch (err) {
    console.error('❌ Error deploying schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

deploySchema();
