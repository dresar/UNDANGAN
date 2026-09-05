import { ReactNode } from 'react';

export type ComponentCategory =
  | 'header'
  | 'couple'
  | 'event'
  | 'media'
  | 'engagement'
  | 'decorative'
  | 'utility'
  | 'footer';

export interface AssetSlotRequirement {
  slotName: string;
  visualPurpose: 'hero_photo' | 'portrait_groom' | 'portrait_bride' | 'gallery_photo' | 'background_texture' | 'divider_ornament' | 'decorative_accent' | 'audio_track';
  aspectRatio: '1:1' | '4:5' | '16:9' | '9:16' | '3:2' | '2:3' | 'custom';
  isTransparent?: boolean;
  recommendedMinWidth: number;
  recommendedMinHeight: number;
  maxSizeBytes?: number;
  hasTextOverlay?: boolean;
}

export interface ComponentVariantDefinition {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
}

export interface ComponentMetadata<TProps = Record<string, unknown>> {
  type: string;
  displayName: string;
  category: ComponentCategory;
  description: string;
  supportedVariants: ComponentVariantDefinition[];
  defaultVariant: string;
  assetSlots: AssetSlotRequirement[];
  defaultProps: TProps;
  responsiveBehavior: {
    mobileStack: boolean;
    tabletColumns?: number;
    desktopColumns?: number;
  };
}

export interface ComponentRenderProps<TProps = Record<string, unknown>> {
  id: string;
  variant: string;
  props: TProps;
  assets?: Record<string, string>;
  themeTokens?: Record<string, string>;
  isEditable?: boolean;
  onUpdateProps?: (newProps: Partial<TProps>) => void;
}
