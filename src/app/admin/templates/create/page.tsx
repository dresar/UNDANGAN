'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Eye,
  Sliders,
  Layers,
  Palette,
  LayoutTemplate,
  Wand2,
  ZoomIn,
  ZoomOut,
  Wifi,
  Battery,
  Copy,
  FolderPlus,
  PanelLeftClose,
  PanelLeftOpen,
  Edit3,
  Image as ImageIcon,
  Calendar,
  Heart,
  MapPin,
  Gift,
  Quote as QuoteIcon,
  Clock,
  BookOpen,
  Check,
  Type,
  Maximize2,
  Music,
  Upload,
  Search,
  Filter,
} from 'lucide-react';
import { componentRegistry } from '@/core/registry/component-registry';
import { templateRegistry } from '@/core/registry/template-registry';
import { themeRegistry } from '@/core/registry/theme-registry';
import { TemplateSectionDefinition } from '@/core/domain/template/template.types';
import { InvitationConfig, SectionConfig } from '@/core/domain/invitation/invitation.types';
import { WeddingRenderer } from '@/core/renderer/wedding-renderer';

interface MediaAsset {
  id: string;
  url: string;
  title: string;
  category: string;
  tags?: string[];
}

export default function CreateTemplateVisualStudioPage() {
  const router = useRouter();
  const availableComponents = componentRegistry.getAll();
  const themes = themeRegistry.getAll();

  const [id, setId] = useState('royal-garden-elegance');
  const [name, setName] = useState('Royal Garden Elegance');
  const [category, setCategory] = useState<'cinematic' | 'editorial' | 'minimal' | 'romantic' | 'classic' | 'modern'>('cinematic');
  const [description, setDescription] = useState('Template visual mewah dengan opening cover amplop, countdown waktu, kisah cinta, galeri foto interaktif, dan amplop digital.');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80');
  const [activeThemeId, setActiveThemeId] = useState('royal-emerald');
  const [themeOverrides, setThemeOverrides] = useState<{ primaryColor?: string; backgroundColor?: string }>({});
  const [deviceModel, setDeviceModel] = useState<'android' | 'iphone' | 'desktop'>('android');
  const [zoom, setZoom] = useState(100);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'inspector' | 'media' | 'presets' | 'themes' | 'info'>('sections');
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic Assets State
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('gallery');
  const [addingAsset, setAddingAsset] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch {
      // fallback
    }
  };

  const handleAddNewAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl.trim() || !newAssetTitle.trim()) return;

    setAddingAsset(true);
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newAssetUrl.trim(),
          title: newAssetTitle.trim(),
          category: newAssetCategory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewAssetUrl('');
        setNewAssetTitle('');
        setShowAddAssetModal(false);
        fetchAssets();
      }
    } finally {
      setAddingAsset(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Hapus aset ini dari galeri?')) return;
    try {
      await fetch(`/api/assets?id=${assetId}`, { method: 'DELETE' });
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch {
      // ignore
    }
  };

  // Section configs
  const [sections, setSections] = useState<SectionConfig[]>([
    {
      id: 'sec-opening',
      componentType: 'opening',
      variant: 'fullscreen_card',
      order: 0,
      isVisible: true,
      props: {
        salutation: 'Kepada Yth. Bapak/Ibu/Saudara/i',
        invitationText: 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam momen istimewa kami.',
        openButtonText: 'Buka Undangan',
        badgeText: 'Pernikahan Impian',
        backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      id: 'sec-hero',
      componentType: 'hero',
      variant: 'cinematic',
      order: 1,
      isVisible: true,
      props: {
        title: 'The Wedding Of',
        groomNickname: 'Dimas',
        brideNickname: 'Anindya',
        eventDate: 'Sabtu, 24 Oktober 2026',
        venueCity: 'Yogyakarta, Indonesia',
        tagline: 'Dua hati yang bersatu dalam ikatan suci cinta abadi.',
        overlayOpacity: 45,
        heroImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      id: 'sec-quote',
      componentType: 'quote',
      variant: 'centered',
      order: 2,
      isVisible: true,
      props: {
        arabicText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا',
        quoteText: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya.',
        source: 'QS. Ar-Rum: 21',
      },
    },
    {
      id: 'sec-couple',
      componentType: 'couple',
      variant: 'portrait_split',
      order: 3,
      isVisible: true,
      props: {
        groom: {
          fullName: 'Dimas Wicaksono, S.T.',
          bio: 'Putra pertama dari Bpk. Bambang Wicaksono & Ibu Sri Rahayu',
          instagram: '@dimas.wicaksono',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        },
        bride: {
          fullName: 'Anindya Larasati, S.Ds.',
          bio: 'Putri kedua dari Bpk. Hendro Larasati & Ibu Ratna Dewi',
          instagram: '@anindya.larasati',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        },
      },
    },
    {
      id: 'sec-countdown',
      componentType: 'countdown',
      variant: 'boxes',
      order: 4,
      isVisible: true,
      props: {
        heading: 'Menghitung Hari Bahagia',
        targetDate: '2026-10-24T08:00:00',
        note: 'Kami sangat menantikan kehadiran Bapak/Ibu/Saudara/i sekalian.',
      },
    },
    {
      id: 'sec-event',
      componentType: 'event',
      variant: 'cards_side_by_side',
      order: 5,
      isVisible: true,
      props: {
        heading: 'Rangkaian Acara Pernikahan',
        events: [
          {
            title: 'Akad Nikah',
            dateText: 'Sabtu, 24 Oktober 2026',
            timeText: '08:00 - 10:00 WIB',
            venueName: 'Masjid Agung Kraton',
            venueAddress: 'Jl. Kauman No. 1, Kraton, Yogyakarta',
            mapsUrl: 'https://maps.google.com',
          },
          {
            title: 'Resepsi Pernikahan',
            dateText: 'Sabtu, 24 Oktober 2026',
            timeText: '11:00 - 14:00 WIB',
            venueName: 'Grand Ballroom Royal Ambarrukmo',
            venueAddress: 'Jl. Laksda Adisucipto No. 81, Yogyakarta',
            mapsUrl: 'https://maps.google.com',
          },
        ],
      },
    },
    {
      id: 'sec-story',
      componentType: 'story',
      variant: 'vertical_timeline',
      order: 6,
      isVisible: true,
      props: {
        heading: 'Perjalanan Kisah Cinta',
        milestones: [
          { year: '2020', title: 'Pertama Kali Bertemu', description: 'Bertemu di masa perkuliahan dan saling bertukar cerita.' },
          { year: '2023', title: 'Komitmen Bersama', description: 'Memutuskan untuk melangkah ke jenjang yang lebih serius.' },
          { year: '2026', title: 'Menuju Hari Bahagia', description: 'Mengikat janji suci pernikahan di hadapan keluarga dan sahabat tercinta.' },
        ],
      },
    },
    {
      id: 'sec-gallery',
      componentType: 'gallery',
      variant: 'grid',
      order: 7,
      isVisible: true,
      props: {
        heading: 'Galeri Foto Momen Bahagia',
        photos: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80', caption: 'Prewedding Moment' },
          { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80', caption: 'Our Precious Rings' },
          { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80', caption: 'Traditional Attire' },
          { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80', caption: 'Laughter & Joy' },
        ],
      },
    },
    {
      id: 'sec-location',
      componentType: 'location',
      variant: 'embedded_map',
      order: 8,
      isVisible: true,
      props: {
        heading: 'Lokasi & Peta Acara',
        venueName: 'Grand Ballroom Royal Ambarrukmo',
        address: 'Jl. Laksda Adisucipto No. 81, Ambarrukmo, Caturtunggal, Sleman, Yogyakarta',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.08861783856!2d110.398!3d-7.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDYnNDguMCJTIDExMMKwMjMnNTIuOCJF!5e0!3m2!1sid!2sid!4v1600000000000',
      },
    },
    {
      id: 'sec-gift',
      componentType: 'gift',
      variant: 'bank_cards',
      order: 9,
      isVisible: true,
      props: {
        heading: 'Tanda Kasih (Wedding Gift)',
        description: 'Doa restu Anda adalah hadiah terindah. Namun jika ingin memberikan tanda kasih secara digital, dapat melalui rekening berikut:',
        bankAccounts: [
          { bankName: 'BCA', accountNumber: '8830192831', accountHolder: 'Dimas Wicaksono' },
          { bankName: 'Bank Mandiri', accountNumber: '1370019283712', accountHolder: 'Anindya Larasati' },
        ],
      },
    },
    {
      id: 'sec-rsvp',
      componentType: 'rsvp',
      variant: 'form_card',
      order: 10,
      isVisible: true,
      props: {
        heading: 'Konfirmasi Kehadiran (RSVP)',
        subheading: 'Mohon konfirmasikan kehadiran Bapak/Ibu/Saudara/i untuk memudahkan penyiapan jamuan.',
      },
    },
    {
      id: 'sec-guestbook',
      componentType: 'guestbook',
      variant: 'message_list',
      order: 11,
      isVisible: true,
      props: {
        heading: 'Ucapan & Doa Restu',
        subheading: 'Tuliskan pesan doa terbaik untuk kedua mempelai.',
      },
    },
    {
      id: 'sec-closing',
      componentType: 'closing',
      variant: 'gratitude_note',
      order: 12,
      isVisible: true,
      props: {
        message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.',
        footerNote: 'Dimas & Anindya Beserta Seluruh Keluarga Besar',
      },
    },
  ]);

  const livePreviewConfig: InvitationConfig = useMemo(() => {
    return {
      version: 1,
      themeId: activeThemeId,
      templateId: id || 'custom-template',
      themeOverrides: Object.keys(themeOverrides).length > 0 ? themeOverrides : undefined,
      metadata: {
        title: name || 'Preview Master Template',
        groomName: (sections.find((s) => s.componentType === 'couple')?.props as any)?.groom?.fullName?.split(' ')[0] || 'Dimas',
        brideName: (sections.find((s) => s.componentType === 'couple')?.props as any)?.bride?.fullName?.split(' ')[0] || 'Anindya',
        eventDate: 'Sabtu, 24 Oktober 2026',
        locationCity: 'Yogyakarta',
        schemaVersion: 1,
        themeId: activeThemeId,
        templateId: id || 'custom-template',
      },
      sections: sections.map((s, idx) => ({ ...s, order: idx })),
    };
  }, [sections, activeThemeId, themeOverrides, id, name]);

  const selectedSection = sections[selectedSectionIdx] || sections[0];

  const updateSectionProp = (key: string, value: any) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[selectedSectionIdx] = {
        ...updated[selectedSectionIdx],
        props: {
          ...updated[selectedSectionIdx].props,
          [key]: value,
        },
      };
      return updated;
    });
  };

  const handleAddSection = (componentType: string) => {
    const meta = componentRegistry.get(componentType);
    const newSec: SectionConfig = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      componentType,
      variant: meta?.defaultVariant || 'default',
      order: sections.length,
      isVisible: true,
      props: meta?.defaultProps ? JSON.parse(JSON.stringify(meta.defaultProps)) : {},
    };
    setSections([...sections, newSec]);
    setSelectedSectionIdx(sections.length);
    setActiveTab('inspector');
  };

  const handleRemoveSection = (index: number) => {
    const updated = sections.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, order: idx }));
    setSections(updated);
    if (selectedSectionIdx >= updated.length) {
      setSelectedSectionIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    setSections(copy.map((s, idx) => ({ ...s, order: idx })));
    setSelectedSectionIdx(targetIdx);
  };

  const handleSelectSectionFromCanvas = (secId: string) => {
    const idx = sections.findIndex((s) => s.id === secId);
    if (idx !== -1) {
      setSelectedSectionIdx(idx);
      setActiveTab('inspector');
      if (!isDrawerOpen) setIsDrawerOpen(true);
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchCat = assetCategoryFilter === 'all' || a.category === assetCategoryFilter;
      const matchQuery = !assetSearchQuery || a.title.toLowerCase().includes(assetSearchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [assets, assetCategoryFilter, assetSearchQuery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const templateId = id.trim() ? id.toLowerCase().replace(/[^a-z0-9-]/g, '') : name.toLowerCase().replace(/\s+/g, '-');

    try {
      const templateSections: TemplateSectionDefinition[] = sections.map((sec, idx) => ({
        componentType: sec.componentType,
        defaultVariant: sec.variant,
        isOptional: false,
        defaultOrder: idx,
      }));

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: templateId,
          name,
          category,
          description: description || `Master Template ${name}`,
          thumbnailUrl,
          defaultSections: templateSections,
          supportedThemeIds: ['*'],
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push('/admin/templates');
        }, 1400);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 flex flex-col h-screen overflow-hidden select-none">
      {/* TOP STUDIO HEADER */}
      <header className="h-13 bg-[#080B14]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/templates"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isDrawerOpen ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
            }`}
            title="Sembunyikan / Buka Tools"
          >
            {isDrawerOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden md:inline text-[11px]">{isDrawerOpen ? 'Tutup Tools' : 'Buka Tools'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-emerald-400" />
            <span className="font-serif font-bold text-sm text-slate-100 hidden md:inline truncate max-w-[200px]">
              {name || 'Visual Template Studio'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
              {sections.length} Komponen
            </span>
          </div>
        </div>

        {/* Center: Device Switcher & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0D121F] p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setDeviceModel('android')}
              className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                deviceModel === 'android' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Android</span>
            </button>
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                deviceModel === 'iphone' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">iPhone</span>
            </button>
            <button
              onClick={() => setDeviceModel('desktop')}
              className={`px-3 py-1 rounded-xl text-xs hidden sm:flex items-center gap-1.5 transition-all ${
                deviceModel === 'desktop' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px]">Desktop</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-1 bg-[#0D121F] px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 rounded text-slate-400 hover:text-white">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(125, zoom + 10))} className="p-1 rounded text-slate-400 hover:text-white">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Save Template */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Menyimpan...' : 'Daftarkan Master Template'}</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE WITH BOUNDED LIVE SIMULATOR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT TOOL DRAWER */}
        {isDrawerOpen && (
          <aside className="w-80 sm:w-96 bg-[#090C16]/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col shrink-0 z-30 shadow-2xl">
            {/* Tabs */}
            <div className="grid grid-cols-5 border-b border-slate-800/80 bg-[#0B0F1B] p-1 gap-0.5 text-xs">
              <button
                onClick={() => setActiveTab('sections')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'sections' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-[10px]">Struktur</span>
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'inspector' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-[10px]">Inspektur</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'media' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px]">Media Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('themes')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'themes' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span className="text-[10px]">Tema</span>
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'info' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span className="text-[10px]">Info</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {/* TAB 1: SECTIONS STRUCTURE */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">Susunan Komposisi Template</p>
                      <p className="text-[11px] text-slate-400">Klik bagian untuk mengedit teks & background</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {sections.map((sec, idx) => {
                      const isSelected = selectedSectionIdx === idx;
                      return (
                        <div
                          key={sec.id}
                          onClick={() => {
                            setSelectedSectionIdx(idx);
                            setActiveTab('inspector');
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-500/30'
                              : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-100 capitalize truncate">
                                {sec.componentType}
                              </p>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                Varian: {sec.variant}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSection(idx, 'up');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === sections.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSection(idx, 'down');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSection(idx);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      + Tambah Komponen Kanonikal:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {availableComponents.map((c) => (
                        <button
                          key={c.type}
                          type="button"
                          onClick={() => handleAddSection(c.type)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 text-left transition-all flex items-center gap-2 group"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-[11px] truncate">{c.displayName.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INSPECTOR */}
              {activeTab === 'inspector' && (
                <div className="space-y-4">
                  {selectedSection ? (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">Inspektur Bagian</span>
                          <h3 className="text-sm font-serif font-bold text-white capitalize">{selectedSection.componentType}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold">
                          Bagian #{selectedSectionIdx + 1}
                        </span>
                      </div>

                      {/* HERO PROPS */}
                      {selectedSection.componentType === 'hero' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="space-y-1">
                            <label className="text-slate-400">Judul Atas (Heading)</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.title || ''}
                              onChange={(e) => updateSectionProp('title', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-slate-400">Pria (Panggilan)</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.groomNickname || ''}
                                onChange={(e) => updateSectionProp('groomNickname', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Wanita (Panggilan)</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.brideNickname || ''}
                                onChange={(e) => updateSectionProp('brideNickname', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Tanggal Acara</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.eventDate || ''}
                              onChange={(e) => updateSectionProp('eventDate', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Kota Lokasi</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.venueCity || ''}
                              onChange={(e) => updateSectionProp('venueCity', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">URL Background Foto Hero</label>
                            <input
                              type="url"
                              value={(selectedSection.props as any)?.heroImage || ''}
                              onChange={(e) => updateSectionProp('heroImage', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* OPENING PROPS */}
                      {selectedSection.componentType === 'opening' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="space-y-1">
                            <label className="text-slate-400">Badge Label</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.badgeText || ''}
                              onChange={(e) => updateSectionProp('badgeText', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Salam Pembuka</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.salutation || ''}
                              onChange={(e) => updateSectionProp('salutation', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Teks Undangan</label>
                            <textarea
                              rows={3}
                              value={(selectedSection.props as any)?.invitationText || ''}
                              onChange={(e) => updateSectionProp('invitationText', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Foto Background Amplop</label>
                            <input
                              type="url"
                              value={(selectedSection.props as any)?.backgroundImage || ''}
                              onChange={(e) => updateSectionProp('backgroundImage', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* QUOTE PROPS */}
                      {selectedSection.componentType === 'quote' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="space-y-1">
                            <label className="text-slate-400">Teks Arab (Opsional)</label>
                            <textarea
                              rows={2}
                              value={(selectedSection.props as any)?.arabicText || ''}
                              onChange={(e) => updateSectionProp('arabicText', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-serif text-right"
                              dir="rtl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Kutipan / Terjemahan Ayat</label>
                            <textarea
                              rows={3}
                              value={(selectedSection.props as any)?.quoteText || ''}
                              onChange={(e) => updateSectionProp('quoteText', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-400">Sumber (Surah / Tokoh)</label>
                            <input
                              type="text"
                              value={(selectedSection.props as any)?.source || ''}
                              onChange={(e) => updateSectionProp('source', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                        </div>
                      )}

                      {/* COUPLE PROPS */}
                      {selectedSection.componentType === 'couple' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <p className="font-bold text-emerald-400">Mempelai Pria</p>
                            <input
                              type="text"
                              placeholder="Nama Lengkap & Gelar"
                              value={(selectedSection.props as any)?.groom?.fullName || ''}
                              onChange={(e) => {
                                const groom = { ...((selectedSection.props as any)?.groom || {}), fullName: e.target.value };
                                updateSectionProp('groom', groom);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              placeholder="Bio / Orang Tua"
                              value={(selectedSection.props as any)?.groom?.bio || ''}
                              onChange={(e) => {
                                const groom = { ...((selectedSection.props as any)?.groom || {}), bio: e.target.value };
                                updateSectionProp('groom', groom);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                            />
                            <input
                              type="url"
                              placeholder="URL Foto Mempelai Pria"
                              value={(selectedSection.props as any)?.groom?.photoUrl || ''}
                              onChange={(e) => {
                                const groom = { ...((selectedSection.props as any)?.groom || {}), photoUrl: e.target.value };
                                updateSectionProp('groom', groom);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                            />
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <p className="font-bold text-emerald-400">Mempelai Wanita</p>
                            <input
                              type="text"
                              placeholder="Nama Lengkap & Gelar"
                              value={(selectedSection.props as any)?.bride?.fullName || ''}
                              onChange={(e) => {
                                const bride = { ...((selectedSection.props as any)?.bride || {}), fullName: e.target.value };
                                updateSectionProp('bride', bride);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              placeholder="Bio / Orang Tua"
                              value={(selectedSection.props as any)?.bride?.bio || ''}
                              onChange={(e) => {
                                const bride = { ...((selectedSection.props as any)?.bride || {}), bio: e.target.value };
                                updateSectionProp('bride', bride);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                            />
                            <input
                              type="url"
                              placeholder="URL Foto Mempelai Wanita"
                              value={(selectedSection.props as any)?.bride?.photoUrl || ''}
                              onChange={(e) => {
                                const bride = { ...((selectedSection.props as any)?.bride || {}), photoUrl: e.target.value };
                                updateSectionProp('bride', bride);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* TAB 3: DYNAMIC MEDIA HUB (FULL CRUD) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-400">Media & Asset Hub</p>
                      <p className="text-[11px] text-slate-400">Kelola dan gunakan aset gambar undangan</p>
                    </div>
                    <button
                      onClick={() => setShowAddAssetModal(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow hover:bg-emerald-400 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Aset</span>
                    </button>
                  </div>

                  {/* Search & Category Filter */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Cari foto atau tag..."
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {['all', 'cover', 'groom', 'bride', 'gallery', 'background'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setAssetCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all ${
                            assetCategoryFilter === cat
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {cat === 'all' ? 'Semua' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assets Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition-all bg-slate-900"
                      >
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-2 space-y-1">
                          <p className="text-[10px] font-bold text-white truncate">{asset.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-emerald-400 font-mono uppercase bg-slate-950 px-1.5 py-0.5 rounded">
                              {asset.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  if (selectedSection.componentType === 'hero') {
                                    updateSectionProp('heroImage', asset.url);
                                  } else if (selectedSection.componentType === 'opening') {
                                    updateSectionProp('backgroundImage', asset.url);
                                  } else if (selectedSection.componentType === 'couple') {
                                    const groom = { ...((selectedSection.props as any)?.groom || {}), photoUrl: asset.url };
                                    updateSectionProp('groom', groom);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[9px] transition-colors"
                                title="Terapkan ke bagian aktif"
                              >
                                Pakai
                              </button>
                              <button
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="p-1 rounded text-slate-500 hover:text-red-400"
                                title="Hapus aset"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: THEMES */}
              {activeTab === 'themes' && (
                <div className="space-y-4">
                  <label className="text-slate-300 font-semibold block">Pratinjau Dengan Palet Tema</label>
                  <div className="space-y-2.5">
                    {themes.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveThemeId(t.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          activeThemeId === t.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{t.name}</p>
                          <p className="text-[10px] text-slate-400">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: t.colors.primary }} />
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: t.colors.background }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: INFO */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Nama Master Template</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!id) setId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Template ID (Slug)</label>
                    <input
                      type="text"
                      required
                      value={id}
                      onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Kategori</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="cinematic">Cinematic Flow</option>
                      <option value="editorial">Editorial Magazine</option>
                      <option value="minimal">Minimal Modern</option>
                      <option value="romantic">Romantic Velvet</option>
                      <option value="classic">Classic Heritage (Adat)</option>
                      <option value="modern">Modern Luxury</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Deskripsi Ringkas</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER LIVE INTERACTIVE SIMULATOR (BOUNDED TO VIEWPORT) */}
        <main
          className="flex-1 bg-[#04060C] flex items-center justify-center overflow-hidden p-2 sm:p-4 relative"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
            }}
            className="flex items-center justify-center max-h-full"
          >
            {/* ANDROID DEVICE SIMULATOR (COMPACT & BOUNDED) */}
            {deviceModel === 'android' && (
              <div className="relative transition-all duration-300">
                <div className="w-[350px] h-[680px] bg-[#121622] rounded-[38px] p-[8px] android-device-shadow relative border border-slate-700/60 ring-1 ring-slate-800 flex flex-col">
                  {/* Buttons */}
                  <div className="absolute -left-[10px] top-[120px] w-[2.5px] h-[45px] bg-slate-700 rounded-l-md" />
                  <div className="absolute -left-[10px] top-[180px] w-[2.5px] h-[45px] bg-slate-700 rounded-l-md" />
                  <div className="absolute -right-[10px] top-[140px] w-[2.5px] h-[35px] bg-slate-700 rounded-r-md" />

                  <div className="w-full h-full bg-[#0E121E] rounded-[30px] overflow-hidden flex flex-col relative border border-slate-900/80">
                    {/* Status Bar */}
                    <div className="h-6 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 select-none text-[10px] text-slate-300 font-sans">
                      <span className="font-semibold">12:45</span>
                      <div className="w-3 h-3 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                        <div className="w-1 h-1 bg-slate-900 rounded-full" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-[8px] font-bold">5G</span>
                        <Wifi className="w-2.5 h-2.5" />
                        <Battery className="w-3 h-3 text-slate-300" />
                      </div>
                    </div>

                    {/* Live Preview Render */}
                    <div className="flex-1 overflow-y-auto bg-background relative">
                      <WeddingRenderer
                        config={livePreviewConfig}
                        isEditable={true}
                        selectedSectionId={selectedSection.id}
                        onSelectSection={handleSelectSectionFromCanvas}
                      />
                    </div>

                    {/* Bottom Nav Pill */}
                    <div className="h-4 bg-slate-950/95 flex items-center justify-center shrink-0 z-30">
                      <div className="w-24 h-1 bg-slate-600/60 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IPHONE DEVICE SIMULATOR (COMPACT) */}
            {deviceModel === 'iphone' && (
              <div className="relative transition-all duration-300">
                <div className="w-[340px] h-[680px] bg-[#181C26] rounded-[44px] p-[10px] iphone-device-shadow relative border border-slate-700/60 ring-1 ring-slate-800 flex flex-col">
                  <div className="w-full h-full bg-[#0E121E] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-900/80">
                    <div className="sticky top-0 left-0 right-0 z-40 flex justify-center pt-2 pointer-events-none">
                      <div className="w-20 h-4 bg-black rounded-full shadow-lg flex items-center justify-end px-2 border border-slate-900">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-800" />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-background relative -mt-6">
                      <div className="h-6" />
                      <WeddingRenderer
                        config={livePreviewConfig}
                        isEditable={true}
                        selectedSectionId={selectedSection.id}
                        onSelectSection={handleSelectSectionFromCanvas}
                      />
                    </div>

                    <div className="h-4 bg-slate-950/90 flex items-center justify-center shrink-0 z-30">
                      <div className="w-28 h-1 bg-slate-500/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DESKTOP RESPONSIVE SIMULATOR */}
            {deviceModel === 'desktop' && (
              <div className="w-full max-w-4xl h-[680px] bg-[#0E121E] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
                <div className="h-7 bg-slate-900 px-3 flex items-center gap-2 border-b border-slate-800 shrink-0">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 max-w-xs mx-auto bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 text-center border border-slate-800 truncate">
                    Template: {name}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-background">
                  <WeddingRenderer
                    config={livePreviewConfig}
                    isEditable={true}
                    selectedSectionId={selectedSection.id}
                    onSelectSection={handleSelectSectionFromCanvas}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ADD NEW ASSET MODAL */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-base text-white">Tambah Aset Media Baru</h3>
              </div>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddNewAsset} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Judul / Nama Foto</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foto Prewedding Bromo"
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Kategori</label>
                <select
                  value={newAssetCategory}
                  onChange={(e) => setNewAssetCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                >
                  <option value="cover">Cover / Hero Banner</option>
                  <option value="groom">Mempelai Pria</option>
                  <option value="bride">Mempelai Wanita</option>
                  <option value="gallery">Galeri Foto</option>
                  <option value="background">Background Texture</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">URL Gambar (Direct Link)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              {newAssetUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 h-28 bg-slate-950">
                  <img src={newAssetUrl} alt="Pratinjau" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addingAsset}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  {addingAsset ? 'Menyimpan...' : 'Simpan Aset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-white">Master Template Berhasil Didaftarkan!</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Template <span className="text-emerald-400 font-bold">"{name}"</span> sekarang siap digunakan untuk membuat undangan klien baru.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}