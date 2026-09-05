export interface ImageUploadParams {
  file: Buffer | string; // Base64 string or binary buffer
  fileName: string;
  folder?: string;
  tags?: string[];
}

export interface ImageUploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
}

export class ImageKitStorageProvider {
  private urlEndpoint: string;
  private publicKey: string;
  private isConfigured: boolean;

  constructor() {
    this.urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/demo';
    this.publicKey = process.env.IMAGEKIT_PUBLIC_KEY || '';
    this.isConfigured = Boolean(process.env.IMAGEKIT_PRIVATE_KEY && this.publicKey);
  }

  public getResponsiveUrl(
    originalUrl: string,
    transformations: { width?: number; height?: number; quality?: number; format?: 'webp' | 'avif' | 'auto' }
  ): string {
    // If not imagekit URL, return original
    if (!originalUrl.includes('ik.imagekit.io')) {
      return originalUrl;
    }

    const trs: string[] = [];
    if (transformations.width) trs.push(`w-${transformations.width}`);
    if (transformations.height) trs.push(`h-${transformations.height}`);
    if (transformations.quality) trs.push(`q-${transformations.quality}`);
    if (transformations.format) trs.push(`f-${transformations.format}`);

    const trString = trs.length > 0 ? `tr:${trs.join(',')}` : '';
    const parts = originalUrl.split('/');
    const insertIdx = parts.findIndex((p) => p.startsWith('ik.imagekit.io')) + 2;
    if (insertIdx > 1 && trString) {
      parts.splice(insertIdx, 0, trString);
      return parts.join('/');
    }

    return originalUrl;
  }

  public async uploadImage(params: ImageUploadParams): Promise<ImageUploadResult> {
    if (!this.isConfigured) {
      // Return safe mock upload in test / dev mode
      const mockId = `mock-img-${Date.now()}`;
      return {
        fileId: mockId,
        name: params.fileName,
        url: typeof params.file === 'string' && params.file.startsWith('http')
          ? params.file
          : `https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop`,
        thumbnailUrl: `https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop`,
        width: 1200,
        height: 800,
        size: 245000,
      };
    }

    // Dynamic import to avoid runtime crashes if SDK not needed
    const ImageKit = (await import('imagekit')).default;
    const ik = new ImageKit({
      publicKey: this.publicKey,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: this.urlEndpoint,
    });

    const res = await ik.upload({
      file: params.file,
      fileName: params.fileName,
      folder: params.folder || '/undangan',
      tags: params.tags,
    });

    return {
      fileId: res.fileId,
      name: res.name,
      url: res.url,
      thumbnailUrl: res.thumbnailUrl,
      width: res.width,
      height: res.height,
      size: res.size,
    };
  }
}

export const imageKitProvider = new ImageKitStorageProvider();
