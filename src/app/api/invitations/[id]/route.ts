import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/infrastructure/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let invitation: any = null;
    let version: any = null;

    if (sql) {
      try {
        const invRows = await sql`SELECT * FROM invitations WHERE id = ${id} OR slug = ${id} LIMIT 1`;
        if (invRows && invRows[0]) {
          invitation = invRows[0];
          const verRows = await sql`
            SELECT * FROM invitation_versions 
            WHERE invitation_id = ${invitation.id} 
            ORDER BY version_number DESC 
            LIMIT 1
          `;
          if (verRows && verRows[0]) {
            version = {
              draftConfig: verRows[0].document || verRows[0].draft_config || {},
              publishedSnapshot: verRows[0].published_snapshot || null,
            };
          }
        }
      } catch (dbErr) {
        console.warn('DB error fetching invitation:', dbErr);
      }
    }

    if (!invitation) {
      return NextResponse.json({
        invitation: { id, title: 'Demo Invitation', slug: 'demo-wedding' },
        version: { draftConfig: {} },
      });
    }

    return NextResponse.json({
      invitation,
      version: version || { draftConfig: {} },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { config, slug } = body;

    if (sql) {
      try {
        if (slug) {
          await sql`UPDATE invitations SET slug = ${slug}, updated_at = NOW() WHERE id = ${id}`;
        }
        if (config) {
          await sql`
            UPDATE invitation_versions 
            SET document = ${JSON.stringify(config)} 
            WHERE invitation_id = ${id}
          `;
        }
      } catch (dbErr) {
        console.warn('DB error updating draft config:', dbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

