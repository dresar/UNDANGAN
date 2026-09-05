'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Music as MusicIcon, Volume2, VolumeX } from 'lucide-react';
import { ComponentRenderProps } from '../../domain/component/component.types';
import { MusicPropsSchema } from '../../schemas/component-props.schema';
import { componentRegistry } from '../../registry/component-registry';

export interface MusicProps {
  title?: string;
  artist?: string;
  audioUrl?: string;
  autoPlay?: boolean;
  floatingButton?: boolean;
}

export function MusicComponent({ props }: ComponentRenderProps<MusicProps>) {
  const parsed = MusicPropsSchema.parse(props || {});
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = parsed.audioUrl || 'https://actions.google.com/sounds/v1/ambiences/romantic_wind_chimes.ogg';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        id="wedding-audio-player"
        ref={audioRef}
        src={audioSrc}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {parsed.floatingButton && (
        <button
          onClick={togglePlay}
          aria-label="Toggle Music"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 opacity-70" />
          )}
        </button>
      )}
    </>
  );
}

componentRegistry.register<MusicProps>({
  type: 'music',
  displayName: 'Pemutar Musik (Music Player)',
  category: 'utility',
  description: 'Background audio music player dengan tombol mengambang interaktif.',
  supportedVariants: [
    { id: 'floating_player', name: 'Floating Button Player' },
  ],
  defaultVariant: 'floating_player',
  assetSlots: [
    {
      slotName: 'audio_track',
      visualPurpose: 'audio_track',
      aspectRatio: 'custom',
      recommendedMinWidth: 0,
      recommendedMinHeight: 0,
    },
  ],
  defaultProps: {
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/romantic_wind_chimes.ogg',
    autoPlay: true,
    floatingButton: true,
  },
  responsiveBehavior: { mobileStack: false },
});
