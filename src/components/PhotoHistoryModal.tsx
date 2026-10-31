import React, { useState, useEffect } from 'react';
import { PhotoHistoryEntry } from '../data/historyData';
import { X, History, PlusCircle, Trash2, Search, Calendar, User, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface PhotoHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyEntries: PhotoHistoryEntry[];
  onClearHistory?: () => void;
}

export const PhotoHistoryModal: React.FC<PhotoHistoryModalProps> = ({
  isOpen,
  onClose,
  historyEntries,
  onClearHistory,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'ADD_PHOTO' | 'DELETE_PHOTO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEntries = historyEntries.filter((entry) => {
    // Type filter
    if (filterType !== 'ALL' && entry.type !== filterType) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = entry.userName.toLowerCase().includes(q);
      const matchTitle = entry.photoTitle.toLowerCase().includes(q);
      const matchCategory = entry.category?.toLowerCase().includes(q);
      return matchName || matchTitle || matchCategory;
    }
    return true;
  });

  const addCount = historyEntries.filter((e) => e.type === 'ADD_PHOTO').length;
  const deleteCount = historyEntries.filter((e) => e.type === 'DELETE_PHOTO').length;

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
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-white">Histori Aktivitas Foto</h3>
              <p className="text-xs text-white/60">Catatan siapa yang menambahkan dan menghapus foto kenangan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 shadow-sm"
            aria-label="Tutup riwayat"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="shrink-0 px-6 sm:px-8 py-3.5 bg-[#14181a] border-b border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Semua ({historyEntries.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('ADD_PHOTO')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'ADD_PHOTO'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ditambahkan ({addCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('DELETE_PHOTO')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'DELETE_PHOTO'
                    ? 'bg-rose-500 text-white font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Dihapus ({deleteCount})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Cari nama / judul foto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 focus:border-amber-400 focus:outline-none text-xs text-white placeholder:text-white/30"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-white/40 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Timeline List */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const isAdd = entry.type === 'ADD_PHOTO';
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isAdd
                      ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'
                      : 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  {/* Action Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                      isAdd
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {isAdd ? <PlusCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/10">
                          {entry.userName}
                        </span>
                        <span className={isAdd ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                          {isAdd ? 'menambahkan foto baru' : 'menghapus foto'}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] text-white/45">
                        <Clock className="w-3 h-3" />
                        <span>{entry.timestamp}</span>
                      </span>
                    </div>

                    {/* Photo Title */}
                    <h4 className="font-serif text-sm font-medium text-white mb-1.5 line-clamp-1">
                      "{entry.photoTitle}"
                    </h4>

                    {/* Category / Location info if present */}
                    {(entry.category || entry.location) && (
                      <p className="text-[11px] text-white/50">
                        {entry.category && <span className="text-amber-300/80 mr-2">{entry.category}</span>}
                        {entry.location && <span>· {entry.location}</span>}
                      </p>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  {entry.photoImage && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10 relative shadow">
                      <img
                        src={entry.photoImage}
                        alt={entry.photoTitle}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${
                          !isAdd ? 'opacity-40 grayscale' : ''
                        }`}
                      />
                      {!isAdd && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-rose-400 drop-shadow" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-white/50 space-y-2">
              <History className="w-10 h-10 mx-auto text-white/20 mb-2" />
              <p className="font-serif text-base text-white/70">Tidak ada riwayat ditemukan</p>
              <p className="text-xs text-white/40">
                {searchQuery
                  ? 'Coba gunakan kata kunci pencarian yang lain.'
                  : 'Belum ada aktivitas foto yang tercatat.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-3.5 border-t border-white/10 bg-[#161a1d] flex items-center justify-between z-20">
          <span className="text-xs text-white/50">
            Total <strong className="text-white">{historyEntries.length}</strong> aktivitas tercatat
          </span>

          <div className="flex items-center gap-2">
            {onClearHistory && historyEntries.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset riwayat aktivitas foto?')) {
                    onClearHistory();
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-rose-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Riwayat</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-md cursor-pointer font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
