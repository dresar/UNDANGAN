export type AnimationPersonality = 'subtle' | 'elegant' | 'cinematic' | 'romantic' | 'playful' | 'minimal' | 'none';

export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  surface: string;
  surfaceBorder: string;
}

export interface TypographyTokens {
  fontSerif: string;
  fontSans: string;
  fontScript: string;
  headingScale: number; // e.g. 1.25
  bodyLineHeight: number;
}

export interface StyleTokens {
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  cardStyle: 'flat' | 'elevated' | 'glassmorphism' | 'bordered' | 'ornamental';
  buttonStyle: 'filled' | 'outline' | 'pill' | 'vintage';
  dividerStyle: 'solid' | 'floral' | 'line-ornament' | 'minimal' | 'wave';
}

export interface ThemePackage {
  id: string;
  name: string;
  version: string;
  description: string;
  thumbnailUrl?: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  styles: StyleTokens;
  animationPersonality: AnimationPersonality;
  supportedTemplates: string[];
  recommendedVariants: Record<string, string>; // componentType -> variantName
  sharedAssets: Array<{
    slotName: string;
    assetUrl: string;
    visualType: string;
  }>;
  promptStyleModifiers: {
    artStyle: string;
    lighting: string;
    colorMood: string;
    negativePrompt: string;
  };
}
