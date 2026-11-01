export interface GalleryItem {
  id: string;
  title: string;
  category: 'Perjalanan' | 'Kegiatan' | 'Harian' | 'Lainnya';
  author: string;
  date: string;
  location: string;
  image: string;
  aspectRatio?: string;
  story: string;
  likes: number;
  objectPosition?: string;
  zoom?: number;
}

// Default gallery is intentionally empty so the app does not ship with built-in photos.
export const initialGalleryItems: GalleryItem[] = [];
