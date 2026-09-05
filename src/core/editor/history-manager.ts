import { InvitationConfig } from '../domain/invitation/invitation.types';

export class HistoryManager {
  private past: InvitationConfig[] = [];
  private present: InvitationConfig;
  private future: InvitationConfig[] = [];
  private maxHistory: number;

  constructor(initial: InvitationConfig, maxHistory: number = 30) {
    this.present = JSON.parse(JSON.stringify(initial));
    this.maxHistory = maxHistory;
  }

  public get current(): InvitationConfig {
    return this.present;
  }

  public push(newConfig: InvitationConfig): void {
    if (JSON.stringify(newConfig) === JSON.stringify(this.present)) return;

    this.past.push(this.present);
    if (this.past.length > this.maxHistory) {
      this.past.shift();
    }
    this.present = JSON.parse(JSON.stringify(newConfig));
    this.future = [];
  }

  public undo(): InvitationConfig | null {
    if (this.past.length === 0) return null;
    const previous = this.past.pop()!;
    this.future.unshift(this.present);
    this.present = previous;
    return this.present;
  }

  public redo(): InvitationConfig | null {
    if (this.future.length === 0) return null;
    const next = this.future.shift()!;
    this.past.push(this.present);
    this.present = next;
    return this.present;
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }
}
