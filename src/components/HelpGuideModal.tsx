import React, { useEffect, useState } from 'react';
import { X, HelpCircle, Image, Link2, Music, Trash2, CheckCircle2, Monitor, Smartphone, Info } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'resolution' | 'gdrive' | 'features'>('resolution');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-white">Panduan & Bantuan Website</h3>
              <p className="text-xs text-white/60">Panduan ukuran foto ideal, format link, dan cara pakai</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 shadow-sm"
            aria-label="Tutup panduan"
            title="Tutup (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="shrink-0 px-6 sm:px-8 pt-3 pb-0 bg-[#161a1d] border-b border-white/10 flex gap-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('resolution')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'resolution'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Ukuran & Resolusi Piksel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gdrive')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'gdrive'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Link Google Drive
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'features'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Fitur-Fitur Website
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: RESOLUSI & UKURAN PIKSEL */}
          {activeTab === 'resolution' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Gunakan foto dengan orientasi horizontal (*landscape*) atau rasio standar 4:3 / 16:9 untuk hasil tampilan paling estetik dan tidak terpotong.
                </p>
              </div>

              {/* 1. Foto Galeri Kenangan */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <h4 className="text-sm font-medium text-white">Foto Galeri Kenangan (Momen Kita)</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Rasio 4:3
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Rekomendasi</span>
                    <span className="text-white font-semibold text-sm">1600 × 1200 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Standar</span>
                    <span className="text-white font-semibold text-sm">1200 × 900 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-white/50 block text-[10px]">Resolusi Minimum</span>
                    <span className="text-white font-semibold text-sm">800 × 600 px</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/60 pt-1">
                  Ukuran ini memastikan foto tetap tajam saat diperbesar di layar penuh (*Lightbox*) maupun di kartu galeri.
                </p>
              </div>

              {/* 2. Section Header Utama */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <h4 className="text-sm font-medium text-white">Section Header (Banner Atas Slide 1 & 2)</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Rasio 16:9
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Rekomendasi</span>
                    <span className="text-white font-semibold text-sm">1920 × 1080 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Layar 2K / Lebar</span>
                    <span className="text-white font-semibold text-sm">2560 × 1440 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-white/50 block text-[10px]">Resolusi Minimum</span>
                    <span className="text-white font-semibold text-sm">1280 × 720 px</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/60 pt-1">
                  Format memanjang (*widescreen landscape*) ideal untuk latar belakang utama layar penuh komputer dan ponsel.
                </p>
              </div>

              {/* 3. Section 2 Polaroid Story */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <h4 className="text-sm font-medium text-white">Section 2: Our Story (3 Foto Polaroid)</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Rasio 4:3 / 1:1
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Rekomendasi</span>
                    <span className="text-white font-semibold text-sm">1200 × 900 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Minimum</span>
                    <span className="text-white font-semibold text-sm">800 × 600 px</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/60 pt-1">
                  Akan ditampilkan dalam bingkai polaroid klasik dengan efek isolasi washi tape.
                </p>
              </div>

              {/* 4. Section 3 Moments & Footer */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <h4 className="text-sm font-medium text-white">Section 3 (Our Moments) & Footer Background</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Rasio 16:9
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Rekomendasi</span>
                    <span className="text-white font-semibold text-sm">1920 × 1080 px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/50 block text-[10px]">Resolusi Minimum</span>
                    <span className="text-white font-semibold text-sm">1280 × 720 px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN GOOGLE DRIVE */}
          {activeTab === 'gdrive' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-medium text-amber-200 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-amber-400" />
                  <span>Cara Mendapatkan Link Foto Google Drive:</span>
                </h4>
                
                <ol className="space-y-2.5 text-xs text-white/80 list-decimal pl-5 leading-relaxed">
                  <li>
                    Buka <strong className="text-white">Google Drive</strong> dan cari foto yang ingin ditampilkan.
                  </li>
                  <li>
                    Klik kanan foto, lalu pilih <strong className="text-white">Bagikan</strong> (*Share*) → <strong className="text-white">Bagikan</strong>.
                  </li>
                  <li>
                    Pada bagian <strong className="text-amber-300">Akses umum</strong>, ubah dari <em>"Dibatasi"</em> menjadi <strong className="text-emerald-400">"Siapa saja yang memiliki link"</strong> (*Anyone with the link*).
                  </li>
                  <li>
                    Klik tombol <strong className="text-white">Salin link</strong> (*Copy link*).
                  </li>
                  <li>
                    Kembali ke website ini, buka form <strong>Tambah Kenangan</strong>, dan tempel (*paste*) link tersebut. Foto akan langsung muncul otomatis di kotak pratinjau!
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Sistem otomatis mengonversi link Google Drive menjadi resolusi tinggi (*High Definition*) tanpa mengurangi kejernihan foto.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FITUR WEBSITE */}
          {activeTab === 'features' && (
            <div className="space-y-3.5 text-xs text-white/80">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <h5 className="font-medium text-white flex items-center gap-2">
                  <Image className="w-4 h-4 text-amber-400" />
                  <span>Pengaturan Gambar Halaman:</span>
                </h5>
                <p className="text-white/60 leading-relaxed">
                  Dapat diakses dari Menu Hamburger → <strong>Setting Gambar</strong>. Anda dapat mengganti latar belakang Header, foto Polaroid di Cerita Kita, serta Section 3 dan Footer cukup dengan memilih dari foto website.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <h5 className="font-medium text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-red-400" />
                  <span>Lagu Kenangan YouTube:</span>
                </h5>
                <p className="text-white/60 leading-relaxed">
                  Dapat diakses dari Menu Hamburger → <strong>Setting Lagu Kenangan</strong>. Tempel link video musik YouTube kesukaan Anda agar terputar mengiringi saat menjelajahi momen website.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <h5 className="font-medium text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Hapus Foto dengan Konfirmasi:</span>
                </h5>
                <p className="text-white/60 leading-relaxed">
                  Untuk menjaga kenangan tidak terhapus sembarangan, setiap penghapusan foto meminta Anda mengetik nama sebagai konfirmasi sebelum tombol hapus aktif.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-[#161a1d] flex items-center justify-end z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-md cursor-pointer font-semibold"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
