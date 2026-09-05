'use client';

import React, { useState } from 'react';
import { MailOpen } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { OpeningPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface OpeningProps {
  guestName?: string;
  salutation?: string;
  invitationText?: string;
  openButtonText?: string;
  badgeText?: string;
  backgroundImage?: string;
}

export function OpeningComponent({ props, assets, onUpdateProps }: ComponentRenderProps<OpeningProps>) {
  const parsed = OpeningPropsSchema.parse(props || {});
  const [isOpen, setIsOpen] = useState(false);

  const bgImage = assets?.hero_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';

  const handleOpen = () => {
    setIsOpen(true);
    // Trigger music autoPlay if enabled
    const audioEl = document.getElementById('wedding-audio-player') as HTMLAudioElement;
    if (audioEl) {
      audioEl.play().catch(() => {});
    }
  };

  if (isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-6 text-center transition-all duration-700 min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${parsed.backgroundImage || bgImage})` }}
      />
      <div className="relative z-10 max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-500 py-12">
        {parsed.badgeText && (
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest uppercase font-medium bg-primary/10 text-primary border border-primary/20">
            {parsed.badgeText}
          </span>
        )}
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {parsed.salutation}
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground font-semibold">
          {parsed.guestName || 'Tamu Undangan'}
        </h1>
        <p className="text-sm text-foreground/80 leading-relaxed font-sans">
          {parsed.invitationText}
        </p>
        <button
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MailOpen className="w-4 h-4" />
          <span>{parsed.openButtonText || 'Buka Undangan'}</span>
        </button>
      </div>
    </div>
  );
}

componentRegistry.register<OpeningProps>({
  type: 'opening',
  displayName: 'Opening Gate / Cover',
  category: 'header',
  description: 'Halaman pembuka interaktif sebelum masuk ke isi undangan.',
  supportedVariants: [
    { id: 'fullscreen_card', name: 'Fullscreen Card' },
    { id: 'minimal_overlay', name: 'Minimal Overlay' },
  ],
  defaultVariant: 'fullscreen_card',
  assetSlots: [
    {
      slotName: 'hero_photo',
      visualPurpose: 'hero_photo',
      aspectRatio: '9:16',
      recommendedMinWidth: 1080,
      recommendedMinHeight: 1920,
    },
  ],
  defaultProps: {
    salutation: 'Kepada Yth. Bapak/Ibu/Saudara/i',
    invitationText: 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam momen istimewa kami.',
    openButtonText: 'Buka Undangan',
    badgeText: 'Pernikahan Impian',
  },
  responsiveBehavior: { mobileStack: true },
});
