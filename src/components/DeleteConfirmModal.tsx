import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../data/galleryData';
import { X, Trash2, AlertTriangle, UserCheck } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  photo: GalleryItem | null;
  onClose: () => void;
  onConfirmDelete: (photoId: string, deleterName: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  photo,
  onClose,
  onConfirmDelete,
}) => {
  const [deleterName, setDeleterName] = useState('');

  useEffect(() => {
    setDeleterName('');
  }, [isOpen, photo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleterName.trim()) return;
    onConfirmDelete(photo.id, deleterName.trim());
    setDeleterName('');
    onClose();
  };

  const isConfirmValid = deleterName.trim().length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-[#181d21] border border-rose-500/20 rounded-2xl p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Batal dan tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-white">Hapus Foto Kenangan</h3>
            <p className="text-xs text-rose-300/80">Konfirmasi identitas penghapus foto</p>
          </div>
        </div>

        {/* Photo Preview Mini Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
            <img
              src={photo.image}
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-white truncate">{photo.title}</h4>
            <p className="text-xs text-white/50 truncate">
              {photo.category} · {photo.author ? `by "${photo.author}"` : photo.location}
            </p>
          </div>
        </div>

        <p className="text-xs text-white/70 leading-relaxed mb-4">
          Untuk mencegah foto kenangan terhapus tanpa sengaja, silakan ketik nama Anda sebagai konfirmasi sebelum menghapus foto ini.
        </p>

        {/* Form Input Deleter Name */}
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              Nama Anda (Wajib untuk konfirmasi) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                placeholder="Ketik nama Anda (contoh: Marlo)..."
                value={deleterName}
                onChange={(e) => setDeleterName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-xs sm:text-sm text-white placeholder:text-white/30"
              />
              <UserCheck className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isConfirmValid}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-md ${
                isConfirmValid
                  ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
