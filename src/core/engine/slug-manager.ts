export class SlugManager {
  public static sanitize(raw: string): string {
    return raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);
  }

  public static generateDefault(groomName: string, brideName: string): string {
    const groomClean = this.sanitize(groomName.split(' ')[0] || 'groom');
    const brideClean = this.sanitize(brideName.split(' ')[0] || 'bride');
    return `${groomClean}-dan-${brideClean}`;
  }

  public static makeUnique(baseSlug: string, existingSlugs: Set<string>): string {
    let candidate = this.sanitize(baseSlug);
    if (!existingSlugs.has(candidate)) return candidate;

    let counter = 2;
    while (existingSlugs.has(`${candidate}-${counter}`)) {
      counter++;
    }
    return `${candidate}-${counter}`;
  }
}
