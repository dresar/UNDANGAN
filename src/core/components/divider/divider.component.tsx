'use client';

import React from 'react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { DividerPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface DividerProps {
  style?: 'line' | 'dots' | 'ornamental' | 'space';
}

export function DividerComponent({ props, assets }: ComponentRenderProps<DividerProps>) {
  const parsed = DividerPropsSchema.parse(props || {});
  const dividerUrl = assets?.divider_ornament;

  if (dividerUrl) {
    return (
      <div className="w-full flex justify-center py-8 select-none pointer-events-none opacity-70">
        <img src={dividerUrl} alt="Divider" className="max-w-xs object-contain" />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-8">
      <div className="w-24 h-px bg-primary/40" />
      <div className="w-2 h-2 rounded-full bg-primary mx-3" />
      <div className="w-24 h-px bg-primary/40" />
    </div>
  );
}

componentRegistry.register<DividerProps>({
  type: 'divider',
  displayName: 'Pemisah Bagian (Divider)',
  category: 'decorative',
  description: 'Pemisah antar bagian halaman dengan aksen tema.',
  supportedVariants: [
    { id: 'ornamental', name: 'Ornamental / Dot Line' },
    { id: 'minimal_space', name: 'Clean Space' },
  ],
  defaultVariant: 'ornamental',
  assetSlots: [
    {
      slotName: 'divider_ornament',
      visualPurpose: 'divider_ornament',
      aspectRatio: 'custom',
      isTransparent: true,
      recommendedMinWidth: 600,
      recommendedMinHeight: 80,
    },
  ],
  defaultProps: {
    style: 'ornamental',
  },
  responsiveBehavior: { mobileStack: false },
});
