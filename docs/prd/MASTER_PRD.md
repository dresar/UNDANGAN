# BLUEPRINT ARSITEKTUR & MASTER PRD (PRODUCT REQUIREMENTS DOCUMENT)
## Platform SaaS Undangan Pernikahan Digital Berbasis Wedding Engine, JSON-Driven Architecture, & Ekosistem AI

> **Status Dokumen:** ACTIVE & OFFICIAL BLUEPRINT v3.0 (Wedding Engine First Realignment — ADR-0003)  
> **Tanggal Pembaruan:** 18 Agustus 2026  
> **Bahasa Resmi:** Bahasa Indonesia (Dokumentasi, Penjelasan, Fitur, dan Kontrak Domain)  
> **Sifat Dokumen:** Sumber Kebenaran Tunggal (*Single Source of Truth*) dan Kontrak Rekayasa Perangkat Lunak (*Engineering Blueprint*). Tidak ada implementasi kode yang boleh menyimpang dari dokumen ini.

---

## DAFTAR ISI

1. [Ringkasan Eksekutif & Realignment Prioritas](#1-ringkasan-eksekutif--realignment-prioritas)
2. [Visi, Nilai Produk, & Target Pengguna](#2-visi-nilai-produk--target-pengguna)
3. [Diferensiasi Konseptual Inti (5+1 Concept Separation)](#3-diferensiasi-konseptual-inti-51-concept-separation)
4. [Arsitektur Sistem & Prinsip Rekayasa](#4-arsitektur-sistem--prinsip-rekayasa)
5. [Spesifikasi Component Registry](#5-spesifikasi-component-registry)
6. [Spesifikasi Template Engine](#6-spesifikasi-template-engine)
7. [Spesifikasi Theme Engine & Design Tokens](#7-spesifikasi-theme-engine--design-tokens)
8. [Arsitektur Wedding Renderer](#8-arsitektur-wedding-renderer)
9. [JSON Schema & Strategi Versioning](#9-json-schema--strategi-versioning)
10. [Arsitektur Visual Editor](#10-arsitektur-visual-editor)
11. [AI Wedding Builder Architecture](#11-ai-wedding-builder-architecture)
12. [Alur Pembuatan Undangan (Create Invitation Flow)](#12-alur-pembuatan-undangan-create-invitation-flow)
13. [Arsitektur Publikasi & Manajemen Slug](#13-arsitektur-publikasi--manajemen-slug)
14. [Autentikasi, Kepemilikan, & Antarmuka Pengguna Sederhana](#14-autentikasi-kepemilikan--antarmuka-pengguna-sederhana)
15. [Model Data & Database Architecture (Neon PostgreSQL)](#15-model-data--database-architecture-neon-postgresql)
16. [Strategi Caching & Redis (Upstash)](#16-strategi-caching--redis-upstash)
17. [Media, Aset, & Optimalisasi Performa](#17-media-aset--optimalisasi-performa)
18. [Keamanan, Validasi, & Penanganan Error](#18-keamanan-validasi--penanganan-error)
19. [Roadmap Resmi 14 Fase](#19-roadmap-resmi-14-fase)
20. [Definition of Done untuk Core Wedding Engine (20 Poin)](#20-definition-of-done-untuk-core-wedding-engine-20-poin)
21. [Analisis Risiko Teknis & Mitigasi](#21-analisis-risiko-teknis--mitigasi)
22. [Fitur Masa Depan (Future Scope)](#22-fitur-masa-depan-future-scope)

---

## 1. RINGKASAN EKSEKUTIF & REALIGNMENT PRIORITAS

### 1.1 Perubahan Strategis Utama (ADR-0003)
Prioritas nomor satu dari platform ini adalah membangun **Mesin Pembuat Undangan Pernikahan Digital (Wedding Engine)**. 

Bagian paling sulit, paling bernilai, dan paling berisiko tinggi dari produk ini bukanlah panel admin korporat yang masif, sistem pembayaran, marketplace, ataupun konfigurasi custom domain DNS. Risiko teknis dan bisnis sesungguhnya adalah **Wedding Engine**: kemampuan sistem untuk menyimpan, mengatur, mengedit, merender, mem-preview, dan mempublikasikan berbagai variasi website undangan pernikahan yang responsif dan performan, dengan arsitektur yang dapat diekspansi hingga ratusan tema tanpa pernah menduplikasi atau membuat ulang source code untuk setiap tema baru.

### 1.2 Hirarki Alur Pengembangan Inti
Seluruh rekayasa sistem difokuskan pada pipeline hulu-ke-hilir berikut:

```
AUTHENTICATION (Foundation & Ownership)
       ↓
CREATE INVITATION FLOW (Wizard & Input)
       ↓
INVITATION CONFIGURATION (Structured State)
       ↓
JSON SCHEMA & VERSIONING (Strict Zod Contract)
       ↓
COMPONENT REGISTRY (Isolated Reusable Modules)
       ↓
TEMPLATE ENGINE (Layout & Section Composition)
       ↓
THEME ENGINE (Design Tokens & Visual Identity)
       ↓
WEDDING RENDERER (Modular SSR/SSG Engine)
       ↓
EDITOR FOUNDATION (Configuration Mutation Layer)
       ↓
PREVIEW SYSTEM (Live Viewport Rendering)
       ↓
PUBLISH LIFECYCLE (Validation & Snapshotting)
       ↓
SLUG GENERATOR (Database-Guaranteed Routing)
       ↓
PUBLIC INVITATION (Fast, Zero-Layout-Shift Web)
```

### 1.3 Scope Pembatasan Tahap Awal (Lean Scope)
- **Admin Panel Tahap Awal:** Disederhanakan menjadi antarmuka sistem pengguna inti: *Dashboard, Undangan Saya, Buat Undangan, Tema, Media, Pengaturan*.
- **Admin Enterprise Ditunda:** Manajemen user masif, audit log center, monitoring health probe, feature flag matrix, skill knowledge base, dan billing enterprise ditunda ke Fase 12+.
- **Payment & Marketplace Ditunda:** Tidak ada integrasi gateway pembayaran pada fase inti.
- **Custom Domain & DNS Ditunda:** Publikasi tahap awal murni menggunakan routing slug unik: `domainplatform.com/{slug}` tanpa manipulasi DNS pihak ketiga.

---

## 2. VISI, NILAI PRODUK, & TARGET PENGGUNA

### 2.1 Visi Produk
Mewujudkan platform penciptaan undangan pernikahan digital berbasis AI dan data-driven engine yang paling fleksibel, cepat, dan modular di Indonesia, yang memungkinkan pembuatan ribuan variasi undangan berkualitas tinggi dalam hitungan detik tanpa *technical debt* dari halaman hardcoded.

### 2.2 Target Pengguna
1. **Calon Pengantin (End-Users):** Pengguna yang ingin membuat dan mengkustomisasi undangan pernikahan mereka secara mandiri, cepat, dan estetis.
2. **Vendor / Wedding Organizer:** Kreator yang mengelola banyak undangan sekaligus dengan kebutuhan variasi tema dan kustomisasi cepat.
3. **AI Autonomous Agents & Developers:** Sistem otonom yang memanipulasi konfigurasi undangan dan memperluas registry komponen secara terstandarisasi.

---

## 3. DIFERENSIASI KONSEPTUAL INTI (5+1 CONCEPT SEPARATION)

Untuk mencegah ambiguitas arsitektur, platform menetapkan batas tegas antara 6 konsep fundamental:

| Konsep | Definisi Formal | Tanggung Jawab & Cakupan | Larangan Keras |
|---|---|---|---|
| **1. COMPONENT** | Bagian UI visual modular dan reusable yang terdaftar di Component Registry. | Merender satu potongan fungsi spesifik (contoh: Hero, Couple, Event, Countdown, Gallery, RSVP). Menerima props terstruktur, mendukung varian, responsive, dan animasi. | DILARANG membaca langsung database atau memiliki hardcoded styles di luar design token. |
| **2. TEMPLATE** | Blueprint struktural yang mengatur urutan, hierarki, dan komposisi sections dalam sebuah undangan. | Menentukan section apa saja yang aktif secara default, urutan tampilnya, varian default per section, dan struktur grid/slot layout. | DILARANG memuat hardcoded file React JSX per tema atau menyematkan warna spesifik. |
| **3. THEME** | Sistem identitas visual (*Design System*) yang diterapkan ke template dan component. | Mendefinisikan token warna, tipografi, radius sudut, bayangan (*shadow*), latar belakang (*background*), dekorasi grafis, dan *animation personality*. | DILARANG menentukan data konten pasangan atau mengubah hierarki struktural section. |
| **4. CONTENT** | Data mentah milik pasangan pengantin. | Berisi teks nama pengantin, tanggal acara, waktu, lokasi peta, narasi kisah cinta, URL foto galeri, nomor rekening hadiah, dan informasi kontak. | DILARANG menyimpan konfigurasi visual styling atau tag HTML kotor. |
| **5. INVITATION CONFIGURATION** | Dokumen data terstruktur (JSON) tunggal yang valid dan komprehensif. | Menggabungkan *metadata, content, theme configuration, template configuration, active sections, section props, overrides, dan settings*. | DILARANG menyimpan source code React mentah atau fungsi JavaScript yang dieksekusi via `eval()`. |
| **6. RENDERER** | Core engine yang mengonsumsi Invitation Configuration dan menghasilkan antarmuka web interaktif. | Memvalidasi konfigurasi, memetakan ke registry komponen, menginjeksi token tema CSS, merender section secara sekuensial, dan menghasilkan HTML responsif. | DILARANG memiliki percabangan kondisional raksasa (*giant switch/if-else tree*) per tema. |

---

## 4. ARSITEKTUR SISTEM & PRINSIP REKAYASA

### 4.1 Diagram Arsitektur Blok

```
+-----------------------------------------------------------------------------------+
|                                CLIENT INTERFACES                                  |
|   +---------------------+   +---------------------+   +-----------------------+   |
|   |   User Workspace    |   | Visual Block Editor |   |   Public Invitation   |   |
|   |  (Dashboard/Drafts) |   |   (JSON Mutator)    |   | (SSR/SSG /w/[slug])   |   |
|   +----------+----------+   +----------+----------+   +-----------+-----------+   |
+--------------|-------------------------|--------------------------|---------------+
               |                         |                          |
+--------------v-------------------------v--------------------------v---------------+
|                             NEXT.JS 15 APP RUNTIME                                |
|  +-----------------------------------------------------------------------------+  |
|  |                             WEDDING ENGINE CORE                             |  |
|  |  +---------------------+  +--------------------+  +----------------------+  |  |
|  |  |  JSON Zod Schema    |  | Component Registry |  |   Template Engine    |  |  |
|  |  |  & Version Migrator |  | (Props & Variants) |  | (Section Order/Slot) |  |  |
|  |  +----------+----------+  +---------+----------+  +----------+-----------+  |  |
|  |             |                       |                        |              |  |
|  |  +----------v-----------------------v------------------------v-----------+  |  |
|  |  |                         THEME ENGINE & TOKENS                         |  |  |
|  |  |                  (CSS Variables & Personality Preset)                 |  |  |
|  |  +----------------------------------+------------------------------------+  |  |
|  |                                     |                                       |  |
|  |  +----------------------------------v------------------------------------+  |  |
|  |  |                         WEDDING RENDERER                              |  |  |
|  |  |         (Sequential Pipeline, Responsive, Lazy Media & A11y)          |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-------------------------+  +----------------------+  +----------------------+  |
|  |    AI Wedding Builder   |  |   Auth & Ownership   |  |    Publishing &      |  |
|  | (Gemini Provider -> JSON|  | (Session / RBAC Guard|  |   Slug Management    |  |
|  +-------------------------+  +----------------------+  +----------------------+  |
+--------------+-------------------------+--------------------------+---------------+
               |                         |                          |
+--------------v-------------------------v--------------------------v---------------+
|                              PERSISTENCE & CACHE                                  |
|  +-------------------------------------------+  +------------------------------+  |
|  |         Neon PostgreSQL (Drizzle)         |  |        Upstash Redis         |  |
|  | (Users, Invs, Versions, Themes, Slugs)    |  | (Render Cache, Rate Limits)  |  |
|  +-------------------------------------------+  +------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 4.2 Prinsip Rekayasa Mutlak
1. **Zero Giant Files:** Setiap berkas kode sumber dibatasi maksimal **500 baris**. Modul yang kompleks wajib dipecah menjadi sub-modul terfokus.
2. **Strict Zod Contract:** 100% data eksternal, request body, konfigurasi dokumen JSON, dan respon AI wajib divalidasi via Zod Schema.
3. **Multi-Tenant Data Isolation:** Akses ke mutasi data undangan wajib melewati fungsi pembatas kepemilikan `assertOwnership(userId, invitationId)`.
4. **Declarative Rendering:** Tidak ada kode HTML/JSX yang disimpan di database. Seluruh tampilan di-generate secara deklaratif oleh Renderer dari dokumen JSON.
5. **Separation of Concerns:** Pemisahan lapisan transport (Server Actions / Route Handlers), domain services, rendering engine, dan data access layer.

---

## 5. SPESIFIKASI COMPONENT REGISTRY

Component Registry bertindak sebagai kamus pusat modul visual yang dapat dikenali dan dirender oleh Wedding Engine.

### 5.1 Metadata Komponen
Setiap komponen yang terdaftar wajib mengimplementasikan antarmuka kontrak:

```typescript
export interface ComponentRegistration<TProps = unknown> {
  id: string;                      // Contoh: 'core/hero'
  type: ComponentType;             // Enum tipe section
  version: string;                 // Semantic versioning (contoh: '1.0.0')
  name: string;                    // Nama ramah pengguna (contoh: 'Hero Section')
  description: string;             // Deskripsi fungsional
  schema: z.ZodType<TProps>;       // Skema validasi props & konfigurasi
  defaultProps: TProps;            // Props default saat pertama kali ditambahkan
  supportedVariants: string[];     // Daftar varian (contoh: ['classic', 'minimal', 'split', 'fullscreen'])
  defaultVariant: string;
  responsiveBehavior: {
    mobileLayout: 'stacked' | 'scroll' | 'compact';
    desktopLayout: 'grid' | 'split' | 'side-by-side';
  };
  animationPresets: string[];      // Contoh: ['fade-up', 'zoom-in', 'slide-horizontal', 'none']
  a11yRules: {
    ariaRole?: string;
    requiresHeading: boolean;
    contrastCompliant: boolean;
  };
  compatibility: {
    minEngineVersion: string;
    supportedThemeTypes: string[]; // ['all'] atau ['modern', 'traditional', 'islamic', 'floral']
  };
}
```

### 5.2 Daftar Komponen Inti (Core Components Registry)

| Component Type | ID Registry | Fungsi & Konten Utama | Variasi Layout |
|---|---|---|---|
| **Opening / Cover** | `core/opening` | Halaman selamat datang, amplop digital interaktif, tombol buka undangan, nama tamu terpersonalisasi. | `envelope-modal`, `curtain-reveal`, `fullscreen-card` |
| **Hero / Couple** | `core/hero` | Foto utama pasangan, headline pernikahan, nama panggilan mempelai, tanggal utama. | `centered-portrait`, `split-dual-photo`, `full-bleed-overlay` |
| **Couple Profile** | `core/couple` | Biodata mempelai pria & wanita, nama orang tua, tautan media sosial, ornamen islami/nasional. | `side-by-side-avatar`, `stacked-card`, `arch-frame` |
| **Countdown** | `core/countdown` | Penghitung waktu mundur real-time menuju akad/resepsi (Hari, Jam, Menit, Detik). | `flip-card`, `minimal-circle`, `pill-badges` |
| **Event / Schedule** | `core/event` | Rincian waktu acara (Akad Nikah, Pemberkatan, Resepsi, Unduh Mantu), alamat, tombol Google Calendar. | `timeline-card`, `grid-boxes`, `tabbed-events` |
| **Story / Journey** | `core/story` | Perjalanan kisah cinta (Pertama Bertemu, Lamaran, Menuju Pelaminan). | `vertical-timeline`, `photo-carousel`, `milestone-steps` |
| **Gallery** | `core/gallery` | Foto dan video pre-wedding dengan lightbox interaktif. | `masonry-grid`, `carousel-slider`, `polaroid-scatter` |
| **Location / Map** | `core/location` | Peta lokasi acara, integrasi Google Maps, rute navigasi, tombol panduan lokasi. | `embedded-iframe`, `card-with-static-map`, `dual-venue-cards` |
| **RSVP** | `core/rsvp` | Formulir konfirmasi kehadiran tamu (Hadir/Tidak, Jumlah Tamu, Sesi Kehadiran). | `compact-form`, `stepper-form`, `card-popup` |
| **Closing** | `core/closing` | Kalimat penutup, ucapan terima kasih, tanda tangan digital keluarga besar. | `centered-quote`, `couple-signature`, `photo-backdrop` |
| **Quote** *(Ekstensi)* | `core/quote` | Ayat suci, kutipan sastra, puisi pernikahan. | `centered-script`, `boxed-border`, `parchment-scroll` |
| **Guestbook** *(Ekstensi)* | `core/guestbook` | Daftar ucapan & doa dari tamu secara real-time. | `stream-bubble`, `masonry-cards`, `slider-ticker` |
| **Gift / Angpao** *(Ekstensi)* | `core/gift` | Amplop digital, nomor rekening bank, dompet digital, alamat kirim kado. | `bank-cards-copy`, `qr-code-modal`, `gift-registry-list` |
| **Music Dock** *(Ekstensi)* | `core/music` | Pemutar musik latar belakang mengambang (*floating dock*), tombol play/pause. | `floating-disk`, `pill-player`, `minimal-icon` |
| **Video Live Stream** *(Ekstensi)* | `core/video` | Tautan live streaming pernikahan (YouTube / Zoom / Instagram Live). | `video-player-embed`, `countdown-stream-card` |

---

## 6. SPESIFIKASI TEMPLATE ENGINE

Template Engine bertindak sebagai orkestrator komposisi halaman, mengatur susunan, urutan, dan struktur default sections.

### 6.1 Struktur Definisi Template

```typescript
export interface TemplateDefinition {
  id: string;                     // Contoh: 'template/classic-elegance'
  name: string;                   // 'Classic Elegance'
  category: 'traditional' | 'modern' | 'minimalist' | 'islamic' | 'floral' | 'luxury';
  description: string;
  thumbnailUrl: string;
  defaultThemeId: string;         // Theme default yang disarankan
  compatibleThemeIds: string[];   // Daftar theme yang kompatibel ('*' untuk semua)
  sections: Array<{
    instanceId: string;           // UUID section instance
    componentId: string;          // Relasi ke Component Registry ('core/hero')
    isRequired: boolean;          // Apakah wajib ada atau boleh dihapus
    defaultVariant: string;       // Varian default komponen pada template ini
    recommendedProps?: Record<string, unknown>;
  }>;
  recommendedContentStructure: {
    hasLoveStory: boolean;
    maxGalleryImages: number;
    supportedEventCount: number;
  };
}
```

### 6.2 Contoh Komposisi Template
- **Template A (Elegance Flow):**
  `Opening -> Hero -> Couple -> Countdown -> Event -> Story -> Gallery -> Location -> RSVP -> Closing`
- **Template B (Modern Story Flow):**
  `Opening -> Hero -> Story -> Couple -> Gallery -> Countdown -> Event -> Location -> RSVP -> Closing`
- **Template C (Essential Compact):**
  `Opening -> Hero -> Couple -> Event -> Location -> RSVP -> Closing`

Template **TIDAK PERNAH** dibuat sebagai halaman React statis tersendiri. Template murni berupa spesifikasi array konfigurasi section yang diinterpretasikan oleh Wedding Renderer.

---

## 7. SPESIFIKASI THEME ENGINE & DESIGN TOKENS

Theme Engine menetapkan identitas visual dan estetika melalui sistem token CSS yang dapat diinjeksikan secara dinamis ke seluruh komponen.

### 7.1 Struktur Token Tema (Design Tokens Schema)

```typescript
export interface ThemeDefinition {
  id: string;                      // Contoh: 'theme/sage-botanical'
  name: string;                    // 'Sage Botanical'
  version: string;
  category: string;
  tokens: {
    colors: {
      primary: string;             // Warna aksen utama (contoh: #4A6B5B)
      primaryForeground: string;   // Kontras teks pada warna primary
      secondary: string;           // Warna pendukung (contoh: #D8E2DC)
      secondaryForeground: string;
      background: string;          // Latar belakang halaman (contoh: #FAF8F5)
      foreground: string;          // Warna teks utama (contoh: #2C3531)
      muted: string;               // Warna teks sekunder
      mutedForeground: string;
      card: string;                // Latar belakang card section
      cardForeground: string;
      border: string;              // Warna garis tepi
      accent: string;              // Warna sorotan (emas, perunggu, dll.)
    };
    typography: {
      headingFont: string;         // Google Fonts (contoh: 'Playfair Display')
      headingFontFallback: string; // 'serif'
      bodyFont: string;            // Google Fonts (contoh: 'Plus Jakarta Sans')
      bodyFontFallback: string;    // 'sans-serif'
      scriptFont?: string;         // Font kaligrafi/dekoratif (contoh: 'Great Vibes')
      scale: 'compact' | 'normal' | 'large';
    };
    surface: {
      radius: string;              // '0px' | '8px' | '16px' | '9999px'
      borderWidth: string;         // '1px' | '2px'
      shadow: string;              // 'none' | 'sm' | 'md' | 'xl' | 'soft-glow'
      backdropBlur: string;        // 'none' | 'sm' | 'md'
    };
    backgrounds: {
      type: 'solid' | 'gradient' | 'pattern' | 'texture';
      patternUrl?: string;         // SVG pattern lembut
      gradient?: string;
      overlayOpacity: number;      // 0.0 - 1.0
    };
    decorative: {
      frameStyle: 'none' | 'arch' | 'floral-corners' | 'gold-border' | 'minimal-line';
      dividerStyle: 'line' | 'flourish' | 'dots' | 'leaf-ornament';
      cardStyle: 'flat' | 'elevated' | 'glassmorphism' | 'bordered';
    };
    animationPersonality: {
      type: 'gentle-fade' | 'smooth-slide' | 'playful-pop' | 'none';
      defaultDurationMs: number;
      staggerDelayMs: number;
    };
  };
  componentVariantOverrides?: Record<string, string>; // Override varian per komponen jika perlu
}
```

### 7.2 Strategi Kompatibilitas Tema-Template (Compatibility Matrix)
1. **Pemisahan Logika:** Semua komponen membaca CSS variables yang diinjeksi root (`--wedding-primary`, `--wedding-font-heading`, dll.).
2. **Pengecekan Kompatibilitas:** Saat pengguna mengganti tema pada sebuah template, engine memeriksa `compatibleThemeIds`. Jika tema berstatus kompatibel, seluruh section otomatis terupdate tanpa kerusakan struktur.
3. **Accessibility Guard:** Engine memvalidasi kontras warna teks terhadap latar belakang secara otomatis (memenuhi rasio kontras minimum WCAG 2.1 AA 4.5:1).

---

## 8. ARSITEKTUR WEDDING RENDERER

Wedding Renderer adalah jantung platform yang bertugas mengonsumsi Invitation Configuration dan menghasilkan dokumen web yang responsif, teroptimasi, dan interaktif.

### 8.1 Pipeline 10 Langkah Rendering

```
[ INVITATION JSON CONFIGURATION ]
               │
               ▼
   [ 1. Zod Schema Validation ] ──► (Invalid? Render Error / Fallback Safe View)
               │
               ▼
    [ 2. Read Template Model ]  ──► (Resolve Section Order & Slots)
               │
               ▼
     [ 3. Read Theme Model ]    ──► (Resolve Color, Font, Radius, Shadow Tokens)
               │
               ▼
 [ 4. Component Registry Lookup ]──► (Match Component ID & Verify Availability)
               │
               ▼
  [ 5. Inject Theme CSS Tokens ]──► (Generate Root CSS Variables & Load Google Fonts)
               │
               ▼
 [ 6. Render Sequential Sections ]─► (Iterate Active Sections in Correct Order)
               │
               ▼
 [ 7. Apply Component Variants ]──► (Mount Specified Variant UI Layout)
               │
               ▼
 [ 8. Apply Animation Presets ] ──► (Attach Intersection Observer / Motion Wrappers)
               │
               ▼
 [ 9. Inject Meta & OpenGraph ] ──► (Dynamic SEO Titles, Description, OG-Image)
               │
               ▼
  [ 10. Output Public Webpage ] ──► (Mobile-First, Responsive, High Performance)
```

### 8.2 Desain Modular (Anti Giant File & Strategy Pattern)
Renderer **TIDAK BOLEH** menggunakan `switch-case` raksasa di satu berkas. Renderer menggunakan *Registry Strategy Pattern*:

```typescript
// src/engine/renderer/section-renderer.tsx
export function SectionRenderer({ section, theme, context }: SectionRendererProps) {
  const componentEntry = componentRegistry.get(section.componentId);
  if (!componentEntry) {
    return <SectionFallbackWarning id={section.componentId} />;
  }

  const ComponentImplementation = componentEntry.variants[section.variant] 
    ?? componentEntry.variants[componentEntry.defaultVariant];

  return (
    <SectionWrapper 
      id={section.instanceId} 
      animation={section.animation ?? theme.tokens.animationPersonality}
      decorative={theme.tokens.decorative}
    >
      <ComponentImplementation 
        content={section.content} 
        config={section.config} 
        theme={theme}
        context={context}
      />
    </SectionWrapper>
  );
}
```

### 8.3 Mobile-First & Responsivitas
- Seluruh komponen dirancang dari sudut pandang perangkat seluler terlebih dahulu (*mobile viewport* 360px - 430px), kemudian diskalakan secara elegan ke tablet dan desktop.
- Menggunakan viewport unit modern (`dvh`, `rem`, `clamp()`) untuk mencegah masalah *address bar resize* pada browser mobile.

### 8.4 Optimalisasi Performa
- **Zero Heavy Hydration:** Halaman publik meminimalkan *client-side JavaScript*. Interaktivitas berat (seperti lightbox galeri dan countdown) di-load secara *dynamic import* / *lazy load*.
- **Image Optimization:** Gambar diproses secara otomatis via responsive `srcset`, webp format, dan lazy-loading dengan placeholder blur.
- **Font Optimization:** Menggunakan `next/font` untuk eliminasi *render-blocking* font external.

---

## 9. JSON SCHEMA & STRATEGI VERSIONING

### 9.1 Dokumen Konfigurasi Lengkap (Invitation Configuration Schema v1.0.0)

```typescript
export interface InvitationConfiguration {
  schemaVersion: '1.0.0';
  metadata: {
    invitationId: string;
    title: string;
    description: string;
    language: 'id' | 'en';
    timezone: string;           // 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura'
  };
  couple: {
    groom: {
      fullName: string;
      shortName: string;
      fatherName: string;
      motherName: string;
      childOrder: string;       // 'Putra pertama dari...'
      instagram?: string;
      avatarUrl?: string;
    };
    bride: {
      fullName: string;
      shortName: string;
      fatherName: string;
      motherName: string;
      childOrder: string;       // 'Putri kedua dari...'
      instagram?: string;
      avatarUrl?: string;
    };
  };
  events: Array<{
    id: string;
    type: 'akad' | 'pemberkatan' | 'resepsi' | 'unduh_mantu' | 'custom';
    title: string;
    date: string;               // ISO 8601 YYYY-MM-DD
    startTime: string;          // HH:mm
    endTime: string;            // HH:mm atau 'Selesai'
    venueName: string;
    venueAddress: string;
    mapUrl?: string;
    coordinates?: { lat: number; lng: number };
  }>;
  template: {
    templateId: string;
    version: string;
  };
  theme: {
    themeId: string;
    version: string;
    customOverrides?: Partial<ThemeDefinition['tokens']>;
  };
  sections: Array<{
    instanceId: string;
    componentId: string;
    isEnabled: boolean;
    order: number;
    variant: string;
    animationPreset?: string;
    content: Record<string, unknown>;
    configOverrides?: Record<string, unknown>;
  }>;
  settings: {
    enableRsvp: boolean;
    enableGuestbook: boolean;
    enableGift: boolean;
    enableMusic: boolean;
    musicUrl?: string;
    musicAutoplay: boolean;
    showWatermark: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl?: string;
    faviconUrl?: string;
  };
}
```

### 9.2 Strategi Migrasi & Versioning Skema
1. **Versi Eksplisit:** Setiap dokumen JSON menyimpan `schemaVersion` di level root.
2. **Schema Migration Transformers:** Ketika skema berkembang (misal v1.0.0 ke v1.1.0 atau v2.0.0), sistem menjalankan pipeline transformer asinkron tanpa memutus kompatibilitas undangan lama:

```typescript
export const migrationPipeline: Record<string, (doc: any) => any> = {
  '1.0.0->1.1.0': (doc) => {
    // Transformasi penambahan field baru dengan default fallback
    return { ...doc, schemaVersion: '1.1.0', settings: { ...doc.settings, showWatermark: true } };
  }
};
```

---

## 10. ARSITEKTUR VISUAL EDITOR

Visual Editor adalah lapisan interaktif di atas Wedding Engine yang bertugas melakukan mutasi pada **Invitation Configuration**, bukan menulis kode React.

```
[ USER INTERACTION IN EDITOR ]
  │
  ├── 1. Ubah Teks/Foto        ──► Update doc.couple / doc.sections[i].content
  ├── 2. Reorder Drag & Drop   ──► Mutate doc.sections[i].order array
  ├── 3. Tambah/Hapus Section  ──► Push/Filter doc.sections
  ├── 4. Ganti Varian Layout   ──► Update doc.sections[i].variant
  ├── 5. Ganti Warna / Tema    ──► Update doc.theme.themeId / customOverrides
  │
  ▼
[ Zod Validation in State Store ]
  │
  ▼
[ PostMessage / Context Update ] ──► [ Live Preview Canvas (Hot Re-Render) ]
  │
  ▼
[ Autosave Debounced API ]       ──► [ Neon PostgreSQL (Draft Revision) ]
```

### 10.1 Fitur Utama Editor
- **Live Responsive Canvas:** Preview instan dengan switch mode viewport (Mobile 375px, Tablet 768px, Desktop 1200px).
- **Drag-and-Drop Section Manager:** Mengatur ulang urutan bagian dengan visual reorder tree.
- **Section Component Palette:** Menambahkan komponen baru dari Component Registry dengan satu klik.
- **Theme & Variant Picker:** Mengganti varian komponen atau mengganti seluruh tema secara instan.
- **State Management & History:** Mendukung *Undo/Redo* berkat immutable state snapshots pada dokumen JSON konfigurasi.
- **Autosave Engine:** Debounce otomatis menyimpan status draft ke database setiap 2 detik pasca-mutasi.

---

## 11. AI WEDDING BUILDER ARCHITECTURE

AI diposisikan secara tegas **DI ATAS** Wedding Engine sebagai generator dan editor dokumen konfigurasi terstruktur, bukan generator kode program mentah.

### 11.1 Flow Kerja AI Wedding Builder
1. **User Prompt Input:** Pengguna memberikan instruksi natural (misal: *"Buat undangan tema floral sage green untuk Rama & Sinta, akad pagi jam 8 di Masjid Al-Ikhlas, resepsi malam jam 19 di Hotel Mulia, sertakan kisah cinta romantis dan countdown."*).
2. **AI Provider Gateway (Gemini):** Memproses prompt menggunakan *System Prompt Engine* yang memahami kamus Component Registry, Template, dan Theme Registry.
3. **Structured JSON Output:** AI menghasilkan dokumen `InvitationConfiguration` parsial/penuh dalam format JSON.
4. **Zod Validation & Auto-Repair:** Sistem memvalidasi output terhadap `InvitationConfigSchema`. Jika ada field yang tidak sesuai, sistem menjalankan modul auto-repair atau meminta fallback tanpa merusak engine.
5. **Renderer Consumption:** Renderer membaca konfigurasi yang valid dan langsung menampilkan preview undangan dalam hitungan detik.

### 11.2 Abstraksi Provider AI
Arsitektur menggunakan interface `AIProvider` terisolasi:
- Provider default: Google Gemini (`gemini-flash-latest` via `@google/genai`).
- Siap diganti atau di-*failover* ke provider lain di masa depan tanpa mengubah kode domain Wedding Engine.

---

## 12. ALUR PEMBUATAN UNDANGAN (CREATE INVITATION FLOW)

Alur pembuatan undangan dirancang sederhana, terstruktur, dan berorientasi hasil:

```
[ 1. User Register / Login ]
            │
            ▼
[ 2. Klik "Buat Undangan" ]
            │
            ▼
[ 3. Masukkan Informasi Dasar ]
(Nama Pasangan, Tanggal Utama Acara, Kota)
            │
            ▼
[ 4. Pilih Jalur Pembuatan ]
    ├── A. Mulai dari Template (Pilih dari Template Catalog)
    ├── B. Mulai dengan AI Builder (Masukkan cerita/prompt)
    └── C. Mulai dari Tema Visual (Pilih warna & gaya estetika)
            │
            ▼
[ 5. Sistem Membuat Initial Configuration Draft ]
(Simpan ke database tabel `invitation_drafts`)
            │
            ▼
[ 6. Masuk ke Editor Visual & Preview ]
(Pengguna mengkustomisasi konten, urutan, foto, dan rincian acara)
            │
            ▼
[ 7. Validasi Kelayakan Publikasi ]
(Pengecekan kelengkapan data wajib: nama, tanggal, lokasi)
            │
            ▼
[ 8. Publish & Reservasi Slug ]
(Pilih slug: /rama-sinta, simpan snapshot ke `invitation_versions`)
            │
            ▼
[ 9. Public Invitation Live! ] ──► domainplatform.com/{slug}
```

---

## 13. ARSITEKTUR PUBLIKASI & MANAJEMEN SLUG

### 13.1 Lifecycle Undangan

```
  +-----------+         Save Draft          +-----------+
  |   DRAFT   | ──────────────────────────► |   READY   |
  +-----------+                             +-----+-----+
        ▲                                         │
        │ Edit & Re-draft                         │ User Click Publish
        │                                         ▼
  +-----+-----+                             +-----------+
  | ARCHIVED  | ◄────────────────────────── | PUBLISHED |
  +-----------+     Archive / Unpublish     +-----------+
```

- **DRAFT:** Undangan dalam proses pembuatan dan pengeditan aktif. Hanya dapat diakses oleh pemiliknya.
- **READY:** Seluruh data wajib lengkap dan validasi schema 100% lolos. Siap dipublikasikan.
- **PUBLISHED:** Snapshot konfigurasi disimpan secara *immutable*. Halaman publik dapat diakses siapapun melalui URL slug.
- **ARCHIVED:** Undangan dinonaktifkan oleh pengguna. URL publik menampilkan halaman arsip sopan.

### 13.2 Sistem Slug Sederhana (No DNS / No Custom Domain)
- **Format URL:** `https://domainplatform.com/{slug}` atau `https://domainplatform.com/w/{slug}`.
- **Karakteristik Slug:**
  - Terdiri dari huruf kecil alfanumerik dan tanda hubung (`^[a-z0-9-]+$`).
  - Panjang antara 3 hingga 60 karakter.
  - Bebas dari karakter khusus, spasi, atau simbol berbahaya.
- **Generator Otomatis:** Sistem menyarankan slug dari nama pengantin (contoh: `eka-dan-rani`, `eka-rani`).
- **Database Unique Constraint:** Keunikan slug dijaga langsung oleh tabel `invitation_slugs` dengan indeks unik di PostgreSQL.
- **Collision Alternative:** Jika slug sudah terpakai, sistem otomatis menyarankan variasi (contoh: `eka-rani-wedding`, `eka-rani-2026`).
- **Status Custom Domain:** Dicatat secara tegas sebagai **FUTURE FEATURE** yang sama sekali tidak menjadi dependensi Wedding Engine.

---

## 14. AUTENTIKASI, KEPEMILIKAN, & ANTARMUKA PENGGUNA SEDERHANA

### 14.1 Fondasi Autentikasi & Ownership
- Autentikasi diperlukan semata-mata untuk menjamin bahwa **setiap undangan memiliki pemilik sah (`owner_id`)**.
- Menggunakan sesi database kustom yang aman:
  - Password hashing dengan `scrypt`.
  - Session token disimpan di cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
  - Fungsi guard isolasi multi-tenant: `assertOwnership(userId, invitationId)`. User A tidak pernah dapat melihat atau memodifikasi undangan User B.

### 14.2 Antarmuka Pengguna Tahap Awal (Lean System Interface)
Area navigasi pasca-login dirancang fungsional dan terfokus:

```
[ HEADER / SIDEBAR ]
├── 1. Dashboard (Ringkasan singkat undangan aktif & status publikasi)
├── 2. Undangan Saya (Daftar kartu undangan milik pengguna)
├── 3. Buat Undangan (Tombol CTA utama peluncur flow pembuatan)
├── 4. Tema (Eksplorasi katalog tema yang tersedia)
├── 5. Media (Galeri upload aset foto/video pengguna)
└── 6. Pengaturan (Pengaturan profil pengguna & ganti password)
```

> **Catatan Penundaan:** Modul admin kompleks seperti *User Management masif, Audit Center, System Health, Feature Flags, AI Knowledge, Skill Center, Billing, dan Payment* ditunda ke fase lanjutan setelah Wedding Engine stabil.

---

## 15. MODEL DATA & DATABASE ARCHITECTURE (NEON POSTGRESQL)

Sistem menggunakan database relasional Neon PostgreSQL dengan Drizzle ORM. Skema dirancang terpisah dan bersih:

```
+----------------+       +-------------------+       +----------------------+
|     users      | 1───N |    invitations    | 1───1 |  invitation_drafts   |
| (Auth & Owner) |       | (Metadata & State)|       | (Draft JSON Config)  |
+----------------+       +---------+---------+       +----------------------+
                                   │
                                   ├─── 1───N +----------------------+
                                   │          | invitation_versions  |
                                   │          | (Immutable Snapshot) |
                                   │          +----------------------+
                                   │
                                   └─── 1───1 +----------------------+
                                              |   invitation_slugs   |
                                              | (Unique URL Mapping) |
                                              +----------------------+
```

### 15.1 Definisi Tabel Utama
1. `users`: Menyimpan identitas akun, email unik, password hash, dan status aktif.
2. `sessions`: Menyimpan sesi login aktif dengan waktu kedaluwarsa.
3. `invitations`: Menyimpan metadata utama undangan, relasi `owner_id`, judul, status lifecycle (`DRAFT`, `READY`, `PUBLISHED`, `ARCHIVED`), dan counter versi aktif.
4. `invitation_drafts`: Menyimpan dokumen kerja `InvitationConfiguration` aktif dalam format JSONB yang dapat terus dimutasi oleh editor.
5. `invitation_versions`: Menyimpan snapshot konfigurasi JSON immutable saat user menekan tombol *Publish*, lengkap dengan nomor versi semantik untuk histori dan rollback.
6. `invitation_slugs`: Menyimpan pemetaan slug unik ke `invitation_id` dengan database unique index.
7. `themes`: Katalog metadata tema, author, kategori, dan token default JSON.
8. `templates`: Katalog metadata template, daftar section default, dan varian yang disarankan.
9. `media_assets`: Metadata file gambar/audio yang diupload pengguna via ImageKit.

---

## 16. STRATEGI CACHING & REDIS (UPSTASH)

Upstash Redis digunakan secara terukur hanya untuk keperluan:
1. **Render Caching:** Menyimpan cache HTML hasil render undangan publik yang telah berstatus `PUBLISHED` (`cache:render:{slug}`). Cache otomatis di-invalidate saat user mem-publish revisi baru.
2. **Rate Limiting:** Mencegah spam submission RSVP dan brute force login (`ratelimit:rsvp:{ip}`).
3. **Locking & Task Coordination:** Mencegah duplikasi eksekusi pada background jobs atau komputasi AI.

Neon PostgreSQL tetap merupakan **Single Source of Truth** mutlak sistem.

---

## 17. MEDIA, ASET, & OPTIMALISASI PERFORMA

- **Media Storage:** Menggunakan ImageKit dengan arsitektur direct-client upload token untuk meminimalkan beban server.
- **Responsive Images:** Gambar undangan disajikan dalam format WebP/AVIF dengan resolusi adaptif sesuai layar mobile.
- **Fast First Paint:** Menggunakan SSR (*Server-Side Rendering*) pada rute publik `/[slug]` dengan strategi caching agresif sehingga LCP (*Largest Contentful Paint*) tercapai di bawah 1.2 detik.

---

## 18. KEAMANAN, VALIDASI, & PENANGANAN ERROR

1. **Strict Zod Everywhere:** Seluruh boundary I/O dilindungi skema Zod.
2. **Sanitasi Konten Teks:** Teks dari pengguna dibersihkan dari potensi XSS sebelum disimpan ke dokumen JSON atau dirender ke DOM.
3. **Taksonomi Error Terstruktur:** Menggunakan kelas `AppError` dengan penanganan terpusat dan penyamaran pesan error teknis dari pengguna publik.
4. **Environment Safety:** Seluruh konfigurasi variabel lingkungan divalidasi saat startup via `src/config/env.ts`.

---

## 19. ROADMAP RESMI 14 FASE

Berikut adalah roadmap implementasi resmi yang menempatkan Wedding Engine sebagai prioritas nomor satu:

| Fase | Nama Fase | Fokus & Target Utama |
|---|---|---|
| **PHASE 1** | **Authentication + Invitation Domain Foundation** | Setup environment, database Neon + Drizzle, auth sesi aman, model kepemilikan undangan, dan dashboard pengguna sederhana. |
| **PHASE 2** | **Invitation JSON Schema + Versioning** | Skema Zod lengkap untuk `InvitationConfiguration`, mekanisme versioning dokumen, dan pipeline migrasi data. |
| **PHASE 3** | **Component Registry** | Registrasi komponen inti (Opening, Hero, Couple, Countdown, Event, Story, Gallery, Location, RSVP, Closing), varian layout, a11y, dan animation preset. |
| **PHASE 4** | **Template Engine** | Spesifikasi template, section order & slot composition rules, dan katalog template awal. |
| **PHASE 5** | **Theme Engine** | Spesifikasi token tema visual (warna, font, radius, shadow, background), injektor CSS variables, dan matriks kompatibilitas tema-template. |
| **PHASE 6** | **Wedding Renderer** | Pipeline rendering modular (SSR/SSG), integrasi template, tema, dan component registry, mobile-first, zero layout shift. |
| **PHASE 7** | **Create Invitation Flow** | Wizard pembuatan undangan lengkap (Informasi dasar -> Pilihan template/theme/AI/blank -> Pembuatan initial draft JSON). |
| **PHASE 8** | **Editor Foundation** | Visual configuration editor (reorder section via drag-and-drop, mutasi teks/konten, switch varian, ganti tema, responsive preview, undo/redo, autosave). |
| **PHASE 9** | **Preview + Publish + Slug** | Halaman live preview interaktif, database-guaranteed unique slug generator, dan aktivasi publikasi lifecycle `PUBLISHED`. |
| **PHASE 10** | **AI Wedding Builder** | Generator undangan berbasis prompt bahasa alami (Gemini AI -> Zod Validation -> JSON Configuration -> Auto Render). |
| **PHASE 11** | **Media + RSVP + Additional Wedding Features** | Integrasi upload ImageKit, formulir RSVP & notifikasi, buku tamu digital, amplop digital/rekening kado, floating music dock. |
| **PHASE 12** | **Admin System** | Panel manajemen operasional sistem (User explorer, monitor status undangan, audit logs, feature flags). |
| **PHASE 13** | **Advanced AI + Automation** | AI copywriter romantis multi-bahasa, auto-layout optimizer, dan rekomendasi palet cerdas. |
| **PHASE 14** | **Analytics + Growth Features** | Dashboard analitik pengunjung, pelacak konfirmasi kehadiran tamu, SEO optimizer, dan ekspansi skala. |

---

## 20. DEFINITION OF DONE UNTUK CORE WEDDING ENGINE (20 POIN)

Core Wedding Engine dianggap **BERHASIL & SELESAI** apabila sistem secara konseptual dan implementasinya nanti mampu memenuhi ke-20 kriteria berikut:

- [ ] **1. User login:** Pengguna dapat mendaftar dan masuk ke akun miliknya secara aman.
- [ ] **2. User membuat invitation:** Pengguna dapat membuat undangan baru melalui alur Create Invitation Flow.
- [ ] **3. Invitation memiliki owner:** Setiap undangan terikat secara ketat pada `owner_id` pengguna yang membuatnya.
- [ ] **4. Invitation memiliki slug:** Undangan memiliki slug URL unik yang tervalidasi.
- [ ] **5. Invitation memiliki version:** Setiap perubahan tersimpan dengan nomor revisi/versi semantik.
- [ ] **6. Invitation memiliki JSON configuration tervalidasi:** Dokumen konfigurasi 100% lolos validasi skema Zod.
- [ ] **7. Renderer membaca JSON configuration:** Engine renderer membaca dokumen JSON tanpa hardcoded data.
- [ ] **8. Renderer menggunakan component registry:** Komponen dipanggil secara dinamis berdasarkan identifier dari registry.
- [ ] **9. Renderer menggunakan template:** Struktur urutan dan section mengikuti spesifikasi template yang dipilih.
- [ ] **10. Renderer menggunakan theme:** Tampilan visual mengadopsi token warna, tipografi, dan dekorasi dari theme engine.
- [ ] **11. Component dapat memiliki variant:** Komponen dapat berganti varian layout tanpa merusak struktur halaman.
- [ ] **12. Theme dapat digunakan pada template:** Satu theme dapat diterapkan pada berbagai template yang berbeda.
- [ ] **13. Template dapat digunakan pada theme yang kompatibel:** Pengguna dapat mengganti theme pada template selama memenuhi matriks kompatibilitas.
- [ ] **14. Invitation dapat di-preview:** Tersedia antarmuka live preview responsif (mobile, tablet, desktop).
- [ ] **15. Invitation dapat diedit melalui configuration:** Perubahan pada editor memutasi dokumen JSON, bukan kode sumber React.
- [ ] **16. Invitation dapat disimpan sebagai draft:** Pengguna dapat menyimpan progress pekerjaan berstatus `DRAFT`.
- [ ] **17. Invitation dapat dipublish:** Undangan yang lengkap dapat dipublikasikan dengan status `PUBLISHED`.
- [ ] **18. Invitation tersedia melalui /slug:** Undangan publik yang aktif dapat diakses cepat via URL `domainplatform.com/{slug}`.
- [ ] **19. Invitation lama tetap kompatibel setelah schema evolution:** Undangan versi terdahulu tidak rusak saat skema diperbarui berkat pipeline transformer migrasi.
- [ ] **20. AI nantinya dapat menghasilkan configuration tanpa menulis React source code:** Sistem AI dapat memproduksi atau mengedit undangan murni dengan menghasilkan JSON configuration yang valid.

---

## 21. ANALISIS RISIKO TEKNIS & MITIGASI

| Risiko Teknis | Dampak | Strategi Mitigasi Proaktif |
|---|---|---|
| **1. Schema Drift & Version Breakage** | Undangan lama menjadi error saat skema JSON diperbarui di masa depan. | Menerapkan `schemaVersion` wajib pada root JSON dan menyediakan fungsi transformer migrasi teruji unit test. |
| **2. Bundle Size Bloat pada Public View** | Undangan publik lambat dibuka di koneksi mobile 4G/3G karena seluruh komponen ikut ter-bundle. | Code splitting agresif, dynamic import pada komponen interaktif, dan isolasi aset visual per section. |
| **3. Slug Collision pada High Concurrency** | Dua user membuat slug yang sama di waktu bersamaan. | Menggunakan database unique constraint di level PostgreSQL dan penanganan retry ramah pengguna. |
| **4. AI Hallucination pada Format JSON** | AI menghasilkan konfigurasi yang merusak renderer. | Strict Zod parser dengan mode *safe-parse*, auto-repair mapper, dan penolakan penyimpanan jika validasi gagal. |
| **5. CSS Variable / Token Collision** | Perubahan token tema merusak kontras atau keterbacaan teks. | Namespace CSS variables terisolasi (`--wedding-*`) dan validator kontras otomatis saat theme didaftarkan. |

---

## 22. FITUR MASA DEPAN (FUTURE SCOPE)

Fitur-fitur berikut dicatat sebagai rencana ekspansi bisnis dan **BUKAN** dependensi dari Core Wedding Engine:
1. **Payment Gateway Integration:** Pembayaran paket premium via Midtrans/Xendit/Stripe.
2. **Custom Domain & Automated SSL:** Pemetaan domain kustom pengguna (`pernikahan-eka-rani.com`) via Cloudflare / Vercel Domain API.
3. **Marketplace Creator Tema:** Platform bagi desainer luar untuk mempublikasikan dan menjual tema/komponen.
4. **Enterprise System Admin Panel:** Panel audit log super-lengkap, feature flag matrix, dan system telemetry.
