import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OurStorySection } from './components/OurStorySection';
import { GallerySection } from './components/GallerySection';
import { OurMomentsSection } from './components/OurMomentsSection';
import { OutroSection } from './components/OutroSection';
import { LightboxModal } from './components/LightboxModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { ImageSettingsModal } from './components/ImageSettingsModal';
import { MusicSettingsModal } from './components/MusicSettingsModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { PhotoHistoryModal } from './components/PhotoHistoryModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AudioPlayer } from './components/AudioPlayer';
import { FeatureAccessModal } from './components/FeatureAccessModal';
import { GalleryItem, initialGalleryItems } from './data/galleryData';
import { defaultSiteImages, SiteImagesConfig } from './data/siteImages';
import { defaultMusicConfig, MusicConfig } from './data/musicConfig';
import { PhotoHistoryEntry, initialHistoryEntries, getCurrentFormattedTimestamp } from './data/historyData';
import { CheckCircle2 } from 'lucide-react';
import {
  loadGoogleSheetsDatabase,
  saveGoogleSheetsCollection,
  saveGoogleSheetsDatabase,
} from './utils/googleSheetsDatabase';

export default function App() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [siteImages, setSiteImages] = useState<SiteImagesConfig>(defaultSiteImages);
  const [musicConfig, setMusicConfig] = useState<MusicConfig>(defaultMusicConfig);
  const [historyEntries, setHistoryEntries] = useState<PhotoHistoryEntry[]>(initialHistoryEntries);

  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isGoogleSheetsReady, setIsGoogleSheetsReady] = useState(false);
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(false);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(true);
  const [hasWriteAccess, setHasWriteAccess] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingDeletePhoto, setPendingDeletePhoto] = useState<GalleryItem | null>(null);
  const [pendingProtectedAction, setPendingProtectedAction] = useState<
    'add-memory' | 'image-settings' | 'music-settings' | 'delete-photo' | null
  >(null);

  const requestProtectedAccess = (
    action: NonNullable<typeof pendingProtectedAction>,
    photo?: GalleryItem,
  ) => {
    if (!isDatabaseAvailable) {
      setToastMessage('Database belum siap. Periksa konfigurasi dan muat ulang aplikasi.');
      return;
    }
    if (action === 'delete-photo') setPendingDeletePhoto(photo ?? null);
    setPendingProtectedAction(action);
    setIsAccessModalOpen(true);
  };

  const handleFeatureAccessGranted = async () => {
    if (!isDatabaseInitialized) {
      await saveGoogleSheetsDatabase({
        initialized: true,
        galleryItems,
        historyEntries,
        siteImages,
        musicConfig,
      });
      setIsDatabaseInitialized(true);
      setIsGoogleSheetsReady(true);
    }

    setHasWriteAccess(true);
    const action = pendingProtectedAction;
    setPendingProtectedAction(null);
    setIsAccessModalOpen(false);

    if (action === 'add-memory') setIsAddModalOpen(true);
    if (action === 'image-settings') setIsSettingsModalOpen(true);
    if (action === 'music-settings') setIsMusicModalOpen(true);
    if (action === 'delete-photo' && pendingDeletePhoto) setPhotoToDelete(pendingDeletePhoto);
    setPendingDeletePhoto(null);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadDatabase = async () => {
      try {
        const database = await loadGoogleSheetsDatabase();
        if (isCancelled) return;

        const hasSavedData =
          database.initialized ||
          database.galleryItems.length > 0 ||
          database.historyEntries.length > 0 ||
          Object.keys(database.siteImages).length > 0 ||
          Object.keys(database.musicConfig).length > 0;

        if (hasSavedData) {
          setGalleryItems(database.galleryItems);
          setHistoryEntries(database.historyEntries);
          setSiteImages({ ...defaultSiteImages, ...database.siteImages });
          setMusicConfig({ ...defaultMusicConfig, ...database.musicConfig });
          setIsDatabaseInitialized(database.initialized);
          setIsGoogleSheetsReady(true);
        }

        if (!isCancelled) setIsDatabaseAvailable(true);
      } catch (error) {
        if (isCancelled) return;
        console.error('Gagal menghubungkan database Google Sheets:', error);
        const detail = error instanceof Error ? ` ${error.message}` : '';
        setToastMessage(`Database Google Sheets gagal dimuat.${detail} Periksa konfigurasi lalu muat ulang aplikasi.`);
      } finally {
        if (!isCancelled) setIsDatabaseLoading(false);
      }
    };

    void loadDatabase();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Save gallery changes to Google Sheets
  useEffect(() => {
    if (isGoogleSheetsReady && hasWriteAccess) {
      void saveGoogleSheetsCollection('galleryItems', galleryItems).catch((error: unknown) => {
        console.error('Gagal menyimpan galeri ke Google Sheets:', error);
        setHasWriteAccess(false);
        setToastMessage(error instanceof Error ? error.message : 'Gagal menyimpan galeri ke Google Sheets.');
      });
    }
  }, [galleryItems, isGoogleSheetsReady, hasWriteAccess]);

  // Save site image changes to Google Sheets
  useEffect(() => {
    if (isGoogleSheetsReady && hasWriteAccess) {
      void saveGoogleSheetsCollection('siteImages', siteImages).catch((error: unknown) => {
        console.error('Gagal menyimpan pengaturan gambar ke Google Sheets:', error);
        setHasWriteAccess(false);
        setToastMessage(error instanceof Error ? error.message : 'Gagal menyimpan pengaturan gambar ke Google Sheets.');
      });
    }
  }, [siteImages, isGoogleSheetsReady, hasWriteAccess]);

  // Save music configuration to Google Sheets
  useEffect(() => {
    if (isGoogleSheetsReady && hasWriteAccess) {
      void saveGoogleSheetsCollection('musicConfig', musicConfig).catch((error: unknown) => {
        console.error('Gagal menyimpan pengaturan musik ke Google Sheets:', error);
        setHasWriteAccess(false);
        setToastMessage(error instanceof Error ? error.message : 'Gagal menyimpan pengaturan musik ke Google Sheets.');
      });
    }
  }, [musicConfig, isGoogleSheetsReady, hasWriteAccess]);

  // Save photo history to Google Sheets
  useEffect(() => {
    if (isGoogleSheetsReady && hasWriteAccess) {
      void saveGoogleSheetsCollection('historyEntries', historyEntries).catch((error: unknown) => {
        console.error('Gagal menyimpan riwayat ke Google Sheets:', error);
        setHasWriteAccess(false);
        setToastMessage(error instanceof Error ? error.message : 'Gagal menyimpan riwayat ke Google Sheets.');
      });
    }
  }, [historyEntries, isGoogleSheetsReady, hasWriteAccess]);

  // Scroll spy for active navbar section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const galleryElem = document.getElementById('gallery');
      const galleryTop = galleryElem ? galleryElem.offsetTop - 300 : 9999;

      if (scrollY >= galleryTop) {
        setActiveSection('gallery');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLikePhoto = (id: string) => {
    setGalleryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
    if (activeLightboxItem && activeLightboxItem.id === id) {
      setActiveLightboxItem((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : null
      );
    }
  };

  const handleAddMemory = (newItem: GalleryItem) => {
    setGalleryItems((prev) => [newItem, ...prev]);

    // Record addition in history
    const historyItem: PhotoHistoryEntry = {
      id: `hist-add-${Date.now()}`,
      type: 'ADD_PHOTO',
      userName: newItem.author || 'Anonim',
      photoTitle: newItem.title,
      photoImage: newItem.image,
      photoThumbnail: newItem.thumbnail,
      category: newItem.category,
      location: newItem.location,
      timestamp: getCurrentFormattedTimestamp(),
    };
    setHistoryEntries((prev) => [historyItem, ...prev]);

    setToastMessage(`Kenangan "${newItem.title}" berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmDelete = (photoId: string, deleterName: string) => {
    const deletedItem = galleryItems.find((i) => i.id === photoId);
    const photoTitle = deletedItem ? deletedItem.title : 'Foto';

    setGalleryItems((prev) => prev.filter((item) => item.id !== photoId));
    if (
      deletedItem &&
      !galleryItems.some((item) => item.id !== photoId && item.image === deletedItem.image)
    ) {
      const siteImageKeys: (keyof SiteImagesConfig)[] = [
        'heroSlide1',
        'heroSlide2',
        'storyPhoto1',
        'storyPhoto2',
        'storyPhoto3',
        'momentsBackground',
        'footerBackground',
      ];
      setSiteImages((prev) =>
        siteImageKeys.reduce(
          (next, key) => {
            if (next[key] === deletedItem.image) {
              next[key] = defaultSiteImages[key];
            }
            return next;
          },
          { ...prev },
        ),
      );
    }

    if (activeLightboxItem && activeLightboxItem.id === photoId) {
      setActiveLightboxItem(null);
    }

    // Record deletion in history with deleter's confirmed name
    const historyItem: PhotoHistoryEntry = {
      id: `hist-del-${Date.now()}`,
      type: 'DELETE_PHOTO',
      userName: deleterName.trim(),
      photoTitle: photoTitle,
      photoImage: deletedItem?.image,
      photoThumbnail: deletedItem?.thumbnail,
      category: deletedItem?.category,
      location: deletedItem?.location,
      timestamp: getCurrentFormattedTimestamp(),
    };
    setHistoryEntries((prev) => [historyItem, ...prev]);

    setToastMessage(`Foto "${photoTitle}" berhasil dihapus oleh ${deleterName}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectStoryPhoto = (image: string, title: string, caption: string) => {
    const tempItem: GalleryItem = {
      id: `story-photo-${Date.now()}`,
      title,
      category: 'Perjalanan',
      author: 'Sahabat',
      date: 'Kenangan Abadi',
      location: 'Indonesia',
      image,
      story: caption,
      likes: 18,
    };
    setActiveLightboxItem(tempItem);
  };

  if (isDatabaseLoading) {
    return (
      <main
        className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-[#121517] px-6 text-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),_transparent_55%)]" />
        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-amber-300/15" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-300 motion-safe:animate-spin motion-reduce:animate-none" />
            <div className="absolute inset-3 rounded-full border border-amber-100/10" />
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-amber-500 motion-safe:animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:1.6s]" />
            <div className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.8)] motion-safe:animate-pulse motion-reduce:animate-none" />
          </div>
          <p className="font-serif text-2xl text-amber-100">Mengumpulkan kenangan...</p>
          <p className="mt-2 text-sm text-white/55">Mohon tunggu sebentar.</p>
          <div className="mt-7 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 motion-safe:animate-[loading-progress_1.4s_ease-in-out_infinite] motion-reduce:w-full" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#121517] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/90 text-white border border-amber-400/30 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenAddModal={() => requestProtectedAccess('add-memory')}
        onOpenSettingsModal={() => requestProtectedAccess('image-settings')}
        onOpenMusicModal={() => requestProtectedAccess('music-settings')}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        activeSection={activeSection}
      />

      {/* Hero Section (Customizable 2 slide images) */}
      <HeroSection
        heroSlide1={siteImages.heroSlide1}
        heroSlide2={siteImages.heroSlide2}
      />

      {/* Our Story Section (Customizable 3 Polaroid images) */}
      <OurStorySection
        onSelectPhoto={handleSelectStoryPhoto}
        storyPhoto1={siteImages.storyPhoto1}
        storyPhoto2={siteImages.storyPhoto2}
        storyPhoto3={siteImages.storyPhoto3}
      />

      {/* Photo Gallery Section (Max 12 items with pagination & History button) */}
      <GallerySection
        items={galleryItems}
        onOpenLightbox={(item) => setActiveLightboxItem(item)}
        onLikePhoto={handleLikePhoto}
        onDeletePhoto={(item) => requestProtectedAccess('delete-photo', item)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Our Moments Section (Customizable background image) */}
      <OurMomentsSection
        backgroundImage={siteImages.momentsBackground}
      />

      {/* Outro / Footer Section (Customizable background image) */}
      <OutroSection
        backgroundImage={siteImages.footerBackground}
      />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        item={activeLightboxItem}
        items={galleryItems}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(item) => setActiveLightboxItem(item)}
        onLikePhoto={handleLikePhoto}
        onDeletePhoto={(item) => requestProtectedAccess('delete-photo', item)}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMemory}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Help & Pixel Size Guidelines Modal */}
      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Photo Activity History Modal (Who added & who deleted) */}
      <PhotoHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyEntries={historyEntries}
        onClearHistory={() => setHistoryEntries([])}
      />

      {/* Image Settings Modal (Header, Story, Moments, & Footer) */}
      <ImageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentConfig={siteImages}
        availablePhotos={galleryItems}
        onSave={(newConfig) => {
          setSiteImages(newConfig);
          setToastMessage('Foto halaman berhasil diperbarui!');
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Music Settings Modal (YouTube URL & Ambient Synth) */}
      <MusicSettingsModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        currentConfig={musicConfig}
        onSave={(newConfig) => {
          setMusicConfig(newConfig);
          setToastMessage(newConfig.mode === 'youtube' ? `Lagu "${newConfig.songTitle}" berhasil diatur!` : 'Alunan musik akustik bawaan diaktifkan!');
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Delete Photo Confirmation Modal (Requires deleter name) */}
      <DeleteConfirmModal
        isOpen={!!photoToDelete}
        photo={photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Floating Music Player (Supports YouTube & Ambient Synthesizer) */}
      <AudioPlayer
        musicConfig={musicConfig}
      />

      <FeatureAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setPendingProtectedAction(null);
          setPendingDeletePhoto(null);
        }}
        onUnlock={handleFeatureAccessGranted}
      />
    </div>
  );
}
