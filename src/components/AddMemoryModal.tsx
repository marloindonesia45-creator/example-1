import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../data/galleryData';
import { X, Link2, CheckCircle2, AlertCircle, Info, Image as ImageIcon, HelpCircle, Move, ZoomIn, RotateCcw, Sliders } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: GalleryItem) => void;
  onOpenHelp?: () => void;
}

// Convert various Google Drive share URLs into direct embeddable preview image URLs
export function convertGoogleDriveLink(inputUrl: string): { isGDrive: boolean; previewUrl: string; fileId?: string } {
  if (!inputUrl) return { isGDrive: false, previewUrl: inputUrl };
  const trimmed = inputUrl.trim();

  // Pattern: /file/d/{id}
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    const fileId = matchFileD[1];
    return {
      isGDrive: true,
      fileId,
      previewUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
    };
  }

  // Pattern: id={id}
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    const fileId = matchId[1];
    return {
      isGDrive: true,
      fileId,
      previewUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
    };
  }

  // Pattern: /d/{id}
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) {
    const fileId = matchD[1];
    return {
      isGDrive: true,
      fileId,
      previewUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
    };
  }

  return { isGDrive: false, previewUrl: trimmed };
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onOpenHelp,
}) => {
  const [gdriveLink, setGdriveLink] = useState('');
  const [isGDriveValid, setIsGDriveValid] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'Perjalanan' | 'Kegiatan' | 'Harian' | 'Lainnya'>('Perjalanan');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Oktober 2024');
  const [story, setStory] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Position & Zoom adjustment state
  const [posX, setPosX] = useState<number>(50);
  const [posY, setPosY] = useState<number>(50);
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const [showAdjustPanel, setShowAdjustPanel] = useState<boolean>(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGdriveInputChange = (value: string) => {
    setGdriveLink(value);
    setImageLoadError(false);

    if (!value.trim()) {
      setIsGDriveValid(false);
      setImagePreview('');
      setPosX(50);
      setPosY(50);
      setZoom(1);
      return;
    }

    const { isGDrive, previewUrl } = convertGoogleDriveLink(value);
    setIsGDriveValid(isGDrive);
    setImagePreview(previewUrl);
  };

  const setPresetPhoto = (url: string, demoDriveLink: string) => {
    setGdriveLink(demoDriveLink);
    setIsGDriveValid(true);
    setImageLoadError(false);
    setImagePreview(url);
    setPosX(50);
    setPosY(50);
    setZoom(1);
  };

  // Drag-to-pan handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!imagePreview) return;
    setIsDragging(true);
    setDragStart({
      x: clientX,
      y: clientY,
      startX: posX,
      startY: posY,
    });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStart) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    const newX = Math.max(0, Math.min(100, Math.round(dragStart.startX - deltaX * 0.35)));
    const newY = Math.max(0, Math.min(100, Math.round(dragStart.startY - deltaY * 0.35)));
    setPosX(newX);
    setPosY(newY);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const resetPosition = () => {
    setPosX(50);
    setPosY(50);
    setZoom(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim() || !author.trim() || !imagePreview) return;

    const newItem: GalleryItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      category,
      location: location.trim() || 'Indonesia',
      date: date.trim() || 'Baru saja',
      image: imagePreview,
      story: story.trim(),
      likes: 1,
      objectPosition: `${posX}% ${posY}%`,
      zoom: zoom > 1 ? zoom : undefined,
    };

    onAdd(newItem);
    setTitle('');
    setAuthor('');
    setStory('');
    setLocation('');
    setGdriveLink('');
    setImagePreview('');
    setIsGDriveValid(false);
    setPosX(50);
    setPosY(50);
    setZoom(1);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative max-w-lg w-full bg-[#161a1d] border border-white/10 rounded-2xl text-white shadow-2xl flex flex-col my-auto max-h-[94vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header with Exit Button */}
        <div className="shrink-0 px-6 sm:px-8 pt-5 pb-4 border-b border-white/10 flex items-center justify-between bg-[#161a1d] z-20">
          <div>
            <h3 className="font-serif text-2xl font-normal text-white">Tambah Kenangan</h3>
            <p className="text-xs text-white/60">Simpan momen indah via link sharing Google Drive</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 shadow-sm"
            aria-label="Tutup form"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 sm:p-8 space-y-4 flex-1">
            
            {/* Link Sharing Google Drive Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/80">
                  Link Sharing Google Drive <span className="text-amber-400">*</span>
                </label>
                {onOpenHelp && (
                  <button
                    type="button"
                    onClick={onOpenHelp}
                    className="flex items-center gap-1 text-[11px] text-amber-300/90 hover:text-amber-200 hover:underline cursor-pointer transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Panduan Ukuran Foto</span>
                  </button>
                )}
              </div>

              {/* Live Image Preview Container with Interactive Pan Dragging */}
              <div
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={(e) => {
                  if (e.touches[0] && isDragging) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={handleDragEnd}
                className={`relative aspect-[16/9] rounded-xl overflow-hidden bg-black/60 border border-white/15 mb-2.5 shadow-inner flex items-center justify-center select-none ${
                  imagePreview ? 'cursor-grab active:cursor-grabbing ring-1 ring-white/10' : ''
                }`}
                title={imagePreview ? 'Klik dan tahan mouse untuk menggeser posisi foto' : undefined}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview foto kenangan Google Drive"
                      referrerPolicy="no-referrer"
                      onError={() => setImageLoadError(true)}
                      onLoad={() => setImageLoadError(false)}
                      style={{
                        objectPosition: `${posX}% ${posY}%`,
                        transform: zoom > 1 ? `scale(${zoom})` : undefined,
                        transformOrigin: `${posX}% ${posY}%`,
                      }}
                      className="w-full h-full object-cover pointer-events-none transition-none"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-medium text-white/90 border border-white/10 flex items-center gap-1.5 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Live Preview Foto</span>
                    </div>

                    {/* Interactive Drag Hint */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-amber-200/90 border border-white/10 flex items-center gap-1.5 pointer-events-none shadow-md">
                      <Move className="w-3 h-3 text-amber-400" />
                      <span>Geser foto untuk atur posisi</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-white/40">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    </div>
                    <p className="text-xs font-medium text-white/60">Belum Ada Foto Terpilih</p>
                    <p className="text-[11px] text-white/40 max-w-xs mt-0.5">
                      Tempel link sharing Google Drive di bawah untuk langsung memuat preview foto
                    </p>
                  </div>
                )}
              </div>

              {/* Positioning & Zoom Control Panel (Visible when image is loaded) */}
              {imagePreview && !imageLoadError && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-amber-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pengatur Posisi & Zoom Foto</span>
                    </span>
                    <button
                      type="button"
                      onClick={resetPosition}
                      className="flex items-center gap-1 text-[11px] text-white/60 hover:text-amber-300 transition-colors cursor-pointer"
                      title="Kembalikan posisi ke tengah"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Posisi</span>
                    </button>
                  </div>

                  {/* Position Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-white/50 mr-1">Pintasan:</span>
                    <button
                      type="button"
                      onClick={() => { setPosX(50); setPosY(15); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        posY <= 25 ? 'bg-amber-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      Fokus Atas
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPosX(50); setPosY(50); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        posX === 50 && posY === 50 ? 'bg-amber-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      Tengah
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPosX(50); setPosY(85); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        posY >= 75 ? 'bg-amber-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      Fokus Bawah
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPosX(15); setPosY(50); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        posX <= 25 ? 'bg-amber-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      Kiri
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPosX(85); setPosY(50); }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        posX >= 75 ? 'bg-amber-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      Kanan
                    </button>
                  </div>

                  {/* Sliders for Fine-Tuning */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Vertikal Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] text-white/70 mb-1">
                        <span>Posisi Vertikal (Y)</span>
                        <span className="font-mono text-amber-300">{posY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={posY}
                        onChange={(e) => setPosY(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
                      />
                    </div>

                    {/* Horizontal Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] text-white/70 mb-1">
                        <span>Posisi Horisontal (X)</span>
                        <span className="font-mono text-amber-300">{posX}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={posX}
                        onChange={(e) => setPosX(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
                      />
                    </div>

                    {/* Zoom Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] text-white/70 mb-1">
                        <span>Perbesaran (Zoom)</span>
                        <span className="font-mono text-amber-300">{zoom.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Input Link Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="Tempel link share Google Drive di sini (misal: https://drive.google.com/file/d/...)"
                    value={gdriveLink}
                    onChange={(e) => handleGdriveInputChange(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white placeholder:text-white/35"
                  />
                  <Link2 className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
                  
                  {isGDriveValid && !imageLoadError && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                  )}
                  {imageLoadError && (
                    <AlertCircle className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
                  )}
                </div>

                {/* Status & Hints */}
                {isGDriveValid && !imageLoadError && imagePreview && (
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Link Google Drive terdeteksi & foto berhasil dimuat langsung!</span>
                  </p>
                )}

                {imageLoadError && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Foto tidak dapat dimuat atau dibatasi</span>
                    </p>
                    <p className="text-white/70">
                      Pastikan setelan akses di Google Drive diset ke <strong>"Siapa saja yang memiliki link"</strong> (<em>Anyone with the link</em>).
                    </p>
                  </div>
                )}

                {!gdriveLink && (
                  <p className="flex items-center gap-1.5 text-[11px] text-white/50">
                    <Info className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span>Foto di Google Drive harus diset "Siapa saja yang memiliki link" agar bisa ditampilkan.</span>
                  </p>
                )}

                {/* Quick Presets for Demo Testing */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-white/40">Contoh siap pakai:</span>
                  <button
                    type="button"
                    onClick={() => setPresetPhoto(
                      '/src/assets/images/story_polaroid_mountain_1792387567297.jpg',
                      'https://drive.google.com/file/d/1demoMountainOverlookPhotos2024/view?usp=sharing'
                    )}
                    className="text-[11px] text-amber-300/80 hover:text-amber-200 hover:underline cursor-pointer"
                  >
                    Gunung
                  </button>
                  <span className="text-white/20">·</span>
                  <button
                    type="button"
                    onClick={() => setPresetPhoto(
                      '/src/assets/images/story_polaroid_sunset_1792387566720.jpg',
                      'https://drive.google.com/file/d/1demoBeachSunsetFriends2024/view?usp=sharing'
                    )}
                    className="text-[11px] text-amber-300/80 hover:text-amber-200 hover:underline cursor-pointer"
                  >
                    Pantai
                  </button>
                  <span className="text-white/20">·</span>
                  <button
                    type="button"
                    onClick={() => setPresetPhoto(
                      '/src/assets/images/story_polaroid_peace_1792387567250.jpg',
                      'https://drive.google.com/file/d/1demoPeaceSignTwilight2024/view?usp=sharing'
                    )}
                    className="text-[11px] text-amber-300/80 hover:text-amber-200 hover:underline cursor-pointer"
                  >
                    Peace
                  </button>
                </div>
              </div>
            </div>

            {/* Nama Pengunggah */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Nama Pengunggah <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Siapa namamu? (contoh: Marlo)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-white/30"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Judul Momen <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Senja Bersama di Bukit Bintang"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-white/30"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'Perjalanan' | 'Kegiatan' | 'Harian' | 'Lainnya')}
                  className="w-full px-3 py-2 rounded-lg bg-[#20252a] border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white"
                >
                  <option value="Perjalanan">Perjalanan</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Harian">Harian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Lokasi</label>
                <input
                  type="text"
                  placeholder="Contoh: Danau Toba"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Waktu / Tanggal</label>
              <input
                type="text"
                placeholder="Contoh: 15 Oktober 2024"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-white/30"
              />
            </div>

            {/* Story / Description */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Cerita di Balik Foto</label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan tawa, kejadian lucu, atau cerita hangat di balik foto ini..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-white/30"
              />
            </div>

          </div>

          {/* Fixed/Sticky Action Footer */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-[#161a1d] flex items-center justify-end gap-3 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!imagePreview}
              className={`px-5 py-2 rounded-lg text-xs font-medium transition-colors shadow-md ${
                imagePreview
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer font-semibold'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              Simpan Momen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
