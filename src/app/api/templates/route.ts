import { NextRequest, NextResponse } from 'next/server';
import { templateRegistry } from '@/core/registry/template-registry';
import { TemplateDefinition } from '@/core/domain/template/template.types';

export async function GET() {
  try {
    const templates = templateRegistry.getAll();
    return NextResponse.json({ items: templates, total: templates.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, category, defaultSections, supportedThemeIds, thumbnailUrl } = body;

    if (!name || !defaultSections || !Array.isArray(defaultSections)) {
      return NextResponse.json({ error: 'Data template tidak lengkap.' }, { status: 400 });
    }

    const templateId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTemplate: TemplateDefinition = {
      id: templateId,
      name,
      description: description || 'Master Template Pernikahan Digital',
      category: category || 'cinematic',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      defaultSections,
      supportedThemeIds: supportedThemeIds || ['*'],
    };

    templateRegistry.register(newTemplate);

    return NextResponse.json({
      success: true,
      message: 'Template berhasil didaftarkan ke Template Registry!',
      template: newTemplate,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
