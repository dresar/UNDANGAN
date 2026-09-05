import { NextRequest, NextResponse } from 'next/server';
import { AIWeddingPlanner } from '@/core/ai/ai-wedding-planner';
import { InvitationGenerator } from '@/core/engine/invitation-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { groomName, brideName, eventDate, naturalLanguagePrompt, preferredTheme, city } = body;

    if (!groomName || !brideName || !eventDate) {
      return NextResponse.json({ error: 'Nama pengantin dan tanggal acara wajib diisi.' }, { status: 400 });
    }

    const plan = await AIWeddingPlanner.planWeddingDesign({
      groomName,
      brideName,
      eventDate,
      naturalLanguagePrompt: naturalLanguagePrompt || 'Buatkan undangan pernikahan elegan bernuansa modern.',
      preferredTheme,
      city,
    });

    const initialConfig = InvitationGenerator.createFromTemplate({
      groomName,
      brideName,
      eventDate,
      templateId: plan.recommendedTemplateId,
      themeId: plan.recommendedThemeId,
      city,
      customTagline: plan.editorialTagline,
    });

    return NextResponse.json({
      success: true,
      plan,
      config: initialConfig,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
