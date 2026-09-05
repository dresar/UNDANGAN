'use client';

import React, { useMemo } from 'react';
import { InvitationConfig } from '../domain/invitation/invitation.types';
import { themeRegistry } from '../registry/theme-registry';
import { ThemeProvider } from './theme-provider';
import { SectionRenderer } from './section-renderer';

interface WeddingRendererProps {
  config: InvitationConfig;
  resolvedAssets?: Record<string, string>;
  isEditable?: boolean;
  selectedSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  onUpdateSectionProps?: (sectionId: string, newProps: Record<string, unknown>) => void;
}

export function WeddingRenderer({
  config,
  resolvedAssets,
  isEditable = false,
  selectedSectionId,
  onSelectSection,
  onUpdateSectionProps,
}: WeddingRendererProps) {
  const activeTheme = useMemo(() => {
    return themeRegistry.get(config.themeId) || themeRegistry.getDefault();
  }, [config.themeId]);

  // Sort sections by order
  const sortedSections = useMemo(() => {
    return [...config.sections].sort((a, b) => a.order - b.order);
  }, [config.sections]);

  return (
    <ThemeProvider theme={activeTheme} overrides={config.themeOverrides}>
      <main className="min-h-screen w-full overflow-x-hidden flex flex-col">
        {sortedSections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            resolvedAssets={resolvedAssets}
            animationPersonality={activeTheme.animationPersonality}
            isEditable={isEditable}
            isSelected={selectedSectionId === section.id}
            onSelectSection={onSelectSection}
            onUpdateProps={onUpdateSectionProps}
          />
        ))}
      </main>
    </ThemeProvider>
  );
}

