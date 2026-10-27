import React, { useState, useEffect } from 'react';
import { SiteImagesConfig, defaultSiteImages } from '../data/siteImages';
import { GalleryItem } from '../data/galleryData';
import { X, CheckCircle2, RotateCcw, SlidersHorizontal, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: SiteImagesConfig;
  onSave: (newConfig: SiteImagesConfig) => void;
  availablePhotos: GalleryItem[];
}

export const ImageSettingsModal: React.FC<ImageSettingsModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
  availablePhotos,
}) => {
  const [activeTab, setActiveTab] = useState<'header' | 'story' | 'moments-footer'>('header');
  const [config, setConfig] = useState<SiteImagesConfig>(currentConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compile list of unique selectable photos from gallery and presets
  const selectablePhotos = React.useMemo(() => {
    const list: { id: string; image: string; title: string; category: string }[] = [];
    const seenUrls = new Set<string>();

    // Add preset photos first
    const presets = [
      { id: 'preset-summit', image: '/src/assets/images/hero_friends_summit_1792387566312.jpg', title: 'Puncak Senja', category: 'Gunung' },
      { id: 'preset-ocean', image: '/src/assets/images/banner_ocean_sunset_1792387568878.jpg', title: 'Senja Pantai & Ombak', category: 'Pantai' },
      { id: 'preset-beach-jump', image: '/src/assets/images/story_polaroid_sunset_1792387566720.jpg', title: 'Tawa Senja Pantai', category: 'Pantai' },
      { id: 'preset-mountain-look', image: '/src/assets/images/story_polaroid_mountain_1792387567297.jpg', title: 'Lembah Hijau', category: 'Gunung' },
      { id: 'preset-peace-twilight', image: '/src/assets/images/story_polaroid_peace_1792387567250.jpg', title: 'Tanda Damai (Peace)', category: 'Momen' },
    ];

    presets.forEach((p) => {
      seenUrls.add(p.image);
      list.push(p);
    });

    // Add photos from the current website gallery
    availablePhotos.forEach((item) => {
      if (!seenUrls.has(item.image)) {
        seenUrls.add(item.image);
        list.push({
          id: item.id,
          image: item.image,
          title: item.title,
          category: item.category,
        });
      }
    });

    return list;
  }, [availablePhotos]);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPhoto = (slotKey: keyof SiteImagesConfig, imageUrl: string) => {
    setConfig((prev) => ({
      ...prev,
      [slotKey]: imageUrl,
    }));
  };

  const handleReset = () => {
    setConfig(defaultSiteImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  // Helper component to render the visual photo picker for any slot
  const renderSlotPicker = (
    slotKey: keyof SiteImagesConfig,
    slotTitle: string,
    slotBadge: string,
    aspectClass: string
  ) => {
    const currentSelectedUrl = config[slotKey];

    return (
      <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-amber-200">{slotTitle}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              {slotBadge}
            </span>
          </div>
          <span className="text-[11px] text-white/50">Klik foto di bawah untuk memilih</span>
        </div>

        {/* Current Active Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className={`sm:col-span-5 ${aspectClass} rounded-xl overflow-hidden bg-black/60 border-2 border-amber-400/50 shadow-md relative group`}>
            <img
              src={currentSelectedUrl}
              alt={slotTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-medium border border-white/10 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Foto Terpilih</span>
            </div>
          </div>

          <div className="sm:col-span-7 flex flex-col justify-center">
            <p className="text-xs text-white/80 font-medium mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Koleksi Foto Website ({selectablePhotos.length} foto):</span>
            </p>

            {/* Visual Photo Picker Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-black/40 border border-white/10">
              {selectablePhotos.map((photo) => {
                const isSelected = currentSelectedUrl === photo.image;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => handleSelectPhoto(slotKey, photo.image)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group/item ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-95 shadow-lg'
                        : 'border-transparent hover:border-white/40 hover:scale-102 opacity-75 hover:opacity-100'
                    }`}
                    title={photo.title}
                  >
                    <img
                      src={photo.image}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#161a1d] border border-white/10 rounded-2xl text-white shadow-2xl flex flex-col my-auto max-h-[94vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header with Exit Button */}
        <div className="shrink-0 px-6 sm:px-8 pt-5 pb-4 border-b border-white/10 flex items-center justify-between bg-[#161a1d] z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-white">Setting Gambar</h3>
              <p className="text-xs text-white/60">Pilih dari foto-foto yang tersedia di website untuk mengganti tampilan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 shadow-sm"
            aria-label="Tutup pengaturan"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="shrink-0 px-6 sm:px-8 pt-3 pb-0 bg-[#161a1d] border-b border-white/10 flex gap-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('header')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'header'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Header (2 Slide)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'story'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Section 2: Story (3 Polaroid)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moments-footer')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'moments-footer'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Section 3 & Footer (2 Foto)
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 sm:p-8 space-y-6 flex-1">
            
            {/* TAB 1: HEADER SECTION */}
            {activeTab === 'header' && (
              <div className="space-y-5">
                {renderSlotPicker('heroSlide1', 'Foto Background Slide 01', 'Header Utama', 'aspect-[16/9]')}
                {renderSlotPicker('heroSlide2', 'Foto Background Slide 02', 'Header Slide 2', 'aspect-[16/9]')}
              </div>
            )}

            {/* TAB 2: SECTION 2 STORY (3 POLAROID PHOTOS) */}
            {activeTab === 'story' && (
              <div className="space-y-5">
                {renderSlotPicker('storyPhoto1', 'Foto Polaroid 1', 'Posisi Atas / Tengah', 'aspect-[4/3]')}
                {renderSlotPicker('storyPhoto2', 'Foto Polaroid 2', 'Posisi Kiri Bawah', 'aspect-[4/3]')}
                {renderSlotPicker('storyPhoto3', 'Foto Polaroid 3', 'Posisi Kanan Bawah', 'aspect-[4/3]')}
              </div>
            )}

            {/* TAB 3: SECTION 3 MOMENTS & FOOTER */}
            {activeTab === 'moments-footer' && (
              <div className="space-y-5">
                {renderSlotPicker('momentsBackground', 'Foto Background Our Moments', 'Section 3 (Hal-hal kecil)', 'aspect-[16/9]')}
                {renderSlotPicker('footerBackground', 'Foto Background Footer', 'Penutup (Sampai jumpa)', 'aspect-[16/9]')}
              </div>
            )}

          </div>

          {/* Sticky Action Footer */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-[#161a1d] flex items-center justify-between z-20">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Foto Bawaan</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-md cursor-pointer font-semibold"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <span>Terapkan Gambar</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
