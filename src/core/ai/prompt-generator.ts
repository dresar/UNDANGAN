import { ThemePackage } from '../domain/theme/theme.types';
import { AssetSlotRequirement } from '../domain/component/component.types';

export interface PromptGenerationContext {
  theme: ThemePackage;
  slot: AssetSlotRequirement;
  visualSubject: string;
  groomName?: string;
  brideName?: string;
}

export interface GeneratedPromptResult {
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  hasTextOverlay: boolean;
  styleKeywords: string[];
}

export class ImagePromptGenerator {
  public static generate(context: PromptGenerationContext): GeneratedPromptResult {
    const { theme, slot, visualSubject } = context;
    const styleModifiers = theme.promptStyleModifiers;

    const parts = [
      visualSubject,
      styleModifiers.artStyle,
      `lighting: ${styleModifiers.lighting}`,
      `color palette: ${styleModifiers.colorMood}`,
      `high aesthetic wedding composition, 8k resolution, photorealistic`,
    ];

    if (slot.hasTextOverlay) {
      parts.push('composition with subtle copy-safe area in center or bottom for text overlay');
    }

    if (slot.isTransparent) {
      parts.push('isolated on pure transparent background, crisp alpha channel outline, vector/3D ornamental style');
    }

    return {
      prompt: parts.join(', '),
      negativePrompt: styleModifiers.negativePrompt,
      aspectRatio: slot.aspectRatio,
      hasTextOverlay: Boolean(slot.hasTextOverlay),
      styleKeywords: [theme.name, slot.visualPurpose],
    };
  }
}
