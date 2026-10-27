export interface MusicConfig {
  mode: 'youtube' | 'ambient';
  youtubeUrl: string;
  youtubeId: string;
  songTitle: string;
}

export const defaultMusicConfig: MusicConfig = {
  mode: 'ambient',
  youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
  youtubeId: '5qap5aO4i9A',
  songTitle: 'Alunan Akustik Nostalgia (Bawaan)',
};

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Standard watch?v=, youtu.be/, embed/, shorts/
  const match = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (match && match[1]) {
    return match[1];
  }
  // If user pasted bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}
