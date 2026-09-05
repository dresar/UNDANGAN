'use client';

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { HeroPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface HeroProps {
  title?: string;
  groomNickname: string;
  brideNickname: string;
  eventDate: string;
  venueCity?: string;
  tagline?: string;
  overlayOpacity?: number;
}

export function HeroComponent({ props, assets, variant }: ComponentRenderProps<HeroProps>) {
  const parsed = HeroPropsSchema.parse(props || {});
  const heroImage = (props as any)?.heroImage || (props as any)?.backgroundImage || assets?.hero_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop';
  const opacity = (parsed.overlayOpacity ?? 40) / 100;

  if (variant === 'editorial') {
    return (
      <section className="relative min-h-[90vh] flex flex-col justify-end p-8 sm:p-12 overflow-hidden bg-background text-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="text-sm font-sans uppercase tracking-widest text-primary font-medium">{parsed.title}</p>
          <h1 className="text-5xl sm:text-7xl font-serif tracking-tight font-normal">
            {parsed.groomNickname} <span className="text-primary font-script text-6xl sm:text-8xl">&</span> {parsed.brideNickname}
          </h1>
          {parsed.tagline && <p className="text-base text-foreground/80 italic font-serif">{parsed.tagline}</p>}
          <div className="flex flex-wrap gap-4 text-sm font-sans pt-2 text-foreground/90">
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {parsed.eventDate}</span>
            {parsed.venueCity && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {parsed.venueCity}</span>}
          </div>
        </div>
      </section>
    );
  }

  // Default / Cinematic variant
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity }}
      />
      <div className="relative z-10 max-w-xl space-y-6 animate-in fade-in duration-700">
        <p className="text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-white/90 font-medium">
          {parsed.title}
        </p>
        <h1 className="text-5xl sm:text-7xl font-serif text-white font-normal drop-shadow-md">
          {parsed.groomNickname}
          <span className="block text-4xl sm:text-6xl my-1 font-script text-primary-foreground">&</span>
          {parsed.brideNickname}
        </h1>
        {parsed.tagline && (
          <p className="text-sm sm:text-base text-white/80 font-sans italic max-w-md mx-auto">
            {parsed.tagline}
          </p>
        )}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-sans">
          <Calendar className="w-4 h-4" />
          <span>{parsed.eventDate}</span>
          {parsed.venueCity && <span>� {parsed.venueCity}</span>}
        </div>
      </div>
    </section>
  );
}

componentRegistry.register<HeroProps>({
  type: 'hero',
  displayName: 'Hero Banner',
  category: 'header',
  description: 'Banner utama nama pasangan pengantin dan tanggal pernikahan.',
  supportedVariants: [
    { id: 'cinematic', name: 'Cinematic Fullscreen' },
    { id: 'editorial', name: 'Editorial Magazine' },
    { id: 'minimal', name: 'Minimal Centered' },
  ],
  defaultVariant: 'cinematic',
  assetSlots: [
    {
      slotName: 'hero_photo',
      visualPurpose: 'hero_photo',
      aspectRatio: '16:9',
      recommendedMinWidth: 1920,
      recommendedMinHeight: 1080,
      hasTextOverlay: true,
    },
  ],
  defaultProps: {
    title: 'The Wedding Of',
    groomNickname: 'Eka',
    brideNickname: 'Rani',
    eventDate: 'Sabtu, 24 Oktober 2026',
    venueCity: 'Jakarta, Indonesia',
    tagline: 'Dua hati yang bersatu dalam ikatan suci cinta abadi.',
    overlayOpacity: 45,
  },
  responsiveBehavior: { mobileStack: true },
});
