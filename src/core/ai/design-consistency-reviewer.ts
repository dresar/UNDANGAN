import { InvitationConfig } from '../domain/invitation/invitation.types';
import { themeRegistry } from '../registry/theme-registry';

export interface ConsistencyReviewReport {
  overallScore: number; // 0-100
  harmonyStatus: 'optimal' | 'acceptable' | 'needs_attention';
  feedback: Array<{
    type: 'harmony' | 'readability' | 'asset_match';
    message: string;
  }>;
}

export class DesignConsistencyReviewer {
  public static review(config: InvitationConfig): ConsistencyReviewReport {
    const theme = themeRegistry.get(config.themeId) || themeRegistry.getDefault();
    const feedback: ConsistencyReviewReport['feedback'] = [];

    // Check theme override contrast
    if (config.themeOverrides?.backgroundColor && config.themeOverrides?.primaryColor) {
      if (config.themeOverrides.backgroundColor === config.themeOverrides.primaryColor) {
        feedback.push({
          type: 'readability',
          message: 'Warna latar belakang sama dengan warna utama, teks mungkin sulit dibaca.',
        });
      }
    }

    feedback.push({
      type: 'harmony',
      message: `Tema "${theme.name}" diterapkan dengan harmonis pada ${config.sections.length} bagian undangan.`,
    });

    const isOptimal = feedback.every((f) => f.type !== 'readability');

    return {
      overallScore: isOptimal ? 95 : 75,
      harmonyStatus: isOptimal ? 'optimal' : 'acceptable',
      feedback,
    };
  }
}
