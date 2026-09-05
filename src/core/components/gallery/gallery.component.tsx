'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { GalleryPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface GalleryProps {
  heading?: string;
  subheading?: string;
  layout?: 'grid' | 'masonry' | 'carousel' | 'polaroid';
  items?: Array<{ id: string; url: string; caption?: string }>;
}

export function GalleryComponent({ props, assets }: ComponentRenderProps<GalleryProps>) {
  const parsed = GalleryPropsSchema.parse(props || {});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultImages = [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
  ];

  const galleryItems = parsed.items && parsed.items.length > 0
    ? parsed.items.map((i) => i.url)
    : defaultImages;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto space-y-12 text-center">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold font-sans">
          Memories
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground">{parsed.heading}</h2>
        {parsed.subheading && <p className="text-sm text-muted-foreground font-sans">{parsed.subheading}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {galleryItems.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(url)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-muted"
          >
            <img
              src={url}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
}

componentRegistry.register<GalleryProps>({
  type: 'gallery',
  displayName: 'Galeri Foto (Photo Gallery)',
  category: 'media',
  description: 'Galeri foto momen prewedding interaktif dengan modal preview.',
  supportedVariants: [
    { id: 'grid', name: 'Responsive Grid' },
    { id: 'masonry', name: 'Masonry Collage' },
    { id: 'polaroid', name: 'Polaroid Style' },
  ],
  defaultVariant: 'grid',
  assetSlots: [
    {
      slotName: 'gallery_photo_1',
      visualPurpose: 'gallery_photo',
      aspectRatio: '1:1',
      recommendedMinWidth: 800,
      recommendedMinHeight: 800,
    },
    {
      slotName: 'gallery_photo_2',
      visualPurpose: 'gallery_photo',
      aspectRatio: '1:1',
      recommendedMinWidth: 800,
      recommendedMinHeight: 800,
    },
  ],
  defaultProps: {
    heading: 'Galeri Momen Bahagia',
    subheading: 'Potret perjalanan cinta kami yang terekam dalam bingkai kenangan abadi.',
    layout: 'grid',
    items: [],
  },
  responsiveBehavior: { mobileStack: false },
});
