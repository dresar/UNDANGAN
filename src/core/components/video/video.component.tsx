'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { VideoPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface VideoProps {
  heading?: string;
  videoUrl: string;
  provider?: 'youtube' | 'vimeo' | 'direct';
}

export function VideoComponent({ props }: ComponentRenderProps<VideoProps>) {
  const parsed = VideoPropsSchema.parse(props || {});

  // Extract YouTube embed ID if youtube URL
  let embedSrc = parsed.videoUrl;
  if (parsed.videoUrl.includes('youtube.com/watch?v=')) {
    const videoId = parsed.videoUrl.split('v=')[1]?.split('&')[0];
    embedSrc = `https://www.youtube.com/embed/${videoId}`;
  } else if (parsed.videoUrl.includes('youtu.be/')) {
    const videoId = parsed.videoUrl.split('youtu.be/')[1]?.split('?')[0];
    embedSrc = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto space-y-8 text-center">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Cinematic Moment
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-primary/20 bg-black">
        <iframe
          src={embedSrc}
          title="Wedding Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

componentRegistry.register<VideoProps>({
  type: 'video',
  displayName: 'Video Pre-Wedding',
  category: 'media',
  description: 'Pemutar video pre-wedding YouTube atau direct video.',
  supportedVariants: [
    { id: 'responsive_embed', name: 'Responsive 16:9 Embed' },
  ],
  defaultVariant: 'responsive_embed',
  assetSlots: [],
  defaultProps: {
    heading: 'Video Pre-Wedding',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    provider: 'youtube',
  },
  responsiveBehavior: { mobileStack: true },
});
