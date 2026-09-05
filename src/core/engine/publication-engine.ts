import { InvitationConfig, PublishedSnapshot } from '../domain/invitation/invitation.types';
import { CoreValidator, ValidationReport } from './validator';

export class PublicationEngine {
  public static createSnapshot(
    config: InvitationConfig,
    slug: string,
    resolvedAssets: Record<string, any> = {}
  ): { success: true; snapshot: PublishedSnapshot } | { success: false; report: ValidationReport } {
    const report = CoreValidator.validateForPublication(config, slug);
    if (!report.isValidForPublish) {
      return { success: false, report };
    }

    const snapshot: PublishedSnapshot = {
      publishedAt: new Date().toISOString(),
      version: config.version,
      slug,
      config: JSON.parse(JSON.stringify(config)),
      resolvedAssets,
    };

    return { success: true, snapshot };
  }
}
