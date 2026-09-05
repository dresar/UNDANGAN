import { MediaVariantInfo } from '../domain/asset/asset.types';
import { imageKitProvider } from '../../infrastructure/storage/imagekit.provider';

export class DerivativeBuilder {
  public static buildStandardDerivatives(originalUrl: string, baseWidth: number, baseHeight: number): MediaVariantInfo[] {
    const aspectRatio = baseHeight > 0 ? baseWidth / baseHeight : 1;

    // Thumbnail: 300px width
    const thumbWidth = 300;
    const thumbHeight = Math.round(thumbWidth / aspectRatio);
    const thumbUrl = imageKitProvider.getResponsiveUrl(originalUrl, { width: thumbWidth, format: 'webp', quality: 75 });

    // Mobile: 640px width
    const mobileWidth = 640;
    const mobileHeight = Math.round(mobileWidth / aspectRatio);
    const mobileUrl = imageKitProvider.getResponsiveUrl(originalUrl, { width: mobileWidth, format: 'webp', quality: 80 });

    // Desktop: 1280px width
    const deskWidth = 1280;
    const deskHeight = Math.round(deskWidth / aspectRatio);
    const deskUrl = imageKitProvider.getResponsiveUrl(originalUrl, { width: deskWidth, format: 'webp', quality: 85 });

    return [
      {
        variantType: 'thumbnail',
        url: thumbUrl,
        format: 'webp',
        width: thumbWidth,
        height: thumbHeight,
        sizeBytes: Math.round(thumbWidth * thumbHeight * 0.15),
      },
      {
        variantType: 'mobile',
        url: mobileUrl,
        format: 'webp',
        width: mobileWidth,
        height: mobileHeight,
        sizeBytes: Math.round(mobileWidth * mobileHeight * 0.18),
      },
      {
        variantType: 'desktop',
        url: deskUrl,
        format: 'webp',
        width: deskWidth,
        height: deskHeight,
        sizeBytes: Math.round(deskWidth * deskHeight * 0.2),
      },
    ];
  }
}
