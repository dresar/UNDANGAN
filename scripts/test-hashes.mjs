import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const env = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
env.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
});

const sql = neon(dbUrl);

async function testPasswords() {
  const accounts = await sql`SELECT email, password_hash FROM accounts`;
  console.log('Accounts in DB:');
  for (const acc of accounts) {
    console.log(`- ${acc.email} | hash: ${acc.password_hash?.substring(0, 30)}...`);
  }
}

testPasswords();
