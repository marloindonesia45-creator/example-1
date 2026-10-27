import React, { useEffect, useState } from 'react';
import { GalleryItem } from '../data/galleryData';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Heart, Share2, Download, Check, Trash2 } from 'lucide-react';
import { downloadImageAsJpg } from '../utils/downloadHelper';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
  onLikePhoto?: (id: string) => void;
  onDeletePhoto?: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onNavigate,
  onLikePhoto,
  onDeletePhoto,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % items.length;
    onNavigate(items[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onNavigate(items[prevIdx]);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `${item.title} - ${item.story}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.href}#${item.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-[#161a1d] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row my-auto max-h-[96vh] sm:max-h-[92vh] lg:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-black/75 hover:bg-black text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 shadow-lg"
          aria-label="Tutup peninjau gambar"
          title="Tutup (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame (Left/Top) */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[200px] sm:min-h-[280px] lg:min-h-[500px] max-h-[42vh] sm:max-h-[50vh] lg:max-h-[88vh] overflow-hidden group shrink-0">
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[42vh] sm:max-h-[50vh] lg:max-h-[75vh] object-contain"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100 z-20 shadow-md"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100 z-20 shadow-md"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata & Story Pane (Right/Bottom) with Scrollable Body and Pinned Footer */}
        <div className="w-full lg:w-88 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 bg-[#161a1d] text-white flex-1 min-h-0 overflow-hidden">
          
          {/* Scrollable Story and Details Area */}
          <div className="p-5 sm:p-7 flex-1 overflow-y-auto space-y-4">
            {/* Category & Date */}
            <div className="flex items-start justify-between text-xs text-amber-300/90 font-medium">
              <div className="flex flex-col">
                <span className="uppercase tracking-wider font-semibold">{item.category}</span>
                {item.author && (
                  <span className="text-[12px] text-white/80 italic font-light mt-0.5">
                    by "{item.author}"
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-white/50 pt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-xl sm:text-2xl text-white font-medium leading-snug">
              {item.title}
            </h2>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{item.location}</span>
            </div>

            {/* Emotional Story Copy */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light italic">
                "{item.story}"
              </p>
            </div>
          </div>

          {/* Pinned Action Footer: Likes, Share, Download (Always Visible at Bottom) */}
          <div className="shrink-0 p-4 sm:px-7 sm:py-4 border-t border-white/10 bg-[#161a1d] flex items-center justify-between z-10">
            <button
              onClick={() => onLikePhoto?.(item.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-400" />
              <span>{item.likes} Suka</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Bagikan momen ini"
                aria-label="Bagikan momen ini"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={async () => {
                  if (isDownloading) return;
                  setIsDownloading(true);
                  try {
                    await downloadImageAsJpg(item.image, item.title);
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 2000);
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Download foto (.jpg)"
                aria-label="Download foto (.jpg)"
              >
                {downloadSuccess ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>

              {onDeletePhoto && (
                <button
                  type="button"
                  onClick={() => onDeletePhoto(item)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                  title="Hapus foto ini (perlu konfirmasi nama)"
                  aria-label="Hapus foto ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
