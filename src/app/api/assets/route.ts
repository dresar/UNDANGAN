import { NextResponse } from 'next/server';

export interface MediaAsset {
  id: string;
  url: string;
  title: string;
  category: 'cover' | 'groom' | 'bride' | 'gallery' | 'background' | 'audio';
  tags?: string[];
  createdAt: string;
}

// In-memory persistent assets store with pre-seeded curated luxury assets
let ASSET_STORE: MediaAsset[] = [
  {
    id: 'ast-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    title: 'Cinematic Prewedding Outdoor Glow',
    category: 'cover',
    tags: ['hero', 'prewedding', 'cinematic'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-2',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&auto=format&fit=crop&q=80',
    title: 'Romantic Golden Sunset Embrace',
    category: 'cover',
    tags: ['hero', 'sunset', 'romantic'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    title: 'Anggun Bride Portrait Minimalist',
    category: 'bride',
    tags: ['bride', 'portrait', 'wanita'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    title: 'Groom Formal Tuxedo & Smile',
    category: 'groom',
    tags: ['groom', 'portrait', 'pria'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-5',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80',
    title: 'Luxury Wedding Rings & Florals',
    category: 'gallery',
    tags: ['gallery', 'rings', 'details'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-6',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&auto=format&fit=crop&q=80',
    title: 'Nusantara Traditional Heritage Attire',
    category: 'cover',
    tags: ['adat', 'heritage', 'jawa'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-7',
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1000&auto=format&fit=crop&q=80',
    title: 'Bohemian Garden Wedding Arch',
    category: 'gallery',
    tags: ['gallery', 'garden', 'boho'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-8',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80',
    title: 'Joyful Couple Laughter in the Park',
    category: 'gallery',
    tags: ['gallery', 'happy', 'prewedding'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ast-9',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&auto=format&fit=crop&q=80',
    title: 'Elegant Ivory Silk Texture Background',
    category: 'background',
    tags: ['texture', 'background', 'ivory'],
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let results = [...ASSET_STORE];

  if (category && category !== 'all') {
    results = results.filter((a) => a.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    assets: results,
    total: results.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, title, category, tags } = body;

    if (!url || !title) {
      return NextResponse.json(
        { success: false, error: 'URL dan Judul aset wajib diisi.' },
        { status: 400 }
      );
    }

    const newAsset: MediaAsset = {
      id: `ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: url.trim(),
      title: title.trim(),
      category: category || 'gallery',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      createdAt: new Date().toISOString(),
    };

    ASSET_STORE.unshift(newAsset);

    return NextResponse.json({
      success: true,
      asset: newAsset,
      message: 'Aset visual berhasil ditambahkan ke Media Hub.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan aset.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID Aset wajib disertakan.' },
        { status: 400 }
      );
    }

    ASSET_STORE = ASSET_STORE.filter((a) => a.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Aset berhasil dihapus dari Media Hub.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus aset.' },
      { status: 500 }
    );
  }
}
