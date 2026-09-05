import { InvitationConfig } from '../domain/invitation/invitation.types';
import { templateRegistry } from '../registry/template-registry';
import { themeRegistry } from '../registry/theme-registry';
import { componentRegistry } from '../registry/component-registry';

export interface GeneratorInitialParams {
  groomName: string;
  brideName: string;
  eventDate: string;
  templateId?: string;
  themeId?: string;
  city?: string;
  customTagline?: string;
}

export class InvitationGenerator {
  public static createFromTemplate(params: GeneratorInitialParams): InvitationConfig {
    const template = templateRegistry.get(params.templateId || '') || templateRegistry.getDefault();
    const theme = themeRegistry.get(params.themeId || '') || themeRegistry.getDefault();

    const sections = template.defaultSections.map((secDef, idx) => {
      const compMeta = componentRegistry.get(secDef.componentType);
      const defaultProps: Record<string, any> = compMeta ? { ...(compMeta.defaultProps as Record<string, any>) } : {};

      // Custom prop injections for hero & couple
      if (secDef.componentType === 'hero') {
        Object.assign(defaultProps, {
          groomNickname: params.groomName.split(' ')[0],
          brideNickname: params.brideName.split(' ')[0],
          eventDate: params.eventDate,
          venueCity: params.city || 'Jakarta, Indonesia',
          tagline: params.customTagline || defaultProps.tagline,
        });
      } else if (secDef.componentType === 'couple') {
        const existingGroom = (defaultProps.groom && typeof defaultProps.groom === 'object') ? defaultProps.groom : {};
        const existingBride = (defaultProps.bride && typeof defaultProps.bride === 'object') ? defaultProps.bride : {};
        Object.assign(defaultProps, {
          groom: {
            ...existingGroom,
            fullName: params.groomName,
          },
          bride: {
            ...existingBride,
            fullName: params.brideName,
          },
        });
      }

      return {
        id: `sec-${secDef.componentType}-${Date.now()}-${idx}`,
        componentType: secDef.componentType,
        variant: secDef.defaultVariant,
        order: secDef.defaultOrder,
        isVisible: true,
        props: defaultProps,
      };
    });

    return {
      version: 1,
      metadata: {
        title: `Undangan Pernikahan ${params.groomName} & ${params.brideName}`,
        description: `Momen bahagia pernikahan ${params.groomName} & ${params.brideName}`,
        groomName: params.groomName,
        brideName: params.brideName,
        eventDate: params.eventDate,
        locationCity: params.city,
        themeId: theme.id,
        templateId: template.id,
        schemaVersion: 1,
      },
      themeId: theme.id,
      templateId: template.id,
      sections,
      musicConfig: {
        enabled: true,
        autoPlay: true,
        title: 'Wedding Melody',
      },
      seoConfig: {
        metaTitle: `Pernikahan ${params.groomName} & ${params.brideName}`,
        metaDescription: `Undangan digital resmi pernikahan ${params.groomName} & ${params.brideName}`,
      },
    };
  }
}
