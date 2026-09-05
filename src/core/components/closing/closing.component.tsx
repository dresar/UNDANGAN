'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { ClosingPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface ClosingProps {
  message?: string;
  groomFamily?: string;
  brideFamily?: string;
  footerNote?: string;
}

export function ClosingComponent({ props }: ComponentRenderProps<ClosingProps>) {
  const parsed = ClosingPropsSchema.parse(props || {});

  return (
    <footer className="py-20 px-6 bg-secondary/40 text-center space-y-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Heart className="w-6 h-6 mx-auto text-primary fill-current" />
        <p className="text-xs sm:text-sm text-foreground/80 font-sans leading-relaxed">
          {parsed.message}
        </p>

        {(parsed.groomFamily || parsed.brideFamily) && (
          <div className="pt-4 border-t border-primary/20 space-y-2 text-xs font-sans text-muted-foreground">
            <p className="font-semibold text-foreground">Keluarga Besar:</p>
            {parsed.groomFamily && <p>Keluarga {parsed.groomFamily}</p>}
            {parsed.brideFamily && <p>Keluarga {parsed.brideFamily}</p>}
          </div>
        )}

        <div className="pt-8">
          <h3 className="text-3xl sm:text-4xl font-script text-primary font-normal">
            {parsed.footerNote}
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans mt-2">
            Sampai Berjumpa di Hari Bahagia Kami
          </p>
        </div>
      </div>
    </footer>
  );
}

componentRegistry.register<ClosingProps>({
  type: 'closing',
  displayName: 'Penutup (Closing & Gratitude)',
  category: 'footer',
  description: 'Ucapan terima kasih dan tanda tangan digital keluarga mempelai.',
  supportedVariants: [
    { id: 'gratitude_note', name: 'Gratitude Note' },
    { id: 'minimal_signature', name: 'Minimal Script Signature' },
  ],
  defaultVariant: 'gratitude_note',
  assetSlots: [],
  defaultProps: {
    message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.',
    groomFamily: 'Bambang Sudarmono & Sri Wahyuni',
    brideFamily: 'H. Ahmad Syarifuddin & Hj. Nurul Hidayah',
    footerNote: 'Eka & Rani',
  },
  responsiveBehavior: { mobileStack: true },
});
