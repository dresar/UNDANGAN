'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Send,
  Undo,
  Redo,
  Save,
  Layers,
  Palette,
  ChevronUp,
  ChevronDown,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Wand2,
  Music,
  Share2,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  Edit3,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Heart,
  Gift,
  Film,
  Quote as QuoteIcon,
  Clock,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  Battery,
  Volume2,
  LayoutTemplate,
  Download,
  FileCode2,
  Sparkle,
} from 'lucide-react';
import { InvitationConfig, SectionConfig } from '@/core/domain/invitation/invitation.types';
import { WeddingRenderer } from '@/core/renderer/wedding-renderer';
import { ConfigMutators } from '@/core/editor/config-mutators';
import { HistoryManager } from '@/core/editor/history-manager';
import { themeRegistry } from '@/core/registry/theme-registry';
import { templateRegistry } from '@/core/registry/template-registry';
import { componentRegistry } from '@/core/registry/component-registry';
import { InvitationGenerator } from '@/core/engine/invitation-generator';
import { TemplateDefinition } from '@/core/domain/template/template.types';

const AVAILABLE_COMPONENTS = [
  { type: 'hero', name: 'Hero Cover', icon: Sparkles, desc: 'Cover pembuka dengan nama kedua mempelai & tanggal acara' },
  { type: 'opening', name: 'Amplop / Greeting', icon: Heart, desc: 'Salam pembuka dan kartu tamu personal' },
  { type: 'quote', name: 'Kutipan Ayat / Doa', icon: QuoteIcon, desc: 'Ayat suci atau kata mutiara pernikahan penuh makna' },
  { type: 'couple', name: 'Profil Mempelai', icon: Heart, desc: 'Foto pengantin, bio, nama orang tua, & Instagram' },
  { type: 'event', name: 'Rangkaian Acara', icon: Calendar, desc: 'Jadwal & rincian Akad Nikah, Resepsi, & Unduh Mantu' },
  { type: 'countdown', name: 'Hitung Mundur (Countdown)', icon: Clock, desc: 'Timer waktu mundur langsung menuju hari bahagia' },
  { type: 'story', name: 'Kisah Cinta (Love Story)', icon: BookOpen, desc: 'Timeline perjalanan romantis pertama bertemu hingga menikah' },
  { type: 'gallery', name: 'Galeri Foto & Momen', icon: ImageIcon, desc: 'Koleksi foto prewedding dalam grid/polaroid estetik' },
  { type: 'location', name: 'Lokasi & Google Maps', icon: MapPin, desc: 'Peta digital interaktif & petunjuk rute jalan' },
  { type: 'timeline', name: 'Rundown Acara', icon: Clock, desc: 'Susunan acara mendetail jam demi jam' },
  { type: 'gift', name: 'Amplop Digital (Gift)', icon: Gift, desc: 'Nomor rekening BCA/Mandiri, QRIS, & alamat pengiriman kado' },
  { type: 'rsvp', name: 'Konfirmasi Hadir (RSVP)', icon: CheckCircle2, desc: 'Formulir konfirmasi kehadiran tamu undangan' },
  { type: 'guestbook', name: 'Buku Tamu & Ucapan', icon: MessageSquare, desc: 'Doa restu & ucapan selamat dari tamu' },
  { type: 'music', name: 'Musik Latar (Audio Player)', icon: Music, desc: 'Soundtrack romantis otomatis dengan kontrol audio' },
  { type: 'video', name: 'Video Pernikahan / Prewed', icon: Film, desc: 'Embed video sinematik YouTube atau Vimeo' },
  { type: 'closing', name: 'Salam Penutup', icon: Heart, desc: 'Ucapan terima kasih & salam hangat kedua keluarga' },
  { type: 'decorative', name: 'Ornamen Dekoratif', icon: Sparkles, desc: 'Aksen bunga & hiasan mewah' },
  { type: 'divider', name: 'Pemisah Bagian (Divider)', icon: Sliders, desc: 'Garis pemisah elegan antar bagian' },
];

