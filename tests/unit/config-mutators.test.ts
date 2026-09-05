import { describe, it, expect } from 'vitest';
import { ConfigMutators } from '@/core/editor/config-mutators';
import { InvitationGenerator } from '@/core/engine/invitation-generator';
import '@/core/components';

describe('ConfigMutators Suite', () => {
  it('should update section props without mutating original', () => {
    const config = InvitationGenerator.createFromTemplate({
      groomName: 'Eka',
      brideName: 'Rani',
      eventDate: '24 Okt 2026',
    });

    const heroSection = config.sections.find((s) => s.componentType === 'hero')!;
    const updated = ConfigMutators.updateSectionProps(config, heroSection.id, {
      tagline: 'Momen Indah Abadi',
    });

    const updatedHero = updated.sections.find((s) => s.id === heroSection.id)!;
    expect(updatedHero.props.tagline).toBe('Momen Indah Abadi');
    expect(heroSection.props.tagline).not.toBe('Momen Indah Abadi');
  });

  it('should reorder sections correctly', () => {
    const config = InvitationGenerator.createFromTemplate({
      groomName: 'Eka',
      brideName: 'Rani',
      eventDate: '24 Okt 2026',
    });

    const firstSectionId = config.sections[0].id;
    const reordered = ConfigMutators.reorderSections(config, 0, 1);
    expect(reordered.sections[1].id).toBe(firstSectionId);
  });
});
