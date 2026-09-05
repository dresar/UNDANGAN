import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
env.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
});

console.log('Database URL configured:', dbUrl ? 'Yes' : 'No');
const sql = neon(dbUrl);

async function main() {
  try {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
    console.log('Tables found:', tables.map(t => t.table_name));

    try {
      const usersList = await sql`SELECT id, email, name, role, created_at FROM users`;
      console.log('Users in database:', usersList);
    } catch (e) {
      console.log('Error querying users table:', e.message);
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

main();
