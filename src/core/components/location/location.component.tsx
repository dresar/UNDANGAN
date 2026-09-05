'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { LocationPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface LocationProps {
  heading?: string;
  venueName: string;
  address: string;
  city?: string;
  googleMapsEmbedUrl?: string;
  googleMapsLink?: string;
}

export function LocationComponent({ props }: ComponentRenderProps<LocationProps>) {
  const parsed = LocationPropsSchema.parse(props || {});
  const embedUrl = parsed.googleMapsEmbedUrl || 'https://maps.google.com/maps?q=Hotel+Mulia+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed';
  const mapsLink = parsed.googleMapsLink || 'https://maps.google.com/?q=Hotel+Mulia+Jakarta';

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto space-y-10 text-center">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Venue Location
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        <div className="space-y-1">
          <p className="text-lg font-serif font-medium text-foreground">{parsed.venueName}</p>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto">{parsed.address}</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-lg bg-surface">
        <iframe
          src={embedUrl}
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Wedding Venue Map"
        />
      </div>

      <div>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
        >
          <Navigation className="w-4 h-4" />
          <span>Buka di Aplikasi Google Maps</span>
        </a>
      </div>
    </section>
  );
}

componentRegistry.register<LocationProps>({
  type: 'location',
  displayName: 'Lokasi & Peta (Venue Map)',
  category: 'event',
  description: 'Peta lokasi venue pernikahan dan navigasi GPS.',
  supportedVariants: [
    { id: 'embedded_map', name: 'Embedded Google Map' },
    { id: 'minimal_pin', name: 'Minimal Pin Card' },
  ],
  defaultVariant: 'embedded_map',
  assetSlots: [],
  defaultProps: {
    heading: 'Lokasi Resepsi',
    venueName: 'Grand Ballroom Hotel Mulia',
    address: 'Jl. Asia Afrika Senayan, Gelora, Tanah Abang, Jakarta Pusat',
    city: 'Jakarta Pusat',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Hotel+Mulia+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsLink: 'https://maps.google.com/?q=Hotel+Mulia+Jakarta',
  },
  responsiveBehavior: { mobileStack: true },
});
