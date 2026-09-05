import { z } from 'zod';

export const InvitationMetadataSchema = z.object({
  title: z.string().min(1, 'Judul undangan wajib diisi'),
  description: z.string().optional(),
  groomName: z.string().min(1, 'Nama mempelai pria wajib diisi'),
  brideName: z.string().min(1, 'Nama mempelai wanita wajib diisi'),
  eventDate: z.string().min(1, 'Tanggal acara wajib diisi'),
  locationCity: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  themeId: z.string().min(1),
  templateId: z.string().min(1),
  schemaVersion: z.number().int().positive().default(1),
});

export const SectionConfigSchema = z.object({
  id: z.string().min(1),
  componentType: z.string().min(1),
  variant: z.string().min(1),
  order: z.number().int().nonnegative(),
  isVisible: z.boolean().default(true),
  props: z.record(z.any()).default({}),
  assetSlots: z.record(z.string()).optional(),
  animationOverride: z.object({
    preset: z.string().optional(),
    delay: z.number().nonnegative().optional(),
    duration: z.number().positive().optional(),
  }).optional(),
});

export const ThemeOverridesSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).optional(),
  secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).optional(),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).optional(),
  fontSerif: z.string().optional(),
  fontSans: z.string().optional(),
  fontScript: z.string().optional(),
});

export const MusicConfigSchema = z.object({
  enabled: z.boolean().default(false),
  audioUrl: z.string().url().optional().or(z.literal('')),
  autoPlay: z.boolean().default(false),
  title: z.string().optional(),
  artist: z.string().optional(),
});

export const SeoConfigSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.array(z.string()).optional(),
});

export const InvitationConfigSchema = z.object({
  version: z.number().int().positive().default(1),
  metadata: InvitationMetadataSchema,
  themeId: z.string().min(1),
  templateId: z.string().min(1),
  themeOverrides: ThemeOverridesSchema.optional(),
  sections: z.array(SectionConfigSchema),
  musicConfig: MusicConfigSchema.optional(),
  seoConfig: SeoConfigSchema.optional(),
});

export type ValidatedInvitationConfig = z.infer<typeof InvitationConfigSchema>;
