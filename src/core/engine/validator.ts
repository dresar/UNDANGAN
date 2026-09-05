import { InvitationConfig } from '../domain/invitation/invitation.types';
import { InvitationConfigSchema } from '../schemas/invitation-config.schema';
import { componentRegistry } from '../registry/component-registry';

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'suggestion';
  field: string;
  message: string;
}

export interface ValidationReport {
  isValidForPublish: boolean;
  issues: ValidationIssue[];
}

export class CoreValidator {
  public static validateConfig(config: unknown): { success: boolean; data?: InvitationConfig; errors?: string[] } {
    const result = InvitationConfigSchema.safeParse(config);
    if (!result.success) {
      return {
        success: false,
        errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { success: true, data: result.data as InvitationConfig };
  }

  public static validateForPublication(config: InvitationConfig, slug: string): ValidationReport {
    const issues: ValidationIssue[] = [];

    // 1. Schema Validation
    const schemaCheck = this.validateConfig(config);
    if (!schemaCheck.success && schemaCheck.errors) {
      for (const err of schemaCheck.errors) {
        issues.push({ severity: 'error', field: 'schema', message: err });
      }
    }

    // 2. Metadata Checks
    if (!config.metadata.groomName.trim()) {
      issues.push({ severity: 'error', field: 'groomName', message: 'Nama mempelai pria wajib diisi.' });
    }
    if (!config.metadata.brideName.trim()) {
      issues.push({ severity: 'error', field: 'brideName', message: 'Nama mempelai wanita wajib diisi.' });
    }
    if (!config.metadata.eventDate.trim()) {
      issues.push({ severity: 'error', field: 'eventDate', message: 'Tanggal acara pernikahan wajib diisi.' });
    }

    // 3. Slug Validation
    if (!slug || slug.length < 3) {
      issues.push({ severity: 'error', field: 'slug', message: 'Slug URL minimal 3 karakter.' });
    }

    // 4. Section & Component Checks
    const visibleSections = config.sections.filter((s) => s.isVisible);
    if (visibleSections.length === 0) {
      issues.push({ severity: 'error', field: 'sections', message: 'Minimal harus ada 1 bagian undangan yang aktif.' });
    }

    const hasHero = visibleSections.some((s) => s.componentType === 'hero');
    if (!hasHero) {
      issues.push({ severity: 'warning', field: 'hero', message: 'Disarankan menyertakan Hero banner utama.' });
    }

    const hasEvent = visibleSections.some((s) => s.componentType === 'event');
    if (!hasEvent) {
      issues.push({ severity: 'warning', field: 'event', message: 'Informasi akad/resepsi belum ditambahkan.' });
    }

    // 5. Component Registry Check
    for (const sec of visibleSections) {
      if (!componentRegistry.has(sec.componentType)) {
        issues.push({
          severity: 'error',
          field: `sections.${sec.id}`,
          message: `Komponen "${sec.componentType}" tidak terdaftar dalam registry.`,
        });
      }
    }

    const hasErrors = issues.some((i) => i.severity === 'error');
    return {
      isValidForPublish: !hasErrors,
      issues,
    };
  }
}
