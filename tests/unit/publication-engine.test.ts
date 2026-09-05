import { describe, it, expect } from 'vitest';
import { PublicationEngine } from '@/core/engine/publication-engine';
import { InvitationGenerator } from '@/core/engine/invitation-generator';
import '@/core/components';

describe('PublicationEngine Suite', () => {
  it('should create an immutable published snapshot for valid config', () => {
    const config = InvitationGenerator.createFromTemplate({
      groomName: 'Eka Pratama',
      brideName: 'Rani Safitri',
      eventDate: '24 Oktober 2026',
    });

    const result = PublicationEngine.createSnapshot(config, 'eka-dan-rani');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.snapshot.slug).toBe('eka-dan-rani');
      expect(result.snapshot.publishedAt).toBeDefined();
      expect(result.snapshot.config.metadata.groomName).toBe('Eka Pratama');
    }
  });

  it('should reject publication if groom name is empty', () => {
    const config = InvitationGenerator.createFromTemplate({
      groomName: 'Eka Pratama',
      brideName: 'Rani Safitri',
      eventDate: '24 Oktober 2026',
    });
    config.metadata.groomName = '';

    const result = PublicationEngine.createSnapshot(config, 'eka-dan-rani');
    expect(result.success).toBe(false);
  });
});
