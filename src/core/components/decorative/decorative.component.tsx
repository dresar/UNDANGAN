'use client';

import React from 'react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { DecorativePropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface DecorativeProps {
  ornamentStyle?: 'floral' | 'geometric' | 'vintage' | 'botanical';
  placement?: 'top' | 'bottom' | 'both' | 'floating';
}

export function DecorativeComponent({ props, assets }: ComponentRenderProps<DecorativeProps>) {
  const parsed = DecorativePropsSchema.parse(props || {});
  const ornamentUrl = assets?.ornament || 'https://placehold.co/600x150/transparent/D4AF37?text=Floral+Accent';

  return (
    <div className="w-full flex justify-center py-6 overflow-hidden select-none pointer-events-none opacity-80">
      <img src={ornamentUrl} alt="Decorative Ornament" className="max-w-xs sm:max-w-md object-contain" />
    </div>
  );
}

componentRegistry.register<DecorativeProps>({
  type: 'decorative',
  displayName: 'Ornamen Dekoratif (Decorative Accent)',
  category: 'decorative',
  description: 'Ornamen transparan pelengkap estetika tema undangan.',
  supportedVariants: [
    { id: 'accent_ornament', name: 'Floral Accent Ornament' },
  ],
  defaultVariant: 'accent_ornament',
  assetSlots: [
    {
      slotName: 'ornament',
      visualPurpose: 'decorative_accent',
      aspectRatio: 'custom',
      isTransparent: true,
      recommendedMinWidth: 400,
      recommendedMinHeight: 150,
    },
  ],
  defaultProps: {
    ornamentStyle: 'floral',
    placement: 'top',
  },
  responsiveBehavior: { mobileStack: false },
});
