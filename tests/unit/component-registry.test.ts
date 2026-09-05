import { describe, it, expect } from 'vitest';
import { componentRegistry } from '@/core/registry/component-registry';
import { themeRegistry } from '@/core/registry/theme-registry';
import { templateRegistry } from '@/core/registry/template-registry';
import '@/core/components'; // trigger component registration

describe('Registry Suite', () => {
  it('should have all 18 canonical components registered', () => {
    const canonicalTypes = [
      'opening',
      'hero',
      'quote',
      'couple',
      'countdown',
      'story',
      'event',
      'gallery',
      'location',
      'rsvp',
      'guestbook',
      'gift',
      'music',
      'video',
      'timeline',
      'decorative',
      'divider',
      'closing',
    ];

    for (const type of canonicalTypes) {
      expect(componentRegistry.has(type)).toBe(true);
      const meta = componentRegistry.get(type);
      expect(meta?.displayName).toBeDefined();
    }
  });

  it('should have builtin themes registered with valid color tokens', () => {
    const themes = themeRegistry.getAll();
    expect(themes.length).toBeGreaterThanOrEqual(3);

    const classic = themeRegistry.get('classic-gold');
    expect(classic).toBeDefined();
    expect(classic?.colors.primary).toBe('#D4AF37');
  });

  it('should have builtin templates registered', () => {
    const templates = templateRegistry.getAll();
    expect(templates.length).toBeGreaterThanOrEqual(2);
    expect(templateRegistry.get('cinematic-elegance')).toBeDefined();
  });
});
