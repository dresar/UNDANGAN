export type InvitationStatus = 'DRAFT' | 'READY' | 'PUBLISHED' | 'ARCHIVED';

export interface InvitationMetadata {
  title: string;
  description?: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  locationCity?: string;
  ogImage?: string;
  themeId: string;
  templateId: string;
  schemaVersion: number;
}

export interface SectionConfig {
  id: string;
  componentType: string;
  variant: string;
  order: number;
  isVisible: boolean;
  props: Record<string, unknown>;
  assetSlots?: Record<string, string>; // slotName -> assetId
  animationOverride?: {
    preset?: string;
    delay?: number;
    duration?: number;
  };
}

export interface ThemeOverrides {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  fontSerif?: string;
  fontSans?: string;
  fontScript?: string;
}

export interface InvitationConfig {
  version: number;
  metadata: InvitationMetadata;
  themeId: string;
  templateId: string;
  themeOverrides?: ThemeOverrides;
  sections: SectionConfig[];
  musicConfig?: {
    enabled: boolean;
    audioUrl?: string;
    autoPlay: boolean;
    title?: string;
    artist?: string;
  };
  seoConfig?: {
    metaTitle: string;
    metaDescription: string;
    keywords?: string[];
  };
}

export interface PublishedSnapshot {
  publishedAt: string;
  version: number;
  slug: string;
  config: InvitationConfig;
  resolvedAssets: Record<string, {
    url: string;
    webpUrl?: string;
    thumbnailUrl?: string;
    mobileUrl?: string;
    desktopUrl?: string;
    width: number;
    height: number;
    alt?: string;
  }>;
}
