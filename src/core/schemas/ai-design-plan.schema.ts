import { z } from 'zod';

export const AIDesignPlanSchema = z.object({
  visualDirection: z.string().min(1),
  recommendedThemeId: z.string().min(1),
  recommendedTemplateId: z.string().min(1),
  colorMood: z.string().min(1),
  animationPersonality: z.enum(['subtle', 'elegant', 'cinematic', 'romantic', 'playful', 'minimal', 'none']),
  editorialTagline: z.string().min(1),
  loveStorySummary: z.string().optional(),
  sectionPlan: z.array(z.object({
    componentType: z.string(),
    variant: z.string(),
    order: z.number().int().nonnegative(),
    editorialHeadline: z.string().optional(),
    editorialSubtitle: z.string().optional(),
    suggestedProps: z.record(z.any()).default({}),
  })),
  assetRequirements: z.array(z.object({
    slotName: z.string(),
    componentType: z.string(),
    visualPurpose: z.enum(['hero_photo', 'portrait_groom', 'portrait_bride', 'gallery_photo', 'background_texture', 'divider_ornament', 'decorative_accent', 'audio_track']),
    aspectRatio: z.enum(['1:1', '4:5', '16:9', '9:16', '3:2', '2:3', 'custom']),
    isTransparent: z.boolean(),
    promptDescription: z.string(),
    recommendedOrigin: z.enum(['USER', 'SHARED_THEME', 'AI_GENERATED', 'SYSTEM']),
  })),
});

export type ValidatedAIDesignPlan = z.infer<typeof AIDesignPlanSchema>;
