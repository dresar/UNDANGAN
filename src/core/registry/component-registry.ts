import { ComponentMetadata } from '../domain/component/component.types';

export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components = new Map<string, ComponentMetadata>();

  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  public register<TProps>(metadata: ComponentMetadata<TProps>): void {
    this.components.set(metadata.type, metadata as unknown as ComponentMetadata);
  }

  public get(type: string): ComponentMetadata | undefined {
    return this.components.get(type);
  }

  public getAll(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  public has(type: string): boolean {
    return this.components.has(type);
  }

  public getAssetSlotsForComponent(type: string) {
    const component = this.get(type);
    return component?.assetSlots || [];
  }
}

export const componentRegistry = ComponentRegistry.getInstance();
