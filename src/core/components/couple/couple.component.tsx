'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { CouplePropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface CoupleProps {
  heading?: string;
  subheading?: string;
  groom: {
    fullName: string;
    bio?: string;
    fatherName?: string;
    motherName?: string;
    instagramHandle?: string;
  };
  bride: {
    fullName: string;
    bio?: string;
    fatherName?: string;
    motherName?: string;
    instagramHandle?: string;
  };
}

export function CoupleComponent({ props, assets }: ComponentRenderProps<CoupleProps>) {
  const parsed = CouplePropsSchema.parse(props || {});
  const groomPhoto = assets?.portrait_groom || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';
  const bridePhoto = assets?.portrait_bride || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop';

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-12">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Groom & Bride
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
        {/* Mempelai Pria */}
        <div className="space-y-5 flex flex-col items-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl p-1 bg-surface">
            <img src={groomPhoto} alt={parsed.groom.fullName} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-medium text-foreground">{parsed.groom.fullName}</h3>
            {parsed.groom.bio && <p className="text-xs text-muted-foreground font-sans max-w-xs">{parsed.groom.bio}</p>}
            {(parsed.groom.fatherName || parsed.groom.motherName) && (
              <p className="text-xs text-foreground/80 font-sans">
                Putra dari Bapak {parsed.groom.fatherName} & Ibu {parsed.groom.motherName}
              </p>
            )}
            {parsed.groom.instagramHandle && (
              <a
                href={`https://instagram.com/${parsed.groom.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline pt-1"
              >
                <Instagram className="w-3.5 h-3.5" /> @{parsed.groom.instagramHandle}
              </a>
            )}
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div className="space-y-5 flex flex-col items-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl p-1 bg-surface">
            <img src={bridePhoto} alt={parsed.bride.fullName} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-medium text-foreground">{parsed.bride.fullName}</h3>
            {parsed.bride.bio && <p className="text-xs text-muted-foreground font-sans max-w-xs">{parsed.bride.bio}</p>}
            {(parsed.bride.fatherName || parsed.bride.motherName) && (
              <p className="text-xs text-foreground/80 font-sans">
                Putri dari Bapak {parsed.bride.fatherName} & Ibu {parsed.bride.motherName}
              </p>
            )}
            {parsed.bride.instagramHandle && (
              <a
                href={`https://instagram.com/${parsed.bride.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline pt-1"
              >
                <Instagram className="w-3.5 h-3.5" /> @{parsed.bride.instagramHandle}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

componentRegistry.register<CoupleProps>({
  type: 'couple',
  displayName: 'Mempelai (Couple Profile)',
  category: 'couple',
  description: 'Profil lengkap kedua mempelai pengantin.',
  supportedVariants: [
    { id: 'portrait_split', name: 'Portrait Split Circles' },
    { id: 'magazine_columns', name: 'Magazine Editorial Columns' },
    { id: 'minimal_card', name: 'Minimal Card' },
  ],
  defaultVariant: 'portrait_split',
  assetSlots: [
    {
      slotName: 'portrait_groom',
      visualPurpose: 'portrait_groom',
      aspectRatio: '1:1',
      recommendedMinWidth: 800,
      recommendedMinHeight: 800,
    },
    {
      slotName: 'portrait_bride',
      visualPurpose: 'portrait_bride',
      aspectRatio: '1:1',
      recommendedMinWidth: 800,
      recommendedMinHeight: 800,
    },
  ],
  defaultProps: {
    heading: 'Kedua Mempelai',
    subheading: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
    groom: {
      fullName: 'Eka Pratama, S.T.',
      fatherName: 'Bambang Sudarmono',
      motherName: 'Sri Wahyuni',
      instagramHandle: 'ekapratama',
    },
    bride: {
      fullName: 'Rani Safitri, S.Ds.',
      fatherName: 'H. Ahmad Syarifuddin',
      motherName: 'Hj. Nurul Hidayah',
      instagramHandle: 'ranisafitri',
    },
  },
  responsiveBehavior: { mobileStack: true },
});
