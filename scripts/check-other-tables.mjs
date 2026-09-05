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
  const tablesToCheck = ['invitations', 'invitation_versions', 'themes', 'media_assets', 'ai_tasks'];
  for (const t of tablesToCheck) {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${t}
    `;
    console.log(`Table ${t}:`, cols.map(c => `${c.column_name} (${c.data_type})`));
  }
}

main();