const PRESET_WEDDING_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80', label: 'Classic Elegance Prewedding', tag: 'Cover/Hero' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80', label: 'Romantic Sunset Glow', tag: 'Hero/Cover' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80', label: 'Bride Portrait Minimalist', tag: 'Mempelai Wanita' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80', label: 'Groom Portrait Formal', tag: 'Mempelai Pria' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80', label: 'Wedding Rings & Florals', tag: 'Galeri/Detail' },
  { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&auto=format&fit=crop&q=80', label: 'Traditional Heritage Dress', tag: 'Mempelai/Adat' },
  { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1000&auto=format&fit=crop&q=80', label: 'Bohemian Garden Romance', tag: 'Galeri' },
  { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80', label: 'Happy Couple Laughter', tag: 'Galeri' },
];

const PRESET_MUSIC_TRACKS = [
  { title: 'A Thousand Years (Romantic Piano & Cello)', artist: 'Acoustic Wedding Sessions', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-wedding-113063.mp3' },
  { title: 'Canon in D Major (Classical Orchestra)', artist: 'Johann Pachelbel', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=canon-in-d-major-6065.mp3' },
  { title: 'Gamelan Jawa Laras Pelog (Royal Heritage)', artist: 'Traditional Nusantara Ensemble', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_248faebbf4.mp3?filename=indonesian-gamelan-ambient-10657.mp3' },
  { title: 'Warm Acoustic Sunrise (Folk Love Song)', artist: 'Acoustic Melody Duo', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=acoustic-guitars-ambient-uplifting-122771.mp3' },
];

export default function StandaloneEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [slug, setSlug] = useState('');
  const [deviceModel, setDeviceModel] = useState<'android' | 'iphone' | 'tablet' | 'desktop'>('android');
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'sections' | 'inspector' | 'media' | 'theme' | 'ai' | 'music' | 'settings'>('templates');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [historyManager, setHistoryManager] = useState<HistoryManager | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoSavedTime, setAutoSavedTime] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');
  const [guestNameInput, setGuestNameInput] = useState('Bapak Joko & Keluarga');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<'cinematic' | 'editorial' | 'minimal' | 'romantic' | 'classic' | 'modern'>('cinematic');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);
  const [selectedImageSlot, setSelectedImageSlot] = useState<string>('hero-cover');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [jsonExportCopied, setJsonExportCopied] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [publishModal, setPublishModal] = useState<{ isOpen: boolean; error?: string; successUrl?: string }>({
    isOpen: false,
  });

  // Dynamic Assets State
  const [dynamicAssets, setDynamicAssets] = useState<any[]>([]);
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('gallery');
  const [addingAsset, setAddingAsset] = useState(false);

  useEffect(() => {
    fetchDynamicAssets();
  }, []);

  const fetchDynamicAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      if (data.assets) setDynamicAssets(data.assets);
    } catch {
      // ignore
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
        fetchDynamicAssets();
      }
    } finally {
      setAddingAsset(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Hapus aset ini dari galeri?')) return;
    try {
      await fetch(`/api/assets?id=${assetId}`, { method: 'DELETE' });
      setDynamicAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.version?.draftConfig && Object.keys(data.version.draftConfig).length > 0) {
          setConfig(data.version.draftConfig);
          setSlug(data.invitation?.slug || 'wedding-klien');
          setHistoryManager(new HistoryManager(data.version.draftConfig));
          if (data.version.draftConfig.sections?.length > 0) {
            setSelectedSectionId(data.version.draftConfig.sections[0].id);
          }
        } else {
          const fallback = InvitationGenerator.createFromTemplate({
            groomName: 'Eka Pratama, S.T.',
            brideName: 'Rani Safitri, S.Ds.',
            eventDate: 'Sabtu, 24 Oktober 2026',
          });
          setConfig(fallback);
          setSlug('eka-dan-rani');
          setHistoryManager(new HistoryManager(fallback));
          if (fallback.sections?.length > 0) {
            setSelectedSectionId(fallback.sections[0].id);
          }
        }
      })
      .catch(() => {
        const fallback = InvitationGenerator.createFromTemplate({
          groomName: 'Eka Pratama, S.T.',
          brideName: 'Rani Safitri, S.Ds.',
          eventDate: 'Sabtu, 24 Oktober 2026',
        });
        setConfig(fallback);
        setSlug('eka-dan-rani');
        setHistoryManager(new HistoryManager(fallback));
        if (fallback.sections?.length > 0) {
          setSelectedSectionId(fallback.sections[0].id);
        }
      });
  }, [id]);

  const mutateConfig = (updated: InvitationConfig) => {
    setConfig(updated);
    historyManager?.push(updated);
    setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleUndo = () => {
    const prev = historyManager?.undo();
    if (prev) setConfig({ ...prev });
  };

  const handleRedo = () => {
    const next = historyManager?.redo();
    if (next) setConfig({ ...next });
  };

  const handleSaveDraft = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, slug }),
      });
      setAutoSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId: id,
          config,
          slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishModal({ isOpen: true, error: data.error || 'Gagal mempublikasikan undangan.' });
      } else {
        setPublishModal({ isOpen: true, successUrl: data.publishedUrl });
      }
    } catch (err: any) {
      setPublishModal({ isOpen: true, error: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTemplate = (tpl: TemplateDefinition) => {
    if (!config) return;
    if (confirm(`Terapkan template "${tpl.name}"? Struktur bagian akan disesuaikan dengan template ini.`)) {
      const newConfig = InvitationGenerator.createFromTemplate({
        templateId: tpl.id,
        themeId: config.themeId,
        groomName: config.metadata.groomName,
        brideName: config.metadata.brideName,
        eventDate: config.metadata.eventDate,
        city: config.metadata.locationCity || 'Jakarta',
      });
      mutateConfig(newConfig);
      if (newConfig.sections.length > 0) {
        setSelectedSectionId(newConfig.sections[0].id);
      }
    }
  };

  const handleSaveAsMasterTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newTemplateName.trim()) return;

    setSaving(true);
    try {
      const templateSections = config.sections.map((sec, idx) => ({
        componentType: sec.componentType,
        defaultVariant: sec.variant,
        isOptional: false,
        defaultOrder: idx,
      }));

      const tplId = newTemplateName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tplId,
          name: newTemplateName,
          category: newTemplateCategory,
          description: newTemplateDesc || `Template ${newTemplateName} dirancang dengan ${templateSections.length} bagian.`,
          defaultSections: templateSections,
          supportedThemeIds: ['*'],
        }),
      });

      if (res.ok) {
        setTemplateSaveSuccess(true);
        setTimeout(() => {
          setTemplateSaveSuccess(false);
          setShowSaveTemplateModal(false);
          setNewTemplateName('');
          setNewTemplateDesc('');
        }, 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAiRefine = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim() || !config) return;
    setAiLoading(true);
    setAiSuccessMsg('');
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groomName: config.metadata.groomName,
          brideName: config.metadata.brideName,
          eventDate: config.metadata.eventDate,
          naturalLanguagePrompt: promptToUse,
          preferredTheme: config.themeId,
        }),
      });
      const data = await res.json();
      if (data.plan) {
        let updated = { ...config };
        if (data.plan.recommendedThemeId) {
          updated = ConfigMutators.updateTheme(updated, data.plan.recommendedThemeId);
        }
        if (data.plan.editorialTagline) {
          updated = ConfigMutators.updateMetadata(updated, { description: data.plan.editorialTagline });
        }
        mutateConfig(updated);
        setAiSuccessMsg('Desain dan komposisi berhasil disesuaikan AI!');
        if (!customPrompt) setAiPrompt('');
        setTimeout(() => setAiSuccessMsg(''), 4000);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleBindPhoto = (photoUrl: string) => {
    if (!config) return;
    if (selectedImageSlot === 'hero-cover') {
      const heroSec = config.sections.find((s) => s.componentType === 'hero');
      if (heroSec) {
        mutateConfig(ConfigMutators.updateSectionProps(config, heroSec.id, { heroImage: photoUrl, backgroundImage: photoUrl }));
      }
    } else if (selectedImageSlot === 'groom-photo') {
      const coupleSec = config.sections.find((s) => s.componentType === 'couple');
      if (coupleSec) {
        const groom = (coupleSec.props as any)?.groom || {};
        mutateConfig(ConfigMutators.updateSectionProps(config, coupleSec.id, { groom: { ...groom, photoUrl } }));
      }
    } else if (selectedImageSlot === 'bride-photo') {
      const coupleSec = config.sections.find((s) => s.componentType === 'couple');
      if (coupleSec) {
        const bride = (coupleSec.props as any)?.bride || {};
        mutateConfig(ConfigMutators.updateSectionProps(config, coupleSec.id, { bride: { ...bride, photoUrl } }));
      }
    } else if (selectedImageSlot === 'gallery-add') {
      const gallerySec = config.sections.find((s) => s.componentType === 'gallery');
      if (gallerySec) {
        const photos = [...(((gallerySec.props as any)?.photos as any[]) || [])];
        photos.push({ url: photoUrl, caption: 'Momen Bahagia Mempelai' });
        mutateConfig(ConfigMutators.updateSectionProps(config, gallerySec.id, { photos }));
      }
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-[#05070E] flex flex-col items-center justify-center space-y-4 text-slate-100">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">Memuat Studio Canvas Editor...</p>
      </div>
    );
  }

  const allTemplates = templateRegistry.getAll();
  const themes = themeRegistry.getAll();
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);
  const selectedSection = config.sections.find((s) => s.id === selectedSectionId) || sortedSections[0];

  const handleSelectSection = (secId: string) => {
    setSelectedSectionId(secId);
    setActiveTab('inspector');
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 flex flex-col h-screen overflow-hidden select-none">
      {/* TOP STUDIO HEADER BAR */}
      <header className="h-14 bg-[#080B14]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 z-40">
        {/* Left: Back, Sidebar Toggle, & Title */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/invitations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-medium"
            title="Keluar ke Dashboard Undangan"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isSidebarOpen
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
            }`}
            title={isSidebarOpen ? 'Sembunyikan Panel Editor (Zen Mode)' : 'Tampilkan Panel Editor'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden md:inline text-[11px]">{isSidebarOpen ? 'Sembunyikan' : 'Buka Tools'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800/80 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-slate-100 hidden lg:inline truncate max-w-[180px]">
              {config.metadata.title || 'Studio Undangan'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
              /{slug}
            </span>
            {autoSavedTime && (
              <span className="text-[10px] text-slate-500 font-sans hidden xl:inline">
                Tersimpan {autoSavedTime}
              </span>
            )}
          </div>
        </div>

        {/* Center: Device Mockup Switcher & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0D121F] p-1 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setDeviceModel('android')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                deviceModel === 'android'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pratinjau Smartphone Android (Samsung Galaxy / Pixel)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Android</span>
            </button>
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                deviceModel === 'iphone'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pratinjau iPhone 16 Pro (Dynamic Island)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">iPhone</span>
            </button>
            <button
              onClick={() => setDeviceModel('tablet')}
              className={`px-3 py-1.5 rounded-xl text-xs hidden sm:flex items-center gap-1.5 transition-all ${
                deviceModel === 'tablet'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pratinjau Layar Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceModel('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs hidden md:flex items-center gap-1.5 transition-all ${
                deviceModel === 'desktop'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pratinjau Komputer / Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px]">Desktop</span>
            </button>
          </div>

          {/* Zoom */}
          <div className="hidden 2xl:flex items-center gap-1 bg-[#0D121F] px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 15))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(125, zoom + 15))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={!historyManager?.canUndo()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!historyManager?.canRedo()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* JSON Export/Import */}
          <button
            onClick={() => setShowJsonModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Ekspor / Impor JSON Template"
          >
            <FileCode2 className="w-4 h-4" />
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPreviewMode
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Pratinjau Pengunjung Interaktif"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>

          {/* Save Draft */}
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{saving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* COLLAPSIBLE LEFT TOOL DRAWER */}
        {isSidebarOpen && !isPreviewMode && (
          <aside className="w-80 sm:w-96 bg-[#090C16]/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col shrink-0 z-30 shadow-2xl transition-all duration-300">
            {/* Dock Tabs */}
            <div className="grid grid-cols-7 border-b border-slate-800/80 bg-[#0B0F1B] p-1 gap-0.5 text-xs">
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'templates' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Templates Studio"
              >
                <LayoutTemplate className="w-4 h-4" />
                <span className="text-[9px]">Template</span>
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'sections' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Struktur Bagian"
              >
                <Layers className="w-4 h-4" />
                <span className="text-[9px]">Struktur</span>
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'inspector' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Edit Konten Bagian"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-[9px]">Konten</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'media' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Studio Gambar & Foto"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[9px]">Gambar</span>
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'theme' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tema & Tipografi"
              >
                <Palette className="w-4 h-4" />
                <span className="text-[9px]">Tema</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'ai' ? 'bg-slate-800 text-purple-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="AI Designer"
              >
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span className="text-[9px] text-purple-400 font-bold">AI Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`py-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'music' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Musik Romantis"
              >
                <Music className="w-4 h-4" />
                <span className="text-[9px]">Audio</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {/* TAB 0: TEMPLATES STUDIO */}
              {activeTab === 'templates' && (
                <div className="space-y-5">
                  {/* Top Banner & Save Action */}
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 text-emerald-400" />
                        <span className="font-serif font-bold text-sm text-white">Master Template Studio</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        {allTemplates.length} Template
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Ganti struktur template undangan secara instan atau simpan komposisi desain Anda saat ini sebagai Master Template baru.
                    </p>
                    <button
                      onClick={() => setShowSaveTemplateModal(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Simpan Desain Sebagai Template Baru</span>
                    </button>
                  </div>

                  {/* Template Presets Gallery */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-semibold block">Daftar Master Template Kanonikal</label>
                    <div className="space-y-3">
                      {allTemplates.map((tpl) => {
                        const isCurrent = config.templateId === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            className={`p-3.5 rounded-2xl border transition-all space-y-3 group ${
                              isCurrent
                                ? 'bg-emerald-500/10 border-emerald-500 shadow-lg ring-1 ring-emerald-500/40'
                                : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {tpl.thumbnailUrl && (
                                <img
                                  src={tpl.thumbnailUrl}
                                  alt={tpl.name}
                                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-slate-800 text-emerald-400">
                                    {tpl.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {tpl.defaultSections.length} Bagian
                                  </span>
                                </div>
                                <h4 className="font-bold font-serif text-slate-100 text-sm">{tpl.name}</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{tpl.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <span>Sections:</span>
                                <span className="font-mono text-emerald-400">
                                  {tpl.defaultSections.slice(0, 3).map((s) => s.componentType).join(', ')}...
                                </span>
                              </div>
                              <button
                                onClick={() => handleApplyTemplate(tpl)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow'
                                }`}
                              >
                                {isCurrent ? 'Aktif' : 'Terapkan'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: SECTIONS & STRUCTURE */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">Susunan Bagian Halaman</p>
                      <p className="text-[11px] text-slate-400">Atur urutan dan visibilitas komponen</p>
                    </div>
                    <button
                      onClick={() => setShowAddComponentModal(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Bagian</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sortedSections.map((sec, idx) => {
                      const isSelected = selectedSectionId === sec.id;
                      return (
                        <div
                          key={sec.id}
                          onClick={() => handleSelectSection(sec.id)}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200 shadow-lg ring-1 ring-emerald-500/30'
                              : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                mutateConfig(ConfigMutators.toggleSectionVisibility(config, sec.id));
                              }}
                              className={`p-1 rounded-md ${sec.isVisible ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-slate-600 hover:bg-slate-800'}`}
                              title={sec.isVisible ? 'Sembunyikan Bagian' : 'Tampilkan Bagian'}
                            >
                              {sec.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <div className="min-w-0">
                              <p className={`font-bold capitalize truncate ${sec.isVisible ? 'text-slate-100' : 'text-slate-500 line-through'}`}>
                                {sec.componentType}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Varian: {sec.variant}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                mutateConfig(ConfigMutators.duplicateSection(config, sec.id));
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white"
                              title="Duplikat Bagian"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                mutateConfig(ConfigMutators.reorderSections(config, idx, idx - 1));
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                              title="Geser ke Atas"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === sortedSections.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                mutateConfig(ConfigMutators.reorderSections(config, idx, idx + 1));
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 disabled:opacity-20"
                              title="Geser ke Bawah"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Hapus bagian ${sec.componentType}?`)) {
                                  mutateConfig(ConfigMutators.removeSection(config, sec.id));
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                              title="Hapus Bagian"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: INSPECTOR (DEEP SECTION PROPS EDITOR) */}
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
                          ID: {selectedSection.id.substring(0, 10)}
                        </span>
                      </div>

                      {/* Variant Selector */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">Gaya Layout (Varian)</label>
                        <select
                          value={selectedSection.variant}
                          onChange={(e) =>
                            mutateConfig(ConfigMutators.updateSectionVariant(config, selectedSection.id, e.target.value))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="centered">Centered (Simetris Elegan)</option>
                          <option value="split">Split Layout (Kiri-Kanan)</option>
                          <option value="card">Card Box (Kotak Mewah)</option>
                          <option value="minimal">Minimalist (Bersih & Ramping)</option>
                          <option value="grid">Grid Mode</option>
                          <option value="masonry">Masonry Mode</option>
                        </select>
                      </div>

                      {/* Dynamic Form Props based on componentType */}
                      <div className="space-y-3 pt-2 border-t border-slate-800/80">
                        {/* HERO PROPS */}
                        {selectedSection.componentType === 'hero' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-slate-400">Panggilan Pengantin Pria</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.groomNickname || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { groomNickname: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Panggilan Pengantin Wanita</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.brideNickname || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { brideNickname: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Tanggal Acara</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.eventDate || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { eventDate: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Kota Lokasi</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.venueCity || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { venueCity: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </>
                        )}

                        {/* QUOTE PROPS */}
                        {selectedSection.componentType === 'quote' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-slate-400">Teks Arab (Opsional)</label>
                              <textarea
                                rows={2}
                                value={(selectedSection.props as any)?.arabicText || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { arabicText: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-serif text-right"
                                dir="rtl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Kutipan / Terjemahan Ayat</label>
                              <textarea
                                rows={3}
                                value={(selectedSection.props as any)?.quoteText || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { quoteText: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Sumber Kutipan (QS / Tokoh)</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.source || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { source: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </>
                        )}

                        {/* COUPLE PROPS */}
                        {selectedSection.componentType === 'couple' && (
                          <>
                            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                              <p className="font-bold text-emerald-400">Mempelai Pria</p>
                              <input
                                type="text"
                                placeholder="Nama Lengkap & Gelar"
                                value={(selectedSection.props as any)?.groom?.fullName || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, {
                                    groom: { ...((selectedSection.props as any)?.groom || {}), fullName: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                              />
                              <input
                                type="text"
                                placeholder="Putra dari Bpk. ... & Ibu ..."
                                value={(selectedSection.props as any)?.groom?.bio || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, {
                                    groom: { ...((selectedSection.props as any)?.groom || {}), bio: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                              <p className="font-bold text-emerald-400">Mempelai Wanita</p>
                              <input
                                type="text"
                                placeholder="Nama Lengkap & Gelar"
                                value={(selectedSection.props as any)?.bride?.fullName || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, {
                                    bride: { ...((selectedSection.props as any)?.bride || {}), fullName: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                              />
                              <input
                                type="text"
                                placeholder="Putri dari Bpk. ... & Ibu ..."
                                value={(selectedSection.props as any)?.bride?.bio || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, {
                                    bride: { ...((selectedSection.props as any)?.bride || {}), bio: e.target.value },
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </>
                        )}

                        {/* OPENING PROPS */}
                        {selectedSection.componentType === 'opening' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-slate-400">Badge Label</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.badgeText || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { badgeText: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Salam Pembuka</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.salutation || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { salutation: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Teks Undangan</label>
                              <textarea
                                rows={3}
                                value={(selectedSection.props as any)?.invitationText || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { invitationText: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Foto Background Amplop</label>
                              <input
                                type="url"
                                value={(selectedSection.props as any)?.backgroundImage || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { backgroundImage: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                            </div>
                          </>
                        )}

                        {/* COUNTDOWN PROPS */}
                        {selectedSection.componentType === 'countdown' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Hitung Mundur</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Target Tanggal & Jam (ISO)</label>
                              <input
                                type="datetime-local"
                                value={((selectedSection.props as any)?.targetDate || '2026-10-24T08:00').substring(0, 16)}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { targetDate: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Catatan / Pesan Singkat</label>
                              <textarea
                                rows={2}
                                value={(selectedSection.props as any)?.note || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { note: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </>
                        )}

                        {/* EVENT PROPS */}
                        {selectedSection.componentType === 'event' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Rangkaian Acara</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Daftar Acara ({((selectedSection.props as any)?.events || []).length}):</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentEvents = [...((selectedSection.props as any)?.events || [])];
                                    currentEvents.push({
                                      title: 'Acara Baru',
                                      dateText: 'Sabtu, 24 Oktober 2026',
                                      timeText: '10:00 WIB',
                                      venueName: 'Lokasi Acara',
                                      venueAddress: 'Alamat Lengkap',
                                      mapsUrl: 'https://maps.google.com',
                                    });
                                    mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Tambah Acara
                                </button>
                              </div>

                              {((selectedSection.props as any)?.events || []).map((ev: any, evIdx: number) => (
                                <div key={evIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
                                  <div className="flex items-center justify-between">
                                    <span className="text-emerald-400 font-bold text-xs">Acara #{evIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentEvents = ((selectedSection.props as any)?.events || []).filter((_: any, idx: number) => idx !== evIdx);
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                      }}
                                      className="p-1 text-slate-500 hover:text-red-400"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Nama Acara (e.g. Akad Nikah)"
                                    value={ev.title || ''}
                                    onChange={(e) => {
                                      const currentEvents = [...((selectedSection.props as any)?.events || [])];
                                      currentEvents[evIdx] = { ...currentEvents[evIdx], title: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                  />
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Tanggal Acara"
                                      value={ev.dateText || ''}
                                      onChange={(e) => {
                                        const currentEvents = [...((selectedSection.props as any)?.events || [])];
                                        currentEvents[evIdx] = { ...currentEvents[evIdx], dateText: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Waktu Acara"
                                      value={ev.timeText || ''}
                                      onChange={(e) => {
                                        const currentEvents = [...((selectedSection.props as any)?.events || [])];
                                        currentEvents[evIdx] = { ...currentEvents[evIdx], timeText: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Nama Tempat / Gedung"
                                    value={ev.venueName || ''}
                                    onChange={(e) => {
                                      const currentEvents = [...((selectedSection.props as any)?.events || [])];
                                      currentEvents[evIdx] = { ...currentEvents[evIdx], venueName: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { events: currentEvents }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* STORY PROPS */}
                        {selectedSection.componentType === 'story' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Kisah Cinta</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Milestone / Chapter ({((selectedSection.props as any)?.milestones || []).length}):</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = [...((selectedSection.props as any)?.milestones || [])];
                                    current.push({ year: '2026', title: 'Babak Baru', description: 'Cerita romantis bersama.' });
                                    mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { milestones: current }));
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Tambah Cerita
                                </button>
                              </div>

                              {((selectedSection.props as any)?.milestones || []).map((m: any, mIdx: number) => (
                                <div key={mIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      placeholder="Tahun (e.g. 2024)"
                                      value={m.year || ''}
                                      onChange={(e) => {
                                        const current = [...((selectedSection.props as any)?.milestones || [])];
                                        current[mIdx] = { ...current[mIdx], year: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { milestones: current }));
                                      }}
                                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = ((selectedSection.props as any)?.milestones || []).filter((_: any, idx: number) => idx !== mIdx);
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { milestones: current }));
                                      }}
                                      className="p-1 text-slate-500 hover:text-red-400"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Judul Momen (e.g. Lamaran)"
                                    value={m.title || ''}
                                    onChange={(e) => {
                                      const current = [...((selectedSection.props as any)?.milestones || [])];
                                      current[mIdx] = { ...current[mIdx], title: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { milestones: current }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                  />
                                  <textarea
                                    rows={2}
                                    placeholder="Deskripsi cerita..."
                                    value={m.description || ''}
                                    onChange={(e) => {
                                      const current = [...((selectedSection.props as any)?.milestones || [])];
                                      current[mIdx] = { ...current[mIdx], description: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { milestones: current }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* GALLERY PROPS */}
                        {selectedSection.componentType === 'gallery' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Galeri</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Foto ({((selectedSection.props as any)?.photos || []).length}):</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = [...((selectedSection.props as any)?.photos || [])];
                                    current.push({
                                      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
                                      caption: 'Momen Bahagia',
                                    });
                                    mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { photos: current }));
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Tambah Foto
                                </button>
                              </div>

                              {((selectedSection.props as any)?.photos || []).map((ph: any, phIdx: number) => (
                                <div key={phIdx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                                  <img src={ph.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <input
                                      type="url"
                                      value={ph.url || ''}
                                      onChange={(e) => {
                                        const current = [...((selectedSection.props as any)?.photos || [])];
                                        current[phIdx] = { ...current[phIdx], url: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { photos: current }));
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Caption Foto"
                                      value={ph.caption || ''}
                                      onChange={(e) => {
                                        const current = [...((selectedSection.props as any)?.photos || [])];
                                        current[phIdx] = { ...current[phIdx], caption: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { photos: current }));
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = ((selectedSection.props as any)?.photos || []).filter((_: any, idx: number) => idx !== phIdx);
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { photos: current }));
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* LOCATION PROPS */}
                        {selectedSection.componentType === 'location' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Lokasi</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Nama Tempat / Gedung</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.venueName || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { venueName: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Alamat Lengkap</label>
                              <textarea
                                rows={2}
                                value={(selectedSection.props as any)?.address || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { address: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Google Maps Embed URL</label>
                              <input
                                type="url"
                                value={(selectedSection.props as any)?.googleMapsEmbedUrl || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { googleMapsEmbedUrl: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {/* GIFT / DIGITAL ENVELOPE PROPS */}
                        {selectedSection.componentType === 'gift' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Judul Hadiah / Gift</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.heading || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { heading: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Keterangan / Pesan Singkat</label>
                              <textarea
                                rows={2}
                                value={(selectedSection.props as any)?.description || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { description: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300">Rekening Bank ({((selectedSection.props as any)?.bankAccounts || []).length}):</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = [...((selectedSection.props as any)?.bankAccounts || [])];
                                    current.push({ bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Nama Penerima' });
                                    mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { bankAccounts: current }));
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Tambah Rekening
                                </button>
                              </div>

                              {((selectedSection.props as any)?.bankAccounts || []).map((ba: any, baIdx: number) => (
                                <div key={baIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      placeholder="Nama Bank (e.g. BCA)"
                                      value={ba.bankName || ''}
                                      onChange={(e) => {
                                        const current = [...((selectedSection.props as any)?.bankAccounts || [])];
                                        current[baIdx] = { ...current[baIdx], bankName: e.target.value };
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { bankAccounts: current }));
                                      }}
                                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = ((selectedSection.props as any)?.bankAccounts || []).filter((_: any, idx: number) => idx !== baIdx);
                                        mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { bankAccounts: current }));
                                      }}
                                      className="p-1 text-slate-500 hover:text-red-400"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Nomor Rekening"
                                    value={ba.accountNumber || ''}
                                    onChange={(e) => {
                                      const current = [...((selectedSection.props as any)?.bankAccounts || [])];
                                      current[baIdx] = { ...current[baIdx], accountNumber: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { bankAccounts: current }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Atas Nama Pemilik"
                                    value={ba.accountHolder || ''}
                                    onChange={(e) => {
                                      const current = [...((selectedSection.props as any)?.bankAccounts || [])];
                                      current[baIdx] = { ...current[baIdx], accountHolder: e.target.value };
                                      mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { bankAccounts: current }));
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CLOSING PROPS */}
                        {selectedSection.componentType === 'closing' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-slate-400">Pesan Penutup / Ucapan Terima Kasih</label>
                              <textarea
                                rows={3}
                                value={(selectedSection.props as any)?.message || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { message: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400">Catatan Footer / Salam Keluarga</label>
                              <input
                                type="text"
                                value={(selectedSection.props as any)?.footerNote || ''}
                                onChange={(e) =>
                                  mutateConfig(ConfigMutators.updateSectionProps(config, selectedSection.id, { footerNote: e.target.value }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 space-y-2">
                      <Sliders className="w-8 h-8 mx-auto opacity-40" />
                      <p>Pilih salah satu bagian untuk mulai mengedit kontennya.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MEDIA & IMAGES EDITOR */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-400">Media & Asset Hub</p>
                      <p className="text-[11px] text-slate-400">Pilih atau tambah aset gambar</p>
                    </div>
                    <button
                      onClick={() => setShowAddAssetModal(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow hover:bg-emerald-400 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Aset</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Terapkan Gambar Ke Bagian:</label>
                    <select
                      value={selectedImageSlot}
                      onChange={(e) => setSelectedImageSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="hero-cover">Cover / Hero Utama</option>
                      <option value="groom-photo">Foto Mempelai Pria</option>
                      <option value="bride-photo">Foto Mempelai Wanita</option>
                      <option value="gallery-add">Tambahkan ke Galeri Foto</option>
                    </select>
                  </div>

                  {/* Search & Category Filter */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Cari foto..."
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    />

                    <div className="flex flex-wrap gap-1">
                      {['all', 'cover', 'groom', 'bride', 'gallery', 'background'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setAssetCategoryFilter(cat)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
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
                    {dynamicAssets
                      .filter((a) => {
                        const matchCat = assetCategoryFilter === 'all' || a.category === assetCategoryFilter;
                        const matchQuery = !assetSearchQuery || a.title.toLowerCase().includes(assetSearchQuery.toLowerCase());
                        return matchCat && matchQuery;
                      })
                      .map((asset) => (
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
                              <button
                                onClick={() => handleBindPhoto(asset.url)}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[9px]"
                              >
                                Pasang
                              </button>
                              <button
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="p-1 rounded text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 4: THEMES & STYLING */}
              {activeTab === 'theme' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold">Paket Tema Mewah</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {themes.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => mutateConfig(ConfigMutators.updateTheme(config, t.id))}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                            config.themeId === t.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                              : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="font-bold font-serif">{t.name}</p>
                            <p className="text-[10px] text-slate-400">{t.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full border border-slate-700 shadow" style={{ backgroundColor: t.colors.primary }} />
                            <div className="w-4 h-4 rounded-full border border-slate-700 shadow" style={{ backgroundColor: t.colors.background }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <label className="text-slate-300 font-semibold">Custom Color Tokens</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Warna Aksen Utama</span>
                        <input
                          type="color"
                          value={config.themeOverrides?.primaryColor || '#1E4D3B'}
                          onChange={(e) =>
                            mutateConfig(ConfigMutators.updateThemeOverrides(config, { primaryColor: e.target.value }))
                          }
                          className="w-full h-9 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Latar Belakang</span>
                        <input
                          type="color"
                          value={config.themeOverrides?.backgroundColor || '#F6FAF7'}
                          onChange={(e) =>
                            mutateConfig(ConfigMutators.updateThemeOverrides(config, { backgroundColor: e.target.value }))
                          }
                          className="w-full h-9 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AI COPILOT */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-purple-300 font-bold">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>AI Wedding Creative Director</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Instruksikan AI untuk menyesuaikan gaya penulisan, suasana adat, atau merevisi seluruh teks undangan Anda secara otomatis.
                    </p>
                  </div>

                  {aiSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{aiSuccessMsg}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Prompt Instruksi AI</label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Contoh: Ubah gaya bahasa menjadi pernikahan adat Jawa modern yang penuh doa dan romantis..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={aiLoading || !aiPrompt.trim()}
                    onClick={() => handleAiRefine()}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{aiLoading ? 'Sedang Memproses Desain AI...' : 'Terapkan Desain AI'}</span>
                  </button>
                </div>
              )}

              {/* TAB 6: AUDIO & MUSIC */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">Status Musik Latar</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.musicConfig?.enabled ?? true}
                        onChange={(e) =>
                          mutateConfig(ConfigMutators.updateMusicConfig(config, { enabled: e.target.checked }))
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Lagu romantis akan diputar saat tamu membuka undangan digital.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold">Pilih Koleksi Lagu Romantis</label>
                    <div className="space-y-2">
                      {PRESET_MUSIC_TRACKS.map((track, tIdx) => {
                        const isCurrent = config.musicConfig?.audioUrl === track.url;
                        return (
                          <div
                            key={tIdx}
                            onClick={() =>
                              mutateConfig(
                                ConfigMutators.updateMusicConfig(config, {
                                  audioUrl: track.url,
                                  title: track.title,
                                  artist: track.artist,
                                  enabled: true,
                                })
                              )
                            }
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isCurrent
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-xs truncate text-slate-100">{track.title}</p>
                              <p className="text-[10px] text-slate-400">{track.artist}</p>
                            </div>
                            <div className={`p-2 rounded-xl ${isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              <Music className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER INTERACTIVE CANVAS WORKSPACE (BOUNDED) */}
        <main
          className="flex-1 bg-[#04060C] flex items-center justify-center overflow-hidden p-2 sm:p-4 relative"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
          onClick={() => setSelectedSectionId(null)}
        >
          {/* Zoom Wrapper */}
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
            }}
            className="flex items-center justify-center max-h-full"
          >
            {/* ANDROID REALISTIC DEVICE FRAME (COMPACT & BOUNDED) */}
            {deviceModel === 'android' && (
              <div className="relative transition-all duration-300">
                <div className="w-[350px] h-[680px] bg-[#121622] rounded-[38px] p-[8px] android-device-shadow relative border border-slate-700/60 ring-1 ring-slate-800 flex flex-col">
                  {/* Buttons */}
                  <div className="absolute -left-[10px] top-[120px] w-[2.5px] h-[45px] bg-slate-700 rounded-l-md" />
                  <div className="absolute -left-[10px] top-[180px] w-[2.5px] h-[45px] bg-slate-700 rounded-l-md" />
                  <div className="absolute -right-[10px] top-[140px] w-[2.5px] h-[35px] bg-slate-700 rounded-r-md" />

                  {/* Android Screen Bezel */}
                  <div className="w-full h-full bg-[#0E121E] rounded-[30px] overflow-hidden flex flex-col relative border border-slate-900/80">
                    {/* Status Bar */}
                    <div className="h-6 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 select-none text-[10px] text-slate-300 font-sans">
                      <span className="font-semibold">12:45</span>
                      <div className="w-3 h-3 bg-black rounded-full border border-slate-800/80 flex items-center justify-center">
                        <div className="w-1 h-1 bg-slate-900 rounded-full" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-[8px] font-bold">5G</span>
                        <Wifi className="w-2.5 h-2.5" />
                        <Battery className="w-3 h-3 text-slate-300" />
                      </div>
                    </div>

                    {/* Scrollable Invitation Content */}
                    <div className="flex-1 overflow-y-auto bg-background relative select-auto">
                      <WeddingRenderer
                        config={config}
                        isEditable={!isPreviewMode}
                        selectedSectionId={selectedSectionId || undefined}
                        onSelectSection={handleSelectSection}
                        onUpdateSectionProps={(secId, newProps) => {
                          mutateConfig(ConfigMutators.updateSectionProps(config, secId, newProps));
                        }}
                      />
                    </div>

                    {/* Navigation Bar */}
                    <div className="h-4 bg-slate-950/95 flex items-center justify-center shrink-0 z-30">
                      <div className="w-24 h-1 bg-slate-600/60 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IPHONE REALISTIC DEVICE FRAME */}
            {deviceModel === 'iphone' && (
              <div className="relative transition-all duration-300">
                <div className="w-[340px] h-[680px] bg-[#181C26] rounded-[44px] p-[10px] iphone-device-shadow relative border border-slate-700/60 ring-1 ring-slate-800 flex flex-col">
                  <div className="w-full h-full bg-[#0E121E] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-900/80">
                    <div className="sticky top-0 left-0 right-0 z-40 flex justify-center pt-2 pointer-events-none">
                      <div className="w-20 h-4 bg-black rounded-full shadow-lg flex items-center justify-end px-2 border border-slate-900">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-800" />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-background relative select-auto -mt-6">
                      <div className="h-6" />
                      <WeddingRenderer
                        config={config}
                        isEditable={!isPreviewMode}
                        selectedSectionId={selectedSectionId || undefined}
                        onSelectSection={handleSelectSection}
                        onUpdateSectionProps={(secId, newProps) => {
                          mutateConfig(ConfigMutators.updateSectionProps(config, secId, newProps));
                        }}
                      />
                    </div>

                    <div className="h-4 bg-slate-950/90 flex items-center justify-center shrink-0 z-30">
                      <div className="w-28 h-1 bg-slate-500/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABLET VIEW FRAME */}
            {deviceModel === 'tablet' && (
              <div className="w-[680px] h-[720px] bg-[#141824] rounded-[32px] p-[10px] shadow-2xl border border-slate-700/60 relative">
                <div className="w-full h-full bg-background rounded-[24px] overflow-y-auto relative">
                  <WeddingRenderer
                    config={config}
                    isEditable={!isPreviewMode}
                    selectedSectionId={selectedSectionId || undefined}
                    onSelectSection={handleSelectSection}
                    onUpdateSectionProps={(secId, newProps) => {
                      mutateConfig(ConfigMutators.updateSectionProps(config, secId, newProps));
                    }}
                  />
                </div>
              </div>
            )}

            {/* DESKTOP FRAME */}
            {deviceModel === 'desktop' && (
              <div className="w-full max-w-4xl h-[680px] bg-[#0E121E] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
                <div className="h-7 bg-slate-900 px-3 flex items-center gap-2 border-b border-slate-800 shrink-0">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 max-w-xs mx-auto bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 text-center border border-slate-800 truncate">
                    https://undangan.local/{slug}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-background">
                  <WeddingRenderer
                    config={config}
                    isEditable={!isPreviewMode}
                    selectedSectionId={selectedSectionId || undefined}
                    onSelectSection={handleSelectSection}
                    onUpdateSectionProps={(secId, newProps) => {
                      mutateConfig(ConfigMutators.updateSectionProps(config, secId, newProps));
                    }}
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

      {/* SAVE AS MASTER TEMPLATE MODAL */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">Simpan Sebagai Master Template</h3>
                <p className="text-xs text-slate-400">Komposisi {config.sections.length} bagian saat ini akan dijadikan template master.</p>
              </div>
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {templateSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Template berhasil didaftarkan ke Master Template Registry!</span>
              </div>
            )}

            <form onSubmit={handleSaveAsMasterTemplate} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Nama Master Template</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Golden Heritage Grandeur"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Kategori Template</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e: any) => setNewTemplateCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                <label className="text-slate-300 font-semibold">Deskripsi Template</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan keunikan alur dan konsep template ini..."
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Preview Urutan Bagian:</span>
                <div className="flex flex-wrap gap-1">
                  {config.sections.map((s, idx) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-emerald-400">
                      {idx + 1}. {s.componentType}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !newTemplateName.trim()}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Mendaftarkan Template...' : 'Daftarkan Master Template'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* JSON EXPORT & IMPORT MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-serif font-bold text-white">Ekspor & Impor Konfigurasi Template JSON</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Ekspor JSON Desain Saat Ini:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                      setJsonExportCopied(true);
                      setTimeout(() => setJsonExportCopied(false), 2000);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[11px] flex items-center gap-1"
                  >
                    {jsonExportCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{jsonExportCopied ? 'Tersalin!' : 'Salin JSON'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={JSON.stringify(config, null, 2)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-300 resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Impor JSON Desain / Template Kustom:</span>
                <textarea
                  rows={4}
                  placeholder="Tempelkan JSON InvitationConfig di sini..."
                  value={jsonImportText}
                  onChange={(e) => setJsonImportText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonImportText);
                      if (parsed.sections && Array.isArray(parsed.sections)) {
                        mutateConfig(parsed);
                        setShowJsonModal(false);
                        setJsonImportText('');
                      } else {
                        alert('Format JSON tidak valid: tidak ditemukan array sections.');
                      }
                    } catch {
                      alert('Format JSON tidak valid.');
                    }
                  }}
                  disabled={!jsonImportText.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 disabled:opacity-40"
                >
                  Terapkan JSON ke Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMPONENT MODAL */}
      {showAddComponentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Tambah Bagian Baru</h3>
                <p className="text-xs text-slate-400">Pilih komponen untuk disisipkan ke dalam undangan digital</p>
              </div>
              <button
                onClick={() => setShowAddComponentModal(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1">
              {AVAILABLE_COMPONENTS.map((comp) => {
                const Icon = comp.icon;
                return (
                  <div
                    key={comp.type}
                    onClick={() => {
                      mutateConfig(ConfigMutators.addSection(config, comp.type));
                      setShowAddComponentModal(false);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-500/10 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">{comp.name}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{comp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH SUCCESS MODAL */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0B0F1B] border border-slate-800 text-center space-y-4 shadow-2xl">
            {publishModal.error ? (
              <>
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-white">Validasi Publikasi Belum Lolos</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{publishModal.error}</p>
                <button
                  onClick={() => setPublishModal({ isOpen: false })}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Tutup & Perbaiki
                </button>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-white">Undangan Berhasil Dipublikasikan!</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Website undangan pernikahan Anda kini dapat diakses secara instan oleh tamu:
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}{publishModal.successUrl}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={publishModal.successUrl || '#'}
                    target="_blank"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Website</span>
                  </Link>
                  <button
                    onClick={() => setPublishModal({ isOpen: false })}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
