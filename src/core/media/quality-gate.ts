import { AssetSlotRequirement } from '../domain/component/component.types';

export interface QualityGateResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export class AssetQualityGate {
  public static verify(
    slot: AssetSlotRequirement,
    media: { width: number; height: number; sizeBytes: number; isTransparent?: boolean; mimeType?: string }
  ): QualityGateResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Min Width / Height check
    if (media.width < slot.recommendedMinWidth) {
      warnings.push(`Lebar gambar (${media.width}px) di bawah rekomendasi (${slot.recommendedMinWidth}px).`);
    }
    if (media.height < slot.recommendedMinHeight) {
      warnings.push(`Tinggi gambar (${media.height}px) di bawah rekomendasi (${slot.recommendedMinHeight}px).`);
    }

    // 2. Max File Size (Performance budget: max 5MB before compression)
    const maxAllowedBytes = slot.maxSizeBytes || 5 * 1024 * 1024;
    if (media.sizeBytes > maxAllowedBytes) {
      errors.push(`Ukuran berkas melebihi batas yang diizinkan (${Math.round(maxAllowedBytes / 1024 / 1024)}MB).`);
    }

    // 3. Transparency expectation
    if (slot.isTransparent && !media.isTransparent) {
      warnings.push(`Komponen membutuhkan asset transparan (PNG/WebP dengan alpha channel).`);
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings,
    };
  }
}
