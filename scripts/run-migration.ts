
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Bypass self-signed cert errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function runMigration() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Usage: tsx scripts/run-migration.ts <path-to-sql-file>');
    process.exit(1);
  }

  console.log(`🚀 Starting migration: ${migrationFile}...`);

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

    const sqlPath = path.resolve(process.cwd(), migrationFile);
    if (!fs.existsSync(sqlPath)) {
        throw new Error(`Migration file not found: ${sqlPath}`);
    }
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📜 Executing SQL...');
    await client.query(sqlContent);

    console.log('✅ Migration applied successfully!');
  } catch (err) {
    console.error('❌ Error applying migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
