// Import all components to ensure they auto-register into componentRegistry
export * from './opening/opening.component';
export * from './hero/hero.component';
export * from './quote/quote.component';
export * from './couple/couple.component';
export * from './countdown/countdown.component';
export * from './story/story.component';
export * from './event/event.component';
export * from './gallery/gallery.component';
export * from './location/location.component';
export * from './rsvp/rsvp.component';
export * from './guestbook/guestbook.component';
export * from './gift/gift.component';
export * from './music/music.component';
export * from './video/video.component';
export * from './timeline/timeline.component';
export * from './decorative/decorative.component';
export * from './divider/divider.component';
export * from './closing/closing.component';

import { OpeningComponent } from './opening/opening.component';
import { HeroComponent } from './hero/hero.component';
import { QuoteComponent } from './quote/quote.component';
import { CoupleComponent } from './couple/couple.component';
import { CountdownComponent } from './countdown/countdown.component';
import { StoryComponent } from './story/story.component';
import { EventComponent } from './event/event.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LocationComponent } from './location/location.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { GuestbookComponent } from './guestbook/guestbook.component';
import { GiftComponent } from './gift/gift.component';
import { MusicComponent } from './music/music.component';
import { VideoComponent } from './video/video.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DecorativeComponent } from './decorative/decorative.component';
import { DividerComponent } from './divider/divider.component';
import { ClosingComponent } from './closing/closing.component';

export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  opening: OpeningComponent,
  hero: HeroComponent,
  quote: QuoteComponent,
  couple: CoupleComponent,
  countdown: CountdownComponent,
  story: StoryComponent,
  event: EventComponent,
  gallery: GalleryComponent,
  location: LocationComponent,
  rsvp: RsvpComponent,
  guestbook: GuestbookComponent,
  gift: GiftComponent,
  music: MusicComponent,
  video: VideoComponent,
  timeline: TimelineComponent,
  decorative: DecorativeComponent,
  divider: DividerComponent,
  closing: ClosingComponent,
};
