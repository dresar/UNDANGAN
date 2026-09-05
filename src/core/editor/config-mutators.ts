import { InvitationConfig, SectionConfig, ThemeOverrides } from '../domain/invitation/invitation.types';
import { componentRegistry } from '../registry/component-registry';

export class ConfigMutators {
  public static updateMetadata(
    config: InvitationConfig,
    partial: Partial<InvitationConfig['metadata']>
  ): InvitationConfig {
    return {
      ...config,
      metadata: { ...config.metadata, ...partial },
    };
  }

  public static updateTheme(config: InvitationConfig, themeId: string): InvitationConfig {
    return {
      ...config,
      themeId,
      metadata: { ...config.metadata, themeId },
    };
  }

  public static updateThemeOverrides(
    config: InvitationConfig,
    overrides: Partial<ThemeOverrides>
  ): InvitationConfig {
    return {
      ...config,
      themeOverrides: { ...(config.themeOverrides || {}), ...overrides },
    };
  }

  public static updateSectionProps(
    config: InvitationConfig,
    sectionId: string,
    newProps: Record<string, unknown>
  ): InvitationConfig {
    return {
      ...config,
      sections: config.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, props: { ...sec.props, ...newProps } } : sec
      ),
    };
  }

  public static toggleSectionVisibility(config: InvitationConfig, sectionId: string): InvitationConfig {
    return {
      ...config,
      sections: config.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
    };
  }

  public static updateSectionVariant(
    config: InvitationConfig,
    sectionId: string,
    variant: string
  ): InvitationConfig {
    return {
      ...config,
      sections: config.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, variant } : sec
      ),
    };
  }

  public static reorderSections(
    config: InvitationConfig,
    sourceIndex: number,
    destinationIndex: number
  ): InvitationConfig {
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    if (sourceIndex < 0 || sourceIndex >= sorted.length || destinationIndex < 0 || destinationIndex >= sorted.length) {
      return config;
    }
    const [moved] = sorted.splice(sourceIndex, 1);
    sorted.splice(destinationIndex, 0, moved);

    const updated = sorted.map((sec, idx) => ({
      ...sec,
      order: idx,
    }));

    return {
      ...config,
      sections: updated,
    };
  }

  public static addSection(
    config: InvitationConfig,
    componentType: string,
    variant?: string
  ): InvitationConfig {
    const compDef = componentRegistry.get(componentType);
    const newId = `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSection: SectionConfig = {
      id: newId,
      componentType,
      variant: variant || compDef?.defaultVariant || 'default',
      order: config.sections.length,
      isVisible: true,
      props: compDef?.defaultProps ? JSON.parse(JSON.stringify(compDef.defaultProps)) : {},
    };

    return {
      ...config,
      sections: [...config.sections, newSection],
    };
  }

  public static removeSection(config: InvitationConfig, sectionId: string): InvitationConfig {
    const remaining = config.sections
      .filter((sec) => sec.id !== sectionId)
      .map((sec, idx) => ({ ...sec, order: idx }));

    return {
      ...config,
      sections: remaining,
    };
  }

  public static duplicateSection(config: InvitationConfig, sectionId: string): InvitationConfig {
    const target = config.sections.find((s) => s.id === sectionId);
    if (!target) return config;

    const newId = `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duplicated: SectionConfig = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      order: target.order + 1,
    };

    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const targetIdx = sorted.findIndex((s) => s.id === sectionId);
    sorted.splice(targetIdx + 1, 0, duplicated);

    return {
      ...config,
      sections: sorted.map((sec, idx) => ({ ...sec, order: idx })),
    };
  }

  public static updateMusicConfig(
    config: InvitationConfig,
    music: Partial<NonNullable<InvitationConfig['musicConfig']>>
  ): InvitationConfig {
    return {
      ...config,
      musicConfig: {
        enabled: true,
        autoPlay: false,
        title: 'Wedding Melody',
        ...(config.musicConfig || {}),
        ...music,
      },
    };
  }

  public static updateSeoConfig(
    config: InvitationConfig,
    seo: Partial<NonNullable<InvitationConfig['seoConfig']>>
  ): InvitationConfig {
    return {
      ...config,
      seoConfig: {
        metaTitle: config.metadata.title,
        metaDescription: 'Website undangan pernikahan digital resmi.',
        ...(config.seoConfig || {}),
        ...seo,
      },
    };
  }

  public static setSectionAsset(
    config: InvitationConfig,
    sectionId: string,
    slotName: string,
    assetUrl: string
  ): InvitationConfig {
    return {
      ...config,
      sections: config.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          assetSlots: {
            ...(sec.assetSlots || {}),
            [slotName]: assetUrl,
          },
        };
      }),
    };
  }
}

