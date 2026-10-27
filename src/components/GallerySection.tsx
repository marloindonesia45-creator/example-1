import React, { useState } from 'react';
import { GalleryItem } from '../data/galleryData';
import { MapPin, Calendar, Heart, Download, Trash2, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { downloadImageAsJpg } from '../utils/downloadHelper';

interface GallerySectionProps {
  items: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
  onLikePhoto?: (id: string) => void;
  onDeletePhoto?: (item: GalleryItem) => void;
  onOpenHistory?: () => void;
}

const ITEMS_PER_PAGE = 12;

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  onOpenLightbox,
  onLikePhoto,
  onDeletePhoto,
  onOpenHistory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = ['Semua', 'Perjalanan', 'Kegiatan', 'Harian', 'Lainnya'];

  const filteredItems =
    selectedCategory === 'Semua'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="gallery" className="bg-[#121517] text-white py-24 sm:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <p className="text-xs tracking-[0.25em] text-white/50 uppercase font-medium mb-2 select-none">
              PHOTO GALLERY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight">
              Momen Kita
            </h2>
          </div>

          {/* Filter Tabs & History Button */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-between md:justify-end">
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`relative text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap pb-2 font-medium cursor-pointer ${
                      isActive ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full transition-all" />
                    )}
                  </button>
                );
              })}
            </div>

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer shrink-0"
                title="Lihat riwayat siapa yang menambah & menghapus foto"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Histori Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* 4x3 Grid (Maksimal 12 Items per Halaman) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-10">
          {paginatedItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group relative aspect-[4/3] rounded-md overflow-hidden bg-[#1c2126] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Image with fallback container */}
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                style={{
                  objectPosition: item.objectPosition || 'center center',
                  transform: item.zoom && item.zoom > 1 ? `scale(${item.zoom})` : undefined,
                  transformOrigin: item.objectPosition || 'center center',
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Styled Fallback container for zero broken images */}
              <div
                className="hidden absolute inset-0 bg-gradient-to-br from-amber-950/70 via-slate-900 to-amber-900/60 items-center justify-center p-6 text-center"
              >
                <div>
                  <span className="font-handwriting text-2xl text-amber-200 block mb-1">{item.title}</span>
                  <span className="text-xs text-white/60">{item.location}</span>
                </div>
              </div>

              {/* Hover / Card Overlay with Caption & Metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                <div className="transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between text-xs text-amber-300/90 mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1 text-white/70">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg text-white font-medium mb-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/80 line-clamp-2 font-light hidden sm:block">
                    {item.story}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/60">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-amber-200/90 font-medium">
                        {item.category}
                      </span>
                      {item.author && (
                        <span className="text-[11px] text-white/85 font-light italic mt-0.5">
                          by "{item.author}"
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await downloadImageAsJpg(item.image, item.title);
                        }}
                        className="hover:text-amber-300 text-white/70 hover:bg-white/10 rounded p-1 transition-colors"
                        title="Download foto"
                        aria-label="Download foto"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {onDeletePhoto && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePhoto(item);
                          }}
                          className="hover:text-rose-400 text-white/60 hover:bg-rose-500/10 rounded p-1 transition-colors"
                          title="Hapus foto (perlu konfirmasi)"
                          aria-label="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikePhoto?.(item.id);
                        }}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors p-1"
                        aria-label="Sukai foto ini"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-400" />
                        <span className="font-mono text-xs">{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-white/50">
            <p className="font-serif text-xl mb-2">Belum ada foto di kategori ini</p>
            <p className="text-xs">Pilih kategori lain atau tambahkan kenangan baru bersama sahabat.</p>
          </div>
        )}

        {/* Pagination Section (Shown when total items > 12) */}
        {totalPages > 1 && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/50">
              Menampilkan <span className="text-white font-medium">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}</span> dari <span className="text-white font-medium">{filteredItems.length}</span> foto
            </div>

            <div className="flex items-center gap-1.5">
              {/* Prev Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(validCurrentPage - 1)}
                disabled={validCurrentPage === 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  validCurrentPage === 1
                    ? 'text-white/30 cursor-not-allowed bg-white/5'
                    : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer'
                }`}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                const isActive = pageNum === validCurrentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(validCurrentPage + 1)}
                disabled={validCurrentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  validCurrentPage === totalPages
                    ? 'text-white/30 cursor-not-allowed bg-white/5'
                    : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer'
                }`}
                aria-label="Halaman selanjutnya"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
