'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { StoryPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface StoryProps {
  heading?: string;
  subheading?: string;
  milestones: Array<{
    year: string;
    title: string;
    description: string;
    date?: string;
  }>;
}

export function StoryComponent({ props }: ComponentRenderProps<StoryProps>) {
  const parsed = StoryPropsSchema.parse(props || {});

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Our Journey
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
        {parsed.milestones.map((milestone, idx) => (
          <div key={idx} className="relative space-y-2 group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Heart className="w-3 h-3 fill-current" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary">
              {milestone.year} {milestone.date ? `� ${milestone.date}` : ''}
            </span>
            <h3 className="text-lg font-serif font-medium text-foreground">{milestone.title}</h3>
            <p className="text-sm text-foreground/80 font-sans leading-relaxed">{milestone.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

componentRegistry.register<StoryProps>({
  type: 'story',
  displayName: 'Love Story / Perjalanan Cinta',
  category: 'engagement',
  description: 'Timeline kisah cinta dan momen berharga pasangan.',
  supportedVariants: [
    { id: 'vertical_timeline', name: 'Vertical Timeline' },
    { id: 'chapter_layout', name: 'Editorial Chapter Layout' },
  ],
  defaultVariant: 'vertical_timeline',
  assetSlots: [
    {
      slotName: 'story_photo_1',
      visualPurpose: 'gallery_photo',
      aspectRatio: '4:5',
      recommendedMinWidth: 800,
      recommendedMinHeight: 1000,
    },
  ],
  defaultProps: {
    heading: 'Kisah Perjalanan Cinta Kami',
    subheading: 'Setiap kisah cinta memiliki jalan ceritanya masing-masing yang istimewa.',
    milestones: [
      {
        year: '2021',
        title: 'Pertama Kali Bertemu',
        description: 'Kami dipertemukan dalam sebuah seminar teknologi di Jakarta. Dari sapaan sederhana bermula obrolan yang hangat.',
      },
      {
        year: '2024',
        title: 'Komitmen & Lamaran',
        description: 'Setelah saling mengenal dan melewati berbagai momen berharga, kami memutuskan melangkah ke jenjang yang lebih serius.',
      },
      {
        year: '2026',
        title: 'Menuju Hari Bahagia',
        description: 'InsyaAllah kami akan menyatukan janji suci pernikahan untuk mengarungi bahtera rumah tangga bersama selamanya.',
      },
    ],
  },
  responsiveBehavior: { mobileStack: true },
});
