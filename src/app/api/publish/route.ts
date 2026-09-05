import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/infrastructure/db';
import { PublicationEngine } from '@/core/engine/publication-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, config, slug, resolvedAssets } = body;

    if (!config || !slug) {
      return NextResponse.json({ error: 'Config dan slug wajib disertakan.' }, { status: 400 });
    }

    const pubResult = PublicationEngine.createSnapshot(config, slug, resolvedAssets || {});
    if (!pubResult.success) {
      return NextResponse.json({
        error: 'Undangan belum memenuhi syarat publikasi.',
        report: pubResult.report,
      }, { status: 422 });
    }

    if (sql && invitationId) {
      try {
        await sql`
          UPDATE invitations 
          SET status = 'published', slug = ${slug}, updated_at = NOW(), published_at = NOW() 
          WHERE id = ${invitationId}
        `;

        await sql`
          UPDATE invitation_versions 
          SET document = ${JSON.stringify(config)}
          WHERE invitation_id = ${invitationId}
        `;
      } catch (dbErr) {
        console.warn('DB publish update error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      publishedUrl: `/${slug}`,
      snapshot: pubResult.snapshot,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

