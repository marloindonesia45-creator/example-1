import React, { useState, useEffect } from 'react';
import { Menu, X, PlusCircle, SlidersHorizontal, Youtube, HelpCircle, History } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenMusicModal: () => void;
  onOpenHelpModal: () => void;
  onOpenHistoryModal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenMusicModal,
  onOpenHelpModal,
  onOpenHistoryModal,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121517]/85 backdrop-blur-md py-4 shadow-lg border-b border-white/5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Wordmark (Handwritten Script as in screenshot) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            className="font-handwriting text-3xl sm:text-4xl text-white tracking-wide hover:text-amber-200 transition-colors select-none"
          >
            Together
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8">
            <button
              onClick={() => scrollTo('home')}
              className={`relative text-sm tracking-wide transition-colors py-1 cursor-pointer ${
                activeSection === 'home' ? 'text-white font-medium' : 'text-white/80 hover:text-white'
              }`}
            >
              Home
              {activeSection === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => scrollTo('gallery')}
              className={`relative text-sm tracking-wide transition-colors py-1 cursor-pointer ${
                activeSection === 'gallery' ? 'text-white font-medium' : 'text-white/80 hover:text-white'
              }`}
            >
              Gallery
              {activeSection === 'gallery' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            {/* Mobile / Action Menu Toggle (Hamburger) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile Hamburger Trigger */}
          <div className="flex sm:hidden items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-white/90 hover:text-white cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-xs bg-[#161a1d] border-l border-white/10 h-full p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                <span className="font-handwriting text-3xl text-amber-200">Together</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <button
                  onClick={() => scrollTo('home')}
                  className="block w-full text-left text-lg text-white/90 hover:text-white font-serif transition-colors py-1 cursor-pointer"
                >
                  Home (Beranda)
                </button>
                <button
                  onClick={() => scrollTo('story')}
                  className="block w-full text-left text-lg text-white/90 hover:text-white font-serif transition-colors py-1 cursor-pointer"
                >
                  Our Story (Cerita Kita)
                </button>
                <button
                  onClick={() => scrollTo('gallery')}
                  className="block w-full text-left text-lg text-white/90 hover:text-white font-serif transition-colors py-1 cursor-pointer"
                >
                  Photo Gallery (Momen Kita)
                </button>
                <button
                  onClick={() => scrollTo('moments')}
                  className="block w-full text-left text-lg text-white/90 hover:text-white font-serif transition-colors py-1 cursor-pointer"
                >
                  Our Moments (Hal-Hal Kecil)
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenMusicModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-white font-medium text-xs transition-all border border-red-500/30 cursor-pointer"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>Setting Lagu Kenangan (YouTube)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSettingsModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all border border-white/10 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-300" />
                <span>Setting Gambar (Header & Story)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenHistoryModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all border border-white/10 cursor-pointer"
              >
                <History className="w-4 h-4 text-amber-300" />
                <span>Histori Aktivitas Foto</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenHelpModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 font-medium text-xs transition-all border border-amber-500/30 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>Panduan & Bantuan Website</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAddModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium text-sm transition-all shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Kenangan Baru</span>
              </button>

              <p className="text-xs text-white/50 text-center font-handwriting text-base">
                "Same people, Different places, Still us."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
