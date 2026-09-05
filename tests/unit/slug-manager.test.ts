import { describe, it, expect } from 'vitest';
import { SlugManager } from '@/core/engine/slug-manager';

describe('SlugManager Suite', () => {
  it('should sanitize raw string into URL-safe slug', () => {
    expect(SlugManager.sanitize('Eka & Rani Wedding 2026!')).toBe('eka-rani-wedding-2026');
    expect(SlugManager.sanitize('   Momen Bahagia   ')).toBe('momen-bahagia');
  });

  it('should generate default slug from groom and bride names', () => {
    expect(SlugManager.generateDefault('Eka Pratama', 'Rani Safitri')).toBe('eka-dan-rani');
  });

  it('should resolve slug conflict by appending unique number suffix', () => {
    const existing = new Set(['eka-dan-rani', 'eka-dan-rani-2']);
    const uniqueSlug = SlugManager.makeUnique('eka-dan-rani', existing);
    expect(uniqueSlug).toBe('eka-dan-rani-3');
  });
});
