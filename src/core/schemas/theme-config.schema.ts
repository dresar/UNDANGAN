import { z } from 'zod';

export const ColorTokensSchema = z.object({
  primary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  primaryForeground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  secondary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  secondaryForeground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  accent: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  accentForeground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  background: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  foreground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  muted: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  mutedForeground: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  surface: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  surfaceBorder: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
});

export const TypographyTokensSchema = z.object({
  fontSerif: z.string().min(1),
  fontSans: z.string().min(1),
  fontScript: z.string().min(1),
  headingScale: z.number().positive().default(1.25),
  bodyLineHeight: z.number().positive().default(1.6),
});

export const StyleTokensSchema = z.object({
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  cardStyle: z.enum(['flat', 'elevated', 'glassmorphism', 'bordered', 'ornamental']),
  buttonStyle: z.enum(['filled', 'outline', 'pill', 'vintage']),
  dividerStyle: z.enum(['solid', 'floral', 'line-ornament', 'minimal', 'wave']),
});

export const ThemePackageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string(),
  thumbnailUrl: z.string().optional(),
  colors: ColorTokensSchema,
  typography: TypographyTokensSchema,
  styles: StyleTokensSchema,
  animationPersonality: z.enum(['subtle', 'elegant', 'cinematic', 'romantic', 'playful', 'minimal', 'none']),
  supportedTemplates: z.array(z.string()),
  recommendedVariants: z.record(z.string()),
  sharedAssets: z.array(z.object({
    slotName: z.string(),
    assetUrl: z.string(),
    visualType: z.string(),
  })),
  promptStyleModifiers: z.object({
    artStyle: z.string(),
    lighting: z.string(),
    colorMood: z.string(),
    negativePrompt: z.string(),
  }),
});

export type ValidatedThemePackage = z.infer<typeof ThemePackageSchema>;
