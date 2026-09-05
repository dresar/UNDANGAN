export interface SharedAssetItem {
  id: string;
  name: string;
  category: 'divider' | 'ornament' | 'texture' | 'badge' | 'icon';
  url: string;
  aspectRatio: string;
  isTransparent: boolean;
  themeTag?: string;
  keywords: string[];
}

export class SharedAssetRegistry {
  private static instance: SharedAssetRegistry;
  private assets = new Map<string, SharedAssetItem>();

  private constructor() {
    this.registerBuiltinAssets();
  }

  public static getInstance(): SharedAssetRegistry {
    if (!SharedAssetRegistry.instance) {
      SharedAssetRegistry.instance = new SharedAssetRegistry();
    }
    return SharedAssetRegistry.instance;
  }

  public register(asset: SharedAssetItem): void {
    this.assets.set(asset.id, asset);
  }

  public get(id: string): SharedAssetItem | undefined {
    return this.assets.get(id);
  }

  public findByCategory(category: SharedAssetItem['category']): SharedAssetItem[] {
    return Array.from(this.assets.values()).filter((a) => a.category === category);
  }

  public findByTag(themeTag: string): SharedAssetItem[] {
    return Array.from(this.assets.values()).filter((a) => a.themeTag === themeTag || !a.themeTag);
  }

  private registerBuiltinAssets(): void {
    this.register({
      id: 'shared-gold-floral-divider',
      name: 'Gold Floral Divider',
      category: 'divider',
      url: 'https://placehold.co/800x100/transparent/D4AF37?text=Gold+Floral+Divider',
      aspectRatio: 'custom',
      isTransparent: true,
      themeTag: 'classic-gold',
      keywords: ['gold', 'floral', 'divider', 'ornament'],
    });

    this.register({
      id: 'shared-botanical-leaf-divider',
      name: 'Botanical Leaf Divider',
      category: 'divider',
      url: 'https://placehold.co/800x100/transparent/1E4D3B?text=Botanical+Divider',
      aspectRatio: 'custom',
      isTransparent: true,
      themeTag: 'modern-emerald',
      keywords: ['emerald', 'leaf', 'botanical', 'divider'],
    });

    this.register({
      id: 'shared-rose-branch-ornament',
      name: 'Dusty Rose Branch Accent',
      category: 'ornament',
      url: 'https://placehold.co/400x400/transparent/B86B77?text=Rose+Branch',
      aspectRatio: '1:1',
      isTransparent: true,
      themeTag: 'romantic-rose',
      keywords: ['rose', 'floral', 'corner', 'ornament'],
    });
  }
}

export const sharedAssetRegistry = SharedAssetRegistry.getInstance();
