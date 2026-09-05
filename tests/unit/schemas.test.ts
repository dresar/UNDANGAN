import { describe, it, expect } from 'vitest';
import { InvitationConfigSchema } from '@/core/schemas/invitation-config.schema';
import { ThemePackageSchema } from '@/core/schemas/theme-config.schema';
import { AIDesignPlanSchema } from '@/core/schemas/ai-design-plan.schema';

describe('Zod Schema Validation Suite', () => {
  it('should validate a valid InvitationConfig structure', () => {
    const validConfig = {
      version: 1,
      metadata: {
        title: 'Pernikahan Eka & Rani',
        groomName: 'Eka',
        brideName: 'Rani',
        eventDate: '24 Oktober 2026',
        themeId: 'classic-gold',
        templateId: 'cinematic-elegance',
        schemaVersion: 1,
      },
      themeId: 'classic-gold',
      templateId: 'cinematic-elegance',
      sections: [
        {
          id: 'sec-hero-1',
          componentType: 'hero',
          variant: 'cinematic',
          order: 0,
          isVisible: true,
          props: { groomNickname: 'Eka', brideNickname: 'Rani', eventDate: '24 Okt 2026' },
        },
      ],
    };

    const parsed = InvitationConfigSchema.safeParse(validConfig);
    expect(parsed.success).toBe(true);
  });

  it('should reject InvitationConfig with missing required metadata', () => {
    const invalidConfig = {
      version: 1,
      metadata: {
        title: '',
        groomName: '',
        brideName: 'Rani',
        eventDate: '',
        themeId: 'classic-gold',
        templateId: 'cinematic-elegance',
      },
      sections: [],
    };

    const parsed = InvitationConfigSchema.safeParse(invalidConfig);
    expect(parsed.success).toBe(false);
  });
});
