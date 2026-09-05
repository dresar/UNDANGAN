import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
env.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
});

const sql = neon(dbUrl);

async function main() {
  const columns = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'accounts'
  `;
  console.log('Columns of accounts table:', columns);

  const accounts = await sql`SELECT * FROM accounts`;
  console.log('Accounts in DB:', accounts);
}

main();
