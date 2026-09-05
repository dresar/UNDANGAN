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
  const result = await sql`
    SELECT 
      a.id as account_id, 
      a.email, 
      a.password_hash,
      u.id as user_id, 
      u.display_name, 
      u.role 
    FROM accounts a
    LEFT JOIN users u ON u.account_id = a.id
  `;
  console.log('Joined accounts & users in DB:', JSON.stringify(result, null, 2));
}

main();
