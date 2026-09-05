export interface TemplateSectionDefinition {
  componentType: string;
  defaultVariant: string;
  isOptional: boolean;
  defaultOrder: number;
  recommendedAssetSlots?: string[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'cinematic' | 'editorial' | 'minimal' | 'romantic' | 'classic' | 'modern';
  thumbnailUrl?: string;
  defaultSections: TemplateSectionDefinition[];
  supportedThemeIds: string[]; // ['*'] for all
}
