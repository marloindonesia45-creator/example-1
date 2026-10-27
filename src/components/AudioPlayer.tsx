import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Youtube } from 'lucide-react';
import { MusicConfig, defaultMusicConfig } from '../data/musicConfig';

interface AudioPlayerProps {
  musicConfig?: MusicConfig;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  musicConfig = defaultMusicConfig,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // When musicConfig changes and audio is playing, reset playback
  useEffect(() => {
    if (isPlaying) {
      stopAll();
      setTimeout(() => {
        startPlay();
      }, 300);
    }
  }, [musicConfig.mode, musicConfig.youtubeId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const startNostalgicAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft nostalgic chord progression: Dmaj7 - F#m7 - Gmaj7 - A
      const chords = [
        [146.83, 220.00, 277.18, 369.99],
        [185.00, 220.00, 277.18, 329.63],
        [196.00, 246.94, 293.66, 369.99],
        [220.00, 277.18, 329.63, 440.00],
      ];

      let chordIdx = 0;

      const playChordNote = (freq: number, delay: number, dur: number) => {
        if (!ctx || ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        const t = ctx.currentTime + delay;
        noteGain.gain.setValueAtTime(0, t);
        noteGain.gain.linearRampToValueAtTime(0.08, t + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, t);

        osc.connect(noteGain);
        noteGain.connect(filter);
        filter.connect(masterGain);

        osc.start(t);
        osc.stop(t + dur + 0.1);
      };

      const stepChord = () => {
        if (!ctx || ctx.state === 'closed') return;
        const currentChord = chords[chordIdx];
        chordIdx = (chordIdx + 1) % chords.length;

        currentChord.forEach((f, i) => {
          playChordNote(f, i * 0.45, 3.2);
        });

        playChordNote(currentChord[3] * 1.5, 1.8, 2.5);
        timerRef.current = window.setTimeout(stepChord, 3600);
      };

      stepChord();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopAmbient = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
        setTimeout(() => {
          audioCtxRef.current?.close().catch(() => {});
          audioCtxRef.current = null;
        }, 300);
      } catch {
        audioCtxRef.current?.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }
  };

  const playYouTube = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const pauseYouTube = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    }
  };

  const startPlay = () => {
    if (musicConfig.mode === 'youtube' && musicConfig.youtubeId) {
      playYouTube();
    } else {
      startNostalgicAmbient();
    }
  };

  const stopAll = () => {
    stopAmbient();
    pauseYouTube();
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAll();
    } else {
      startPlay();
    }
  };

  return (
    <>
      {/* Hidden YouTube Iframe Player for Background Audio */}
      {musicConfig.youtubeId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${musicConfig.youtubeId}?enablejsapi=1&autoplay=0&loop=1&playlist=${musicConfig.youtubeId}&controls=0`}
          title="Background YouTube Audio"
          allow="autoplay"
          className="fixed -top-96 -left-96 w-10 h-10 opacity-0 pointer-events-none"
        />
      )}

      {/* Floating Music Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#181d20]/85 backdrop-blur-md border border-white/10 hover:border-amber-400/50 text-white/90 hover:text-white transition-all duration-300 shadow-2xl group cursor-pointer"
          aria-label={isPlaying ? 'Heningkan musik kenangan' : 'Putar alunan kenangan'}
          title={isPlaying ? `Sedang memutar: ${musicConfig.songTitle}` : 'Putar alunan musik kenangan'}
        >
          <div className="relative flex items-center justify-center w-5 h-5">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 bg-amber-400 animate-pulse h-full"></span>
                <span className="w-0.5 bg-amber-400 animate-pulse delay-100 h-2"></span>
                <span className="w-0.5 bg-amber-400 animate-pulse delay-200 h-3"></span>
                <span className="w-0.5 bg-amber-400 animate-pulse delay-300 h-1.5"></span>
              </div>
            ) : musicConfig.mode === 'youtube' ? (
              <Youtube className="w-4 h-4 text-red-400/80 group-hover:text-red-400 transition-colors" />
            ) : (
              <Music className="w-4 h-4 text-white/60 group-hover:text-amber-400 transition-colors" />
            )}
          </div>

          <span className="text-xs font-medium tracking-wide max-w-[130px] truncate">
            {isPlaying ? (musicConfig.songTitle || 'Lagu Kenangan') : 'Putar Alunan'}
          </span>

          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/50 group-hover:text-white/80 shrink-0" />
          )}
        </button>
      </div>
    </>
  );
};
