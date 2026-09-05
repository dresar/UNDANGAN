'use client';

import React from 'react';
import { SectionConfig } from '../domain/invitation/invitation.types';
import { AnimationPersonality } from '../domain/theme/theme.types';
import { COMPONENT_MAP } from '../components';
import { AnimationWrapper } from './animation-wrapper';

interface SectionRendererProps {
  section: SectionConfig;
  resolvedAssets?: Record<string, string>;
  animationPersonality?: AnimationPersonality;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelectSection?: (sectionId: string) => void;
  onUpdateProps?: (sectionId: string, newProps: Record<string, unknown>) => void;
}

export function SectionRenderer({
  section,
  resolvedAssets,
  animationPersonality = 'elegant',
  isEditable = false,
  isSelected = false,
  onSelectSection,
  onUpdateProps,
}: SectionRendererProps) {
  if (!section.isVisible) return null;

  const ComponentToRender = COMPONENT_MAP[section.componentType];

  if (!ComponentToRender) {
    return (
      <div className="p-4 my-2 border border-dashed border-red-400 text-xs text-red-500 rounded text-center">
        Komponen tidak dikenali: {section.componentType}
      </div>
    );
  }

  // Resolve assets specific for this section
  const sectionAssets: Record<string, string> = {};
  if (section.assetSlots && resolvedAssets) {
    for (const [slot, assetKey] of Object.entries(section.assetSlots)) {
      if (resolvedAssets[assetKey]) {
        sectionAssets[slot] = resolvedAssets[assetKey];
      }
    }
  }

  return (
    <AnimationWrapper
      personality={animationPersonality}
      delay={(section.animationOverride?.delay || 0) / 1000}
      className={`w-full relative transition-all ${
        isEditable
          ? `cursor-pointer relative group/sec ${
              isSelected
                ? 'ring-2 ring-emerald-500 shadow-2xl ring-offset-2 ring-offset-slate-950 z-20'
                : 'hover:ring-1 hover:ring-emerald-500/40'
            }`
          : ''
      }`}
      onClick={(e: React.MouseEvent) => {
        if (isEditable && onSelectSection) {
          e.stopPropagation();
          onSelectSection(section.id);
        }
      }}
    >
      {isEditable && isSelected && (
        <div className="absolute top-2 left-2 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 text-slate-950 text-[10px] font-bold font-mono uppercase tracking-wider shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
          <span>{section.componentType} ({section.variant})</span>
        </div>
      )}
      <ComponentToRender
        id={section.id}
        variant={section.variant}
        props={section.props}
        assets={{ ...resolvedAssets, ...sectionAssets }}
        isEditable={isEditable}
        onUpdateProps={(updated: Record<string, unknown>) => onUpdateProps?.(section.id, updated)}
      />
    </AnimationWrapper>
  );
}

