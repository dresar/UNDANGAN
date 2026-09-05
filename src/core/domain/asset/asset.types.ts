export type AssetOrigin = 'USER' | 'SHARED_THEME' | 'AI_GENERATED' | 'SYSTEM';

export type AssetStatus =
  | 'QUEUED'
  | 'GENERATED'
  | 'VALIDATING'
  | 'OPTIMIZING'
  | 'OPTIMIZED'
  | 'READY'
  | 'FAILED';

export interface MediaVariantInfo {
  variantType: 'thumbnail' | 'mobile' | 'desktop' | 'original';
  url: string;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width: number;
  height: number;
  sizeBytes: number;
}

export interface MediaAssetEntity {
  id: string;
  ownerId?: string | null;
  origin: AssetOrigin;
  status: AssetStatus;
  originalUrl: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  aspectRatio: string;
  isTransparent: boolean;
  checksum?: string;
  themeTag?: string;
  componentSlotTag?: string;
  generationPrompt?: string;
  variants: MediaVariantInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetSlotPlan {
  slotName: string;
  componentType: string;
  originDecision: AssetOrigin;
  prompt?: string;
  fallbackSharedAssetUrl?: string;
  aspectRatio: string;
  isTransparent: boolean;
  safeAreaGuideline?: string;
}
