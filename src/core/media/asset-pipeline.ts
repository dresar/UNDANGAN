import { MediaAssetEntity, AssetOrigin } from '../domain/asset/asset.types';
import { AssetSlotRequirement } from '../domain/component/component.types';
import { AssetQualityGate } from './quality-gate';
import { DerivativeBuilder } from './derivative-builder';
import { imageKitProvider } from '../../infrastructure/storage/imagekit.provider';

export interface ProcessAssetParams {
  origin: AssetOrigin;
  fileOrUrl: string;
  fileName: string;
  slotRequirement: AssetSlotRequirement;
  themeTag?: string;
  prompt?: string;
}

export class AssetPipeline {
  public static async processAndRegister(params: ProcessAssetParams): Promise<MediaAssetEntity> {
    // 1. Upload to CDN
    const uploadRes = await imageKitProvider.uploadImage({
      file: params.fileOrUrl,
      fileName: params.fileName,
      folder: `/undangan/${params.themeTag || 'general'}`,
      tags: [params.slotRequirement.visualPurpose, params.origin],
    });

    // 2. Quality Gate check
    const qualityResult = AssetQualityGate.verify(params.slotRequirement, {
      width: uploadRes.width,
      height: uploadRes.height,
      sizeBytes: uploadRes.size,
      isTransparent: params.slotRequirement.isTransparent,
    });

    // 3. Build Derivatives
    const variants = DerivativeBuilder.buildStandardDerivatives(
      uploadRes.url,
      uploadRes.width,
      uploadRes.height
    );

    const assetEntity: MediaAssetEntity = {
      id: uploadRes.fileId,
      origin: params.origin,
      status: qualityResult.passed ? 'OPTIMIZED' : 'FAILED',
      originalUrl: uploadRes.url,
      mimeType: 'image/webp',
      width: uploadRes.width,
      height: uploadRes.height,
      sizeBytes: uploadRes.size,
      aspectRatio: params.slotRequirement.aspectRatio,
      isTransparent: Boolean(params.slotRequirement.isTransparent),
      themeTag: params.themeTag,
      componentSlotTag: params.slotRequirement.slotName,
      generationPrompt: params.prompt,
      variants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return assetEntity;
  }
}
