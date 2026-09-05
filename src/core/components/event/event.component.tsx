'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { EventPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface EventProps {
  heading?: string;
  subheading?: string;
  events: Array<{
    title: string;
    dateText: string;
    timeText: string;
    venueName: string;
    venueAddress: string;
    mapsUrl?: string;
    notes?: string;
  }>;
}

export function EventComponent({ props }: ComponentRenderProps<EventProps>) {
  const parsed = EventPropsSchema.parse(props || {});

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto space-y-12 text-center">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Wedding Events
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {parsed.events.map((evt, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-surface border border-primary/20 shadow-md space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-semibold text-primary border-b border-primary/20 pb-3">
                {evt.title}
              </h3>
              <div className="space-y-2.5 text-sm font-sans text-foreground/80">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>{evt.dateText}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{evt.timeText}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{evt.venueName}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{evt.venueAddress}</p>
                  </div>
                </div>
              </div>
              {evt.notes && (
                <p className="text-xs italic text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                  {evt.notes}
                </p>
              )}
            </div>

            {evt.mapsUrl && (
              <a
                href={evt.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah (Google Maps)</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

componentRegistry.register<EventProps>({
  type: 'event',
  displayName: 'Rangkaian Acara (Events)',
  category: 'event',
  description: 'Informasi detail jadwal akad nikah dan resepsi.',
  supportedVariants: [
    { id: 'cards_side_by_side', name: 'Cards Side by Side' },
    { id: 'clean_schedule', name: 'Clean Minimal Schedule' },
  ],
  defaultVariant: 'cards_side_by_side',
  assetSlots: [],
  defaultProps: {
    heading: 'Rangkaian Acara',
    subheading: 'Dengan penuh sukacita, kami mengundang Anda untuk hadir dalam setiap momen sakral kami:',
    events: [
      {
        title: 'Akad Nikah',
        dateText: 'Sabtu, 24 Oktober 2026',
        timeText: '08:00 - 10:00 WIB',
        venueName: 'Masjid Agung Al-Barkah',
        venueAddress: 'Jl. Veteran No. 1, Jakarta Pusat',
        mapsUrl: 'https://maps.google.com',
        notes: 'Khusus untuk keluarga inti & kerabat dekat.',
      },
      {
        title: 'Resepsi Pernikahan',
        dateText: 'Sabtu, 24 Oktober 2026',
        timeText: '11:00 - 14:00 WIB',
        venueName: 'Grand Ballroom Hotel Mulia',
        venueAddress: 'Jl. Asia Afrika Senayan, Gelora, Jakarta Pusat',
        mapsUrl: 'https://maps.google.com',
        notes: 'Diharapkan hadir tepat waktu sesuai protokol.',
      },
    ],
  },
  responsiveBehavior: { mobileStack: true },
});
