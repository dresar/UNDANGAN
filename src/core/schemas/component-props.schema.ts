import { z } from 'zod';

export const OpeningPropsSchema = z.object({
  guestName: z.string().optional(),
  salutation: z.string().default('Kepada Yth. Bapak/Ibu/Saudara/i'),
  invitationText: z.string().default('Kami mengundang Anda untuk merayakan pernikahan kami'),
  openButtonText: z.string().default('Buka Undangan'),
  badgeText: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const HeroPropsSchema = z.object({
  title: z.string().default('The Wedding Of'),
  groomNickname: z.string().default('Eka'),
  brideNickname: z.string().default('Rani'),
  eventDate: z.string().default('24 Oktober 2026'),
  venueCity: z.string().optional(),
  tagline: z.string().optional(),
  heroImage: z.string().optional(),
  backgroundImage: z.string().optional(),
  overlayOpacity: z.number().min(0).max(100).default(40),
});

export const CouplePropsSchema = z.object({
  heading: z.string().default('Mempelai'),
  subheading: z.string().optional(),
  groom: z.object({
    fullName: z.string().default('Eka Pratama, S.T.'),
    bio: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    instagramHandle: z.string().optional(),
  }).default({ fullName: 'Eka Pratama, S.T.' }),
  bride: z.object({
    fullName: z.string().default('Rani Safitri, S.Ds.'),
    bio: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    instagramHandle: z.string().optional(),
  }).default({ fullName: 'Rani Safitri, S.Ds.' }),
});

export const CountdownPropsSchema = z.object({
  targetDate: z.string().default('2026-10-24T09:00:00'),
  heading: z.string().default('Menghitung Hari Bahagia'),
  subheading: z.string().optional(),
  calendarButtonText: z.string().default('Simpan ke Kalender'),
});

export const StoryPropsSchema = z.object({
  heading: z.string().default('Kisah Cinta Kami'),
  subheading: z.string().optional(),
  milestones: z.array(z.object({
    year: z.string().default('2024'),
    title: z.string().default('Awal Bertemu'),
    description: z.string().default('Kisah kami dimulai dari pertemuan yang tak terduga.'),
    date: z.string().optional(),
  })).default([]),
});

export const EventPropsSchema = z.object({
  heading: z.string().default('Rangkaian Acara'),
  subheading: z.string().optional(),
  events: z.array(z.object({
    title: z.string().default('Akad Nikah'),
    dateText: z.string().default('Sabtu, 24 Oktober 2026'),
    timeText: z.string().default('08:00 - 10:00 WIB'),
    venueName: z.string().default('Grand Ballroom Hotel'),
    venueAddress: z.string().default('Jl. Sudirman No. 1, Jakarta Pusat'),
    mapsUrl: z.string().optional(),
    notes: z.string().optional(),
  })).default([]),
});

export const GalleryPropsSchema = z.object({
  heading: z.string().default('Momen Bahagia'),
  subheading: z.string().optional(),
  layout: z.enum(['grid', 'masonry', 'carousel', 'polaroid']).default('grid'),
  items: z.array(z.object({
    id: z.string(),
    url: z.string(),
    caption: z.string().optional(),
  })).default([]),
});

export const LocationPropsSchema = z.object({
  heading: z.string().default('Lokasi Acara'),
  venueName: z.string().default('Grand Ballroom Hotel'),
  address: z.string().default('Jl. Sudirman No. 1, Jakarta Pusat'),
  city: z.string().optional(),
  googleMapsEmbedUrl: z.string().optional(),
  googleMapsLink: z.string().optional(),
});

export const RsvpPropsSchema = z.object({
  heading: z.string().default('Konfirmasi Kehadiran'),
  subheading: z.string().default('Mohon konfirmasi kehadiran Anda demi kelancaran acara'),
  allowGuestCount: z.boolean().default(true),
  maxGuestCount: z.number().int().positive().default(2),
});

export const GuestbookPropsSchema = z.object({
  heading: z.string().default('Ucapan & Doa'),
  subheading: z.string().default('Tinggalkan pesan cinta dan doa restu untuk kedua mempelai'),
  pageSize: z.number().int().positive().default(5),
});

export const GiftPropsSchema = z.object({
  heading: z.string().default('Tanda Kasih (Wedding Gift)'),
  subheading: z.string().optional(),
  bankAccounts: z.array(z.object({
    bankName: z.string(),
    accountNumber: z.string(),
    accountHolder: z.string(),
    qrCodeUrl: z.string().optional(),
  })).default([]),
  physicalAddress: z.object({
    recipient: z.string(),
    address: z.string(),
    phone: z.string().optional(),
  }).optional(),
});

export const MusicPropsSchema = z.object({
  title: z.string().default('Wedding Soundtrack'),
  artist: z.string().optional(),
  audioUrl: z.string().optional(),
  autoPlay: z.boolean().default(false),
  floatingButton: z.boolean().default(true),
});

export const VideoPropsSchema = z.object({
  heading: z.string().default('Video Pernikahan'),
  videoUrl: z.string().default('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  provider: z.enum(['youtube', 'vimeo', 'direct']).default('youtube'),
});

export const QuotePropsSchema = z.object({
  quoteText: z.string().default('Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.'),
  source: z.string().default('QS. Ar-Rum: 21'),
  arabicText: z.string().optional(),
});

export const TimelinePropsSchema = z.object({
  heading: z.string().default('Jadwal Acara'),
  items: z.array(z.object({
    time: z.string().default('08:00 WIB'),
    activity: z.string().default('Akad Nikah'),
    description: z.string().optional(),
  })).default([]),
});

export const DecorativePropsSchema = z.object({
  ornamentStyle: z.enum(['floral', 'geometric', 'vintage', 'botanical']).default('floral'),
  placement: z.enum(['top', 'bottom', 'both', 'floating']).default('top'),
});

export const DividerPropsSchema = z.object({
  style: z.enum(['line', 'dots', 'ornamental', 'space']).default('ornamental'),
});

export const ClosingPropsSchema = z.object({
  message: z.string().default('Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'),
  groomFamily: z.string().optional(),
  brideFamily: z.string().optional(),
  footerNote: z.string().default('Eka & Rani'),
});

