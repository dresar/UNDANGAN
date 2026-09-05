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
  const vers = await sql`SELECT id, invitation_id, version_number, theme_slug, document FROM invitation_versions`;
  console.log('Versions count:', vers.length);
  for (const v of vers) {
    console.log(`- version for inv ${v.invitation_id}: theme=${v.theme_slug}, docKeys=${Object.keys(v.document || {})}`);
  }
}

main();
