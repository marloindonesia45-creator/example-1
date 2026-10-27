import React, { useState, useEffect } from 'react';
import { MusicConfig, defaultMusicConfig, extractYouTubeId } from '../data/musicConfig';
import { X, Youtube, Music, CheckCircle2, AlertCircle, RotateCcw, Play, ExternalLink } from 'lucide-react';

interface MusicSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: MusicConfig;
  onSave: (newConfig: MusicConfig) => void;
}

const PRESET_SONGS = [
  {
    title: 'Acoustic Guitar Sunset (Nostalgic Chill)',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    id: '5qap5aO4i9A',
  },
  {
    title: 'Campfire Memories (Warm Acoustic)',
    url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
    id: 'DWcJFNfaw9c',
  },
  {
    title: 'Peaceful Friends Piano & Guitar',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    id: 'jfKfPfyJRdk',
  },
];

export const MusicSettingsModal: React.FC<MusicSettingsModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
}) => {
  const [mode, setMode] = useState<'youtube' | 'ambient'>(currentConfig.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(currentConfig.youtubeUrl);
  const [youtubeId, setYoutubeId] = useState(currentConfig.youtubeId);
  const [songTitle, setSongTitle] = useState(currentConfig.songTitle);
  const [isUrlValid, setIsUrlValid] = useState(!!currentConfig.youtubeId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setMode(currentConfig.mode);
    setYoutubeUrl(currentConfig.youtubeUrl);
    setYoutubeId(currentConfig.youtubeId);
    setSongTitle(currentConfig.songTitle);
    setIsUrlValid(!!currentConfig.youtubeId);
  }, [currentConfig, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUrlChange = (value: string) => {
    setYoutubeUrl(value);
    const extractedId = extractYouTubeId(value);
    if (extractedId) {
      setYoutubeId(extractedId);
      setIsUrlValid(true);
      if (!songTitle || songTitle === defaultMusicConfig.songTitle) {
        setSongTitle('Lagu Kenangan YouTube');
      }
    } else {
      setYoutubeId('');
      setIsUrlValid(false);
    }
  };

  const selectPreset = (preset: typeof PRESET_SONGS[0]) => {
    setMode('youtube');
    setYoutubeUrl(preset.url);
    setYoutubeId(preset.id);
    setSongTitle(preset.title);
    setIsUrlValid(true);
  };

  const handleReset = () => {
    setMode(defaultMusicConfig.mode);
    setYoutubeUrl(defaultMusicConfig.youtubeUrl);
    setYoutubeId(defaultMusicConfig.youtubeId);
    setSongTitle(defaultMusicConfig.songTitle);
    setIsUrlValid(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      mode,
      youtubeUrl,
      youtubeId: youtubeId || defaultMusicConfig.youtubeId,
      songTitle: songTitle.trim() || 'Lagu Kenangan',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-[#161a1d] border border-white/10 rounded-2xl text-white shadow-2xl flex flex-col my-auto max-h-[94vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header with Exit Button */}
        <div className="shrink-0 px-6 sm:px-8 pt-5 pb-4 border-b border-white/10 flex items-center justify-between bg-[#161a1d] z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-white">Setting Lagu Kenangan</h3>
              <p className="text-xs text-white/60">Atur lagu pengiring nostalgia via URL YouTube</p>
            </div>
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
          <div className="p-6 sm:p-8 space-y-5 flex-1">
            
            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-2">Pilih Sumber Musik:</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('youtube')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    mode === 'youtube'
                      ? 'bg-red-500/15 border-red-400/80 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>Lagu YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('ambient')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    mode === 'ambient'
                      ? 'bg-amber-500/15 border-amber-400/80 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>Akustik Bawaan</span>
                </button>
              </div>
            </div>

            {/* YouTube Section */}
            {mode === 'youtube' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    URL Video YouTube <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required={mode === 'youtube'}
                      placeholder="Tempel link YouTube (misal: https://www.youtube.com/watch?v=...)"
                      value={youtubeUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-red-400 focus:outline-none text-xs sm:text-sm text-white placeholder:text-white/30"
                    />
                    <Youtube className="w-4 h-4 text-red-400 absolute left-3 top-3 pointer-events-none" />

                    {isUrlValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                    )}
                  </div>

                  {isUrlValid ? (
                    <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Video YouTube terdeteksi (ID: {youtubeId})</span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 text-[11px] text-white/40 mt-1.5">
                      <span>Mendukung link youtube.com/watch?v=, youtu.be/, atau Shorts.</span>
                    </p>
                  )}
                </div>

                {/* Judul Lagu / Keterangan */}
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Judul Lagu / Keterangan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lagu Kenangan Bersama Sahabat"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white placeholder:text-white/30"
                  />
                </div>

                {/* Live Preview Embed */}
                {youtubeId && (
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1.5">Pratinjau Pemutar YouTube:</label>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`}
                        title="YouTube Audio Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}

                {/* Preset List */}
                <div className="pt-1">
                  <p className="text-[11px] text-white/60 mb-2">Atau pilih lagu rekomendasi siap pakai:</p>
                  <div className="space-y-1.5">
                    {PRESET_SONGS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectPreset(preset)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          youtubeId === preset.id
                            ? 'bg-red-500/10 border-red-500/40 text-amber-200'
                            : 'bg-white/5 border-white/5 text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">{preset.title}</span>
                        <Play className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ambient Synthesizer Mode Description */}
            {mode === 'ambient' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
                <p className="font-medium text-amber-300 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>Mode Alunan Akustik Bawaan</span>
                </p>
                <p className="text-white/80 leading-relaxed font-light">
                  Web ini akan memainkan melodi lembut petikan dawai akustik hangat (*ambient chord progression*) menggunakan synthesizer Web Audio bawaan browser, tanpa memerlukan internet untuk memuat video.
                </p>
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
              <span>Reset Default</span>
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
                  <span>Simpan Lagu</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
