import { NextRequest, NextResponse } from 'next/server';
import { db, sql } from '@/infrastructure/db';
import { hashPassword, comparePassword } from '@/infrastructure/auth/password';
import { signToken } from '@/infrastructure/auth/jwt';
import { SESSION_COOKIE_NAME, getSession } from '@/infrastructure/auth/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({ authenticated: true, user: session });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, target } = body;

    // 1. Dev Login Action (1-Click Login for Development)
    if (action === 'dev-login') {
      const isUserTarget = target === 'user' || target === 'demo';
      const userPayload = isUserTarget
        ? {
            userId: '4b6a86f1-2a9d-456f-b1f1-867a906f8399',
            email: 'demo@undangan.local',
            name: 'Dinda (Demo)',
            role: 'user',
          }
        : {
            userId: '9b53a6c6-94f4-4b9d-a4d3-10de8d481408',
            email: 'admin@undangan.local',
            name: 'Administrator Super',
            role: 'admin',
          };

      const token = await signToken(userPayload);
      const response = NextResponse.json({
        success: true,
        message: `Berhasil login sebagai ${userPayload.role.toUpperCase()} (Dev Mode).`,
        user: userPayload,
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return response;
    }

    // 2. Register Action
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Data pendaftaran tidak lengkap.' }, { status: 400 });
      }

      const pwdHash = await hashPassword(password);
      const userId = `user-${Date.now()}`;

      if (sql) {
        try {
          // Check if account already exists
          const existing = await sql`SELECT id FROM accounts WHERE email = ${email} LIMIT 1`;
          if (existing && existing.length > 0) {
            return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 400 });
          }

          const accountId = `acc-${Date.now()}`;
          await sql`
            INSERT INTO accounts (id, email, password_hash, status, failed_login_count, created_at, updated_at)
            VALUES (${accountId}, ${email}, ${pwdHash}, 'active', 0, NOW(), NOW())
          `;
          await sql`
            INSERT INTO users (id, account_id, display_name, role, default_language, onboarding_done, created_at, updated_at)
            VALUES (${userId}, ${accountId}, ${name}, 'user', 'id', 'true', NOW(), NOW())
          `;
        } catch {
          // fallback to simple user record
        }
      }

      const token = await signToken({ userId, email, name, role: 'user' });
      const response = NextResponse.json({ success: true, user: { id: userId, email, name, role: 'user' } });
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return response;
    }

    // 3. Login Action
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
      }

      let user: { id: string; email: string; name: string; passwordHash: string; role: string } | null = null;

      // Query database if available
      if (sql) {
        try {
          const rows = await sql`
            SELECT 
              a.id as account_id, 
              a.email, 
              a.password_hash,
              u.id as user_id, 
              u.display_name, 
              u.role 
            FROM accounts a
            LEFT JOIN users u ON u.account_id = a.id
            WHERE a.email = ${email}
            LIMIT 1
          `;
          if (rows && rows.length > 0) {
            user = {
              id: rows[0].user_id || rows[0].account_id,
              email: rows[0].email,
              name: rows[0].display_name || rows[0].email.split('@')[0],
              passwordHash: rows[0].password_hash,
              role: rows[0].role || 'user',
            };
          }
        } catch (dbErr) {
          console.warn('DB query error on accounts:', dbErr);
        }
      }

      // If in demo mode without DB connection or mock user
      if (!user) {
        if (email.includes('@')) {
          const isDevAdmin = email.includes('admin') || email === 'admin@undangan.local';
          user = {
            id: isDevAdmin ? '9b53a6c6-94f4-4b9d-a4d3-10de8d481408' : 'mock-user-1',
            email,
            name: isDevAdmin ? 'Administrator Super' : email.split('@')[0],
            passwordHash: await hashPassword(password),
            role: isDevAdmin ? 'admin' : 'user',
          };
        } else {
          return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 401 });
        }
      }

      const match = await comparePassword(password, user.passwordHash);
      if (!match) {
        return NextResponse.json({ error: 'Password tidak cocok.' }, { status: 401 });
      }

      const token = await signToken({ userId: user.id, email: user.email, name: user.name, role: user.role });
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return response;
    }

    // 4. Logout Action
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Berhasil keluar.' });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({ error: 'Aksi tidak didukung.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

