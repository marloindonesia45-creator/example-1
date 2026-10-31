export type HistoryActionType = 'ADD_PHOTO' | 'DELETE_PHOTO';

export interface PhotoHistoryEntry {
  id: string;
  type: HistoryActionType;
  userName: string;
  photoTitle: string;
  photoImage?: string;
  photoThumbnail?: string;
  category?: string;
  location?: string;
  timestamp: string;
}

export function getCurrentFormattedTimestamp(): string {
  const now = new Date();
  const day = now.getDate();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
}

export const initialHistoryEntries: PhotoHistoryEntry[] = [
  {
    id: 'hist-1',
    type: 'ADD_PHOTO',
    userName: 'Marlo',
    photoTitle: 'Menyambut Senja Pantai',
    photoImage: '/src/assets/images/story_polaroid_sunset_1792387566720.jpg',
    category: 'Perjalanan',
    location: 'Pantai Kuta, Bali',
    timestamp: '14 Jul 2024, 17:30 WIB',
  },
  {
    id: 'hist-2',
    type: 'ADD_PHOTO',
    userName: 'Rian',
    photoTitle: 'Puncak Bukit & Lembah Hijau',
    photoImage: '/src/assets/images/story_polaroid_mountain_1792387567297.jpg',
    category: 'Perjalanan',
    location: 'Bukit Paralayang, Batu',
    timestamp: '28 Mei 2024, 10:15 WIB',
  },
  {
    id: 'hist-3',
    type: 'ADD_PHOTO',
    userName: 'Sarah',
    photoTitle: 'Tawa di Bawah Pohon Pinus',
    photoImage: '/src/assets/images/story_polaroid_peace_1792387567250.jpg',
    category: 'Kegiatan',
    location: 'Hutan Pinus Mangunan',
    timestamp: '05 Jun 2024, 14:20 WIB',
  },
  {
    id: 'hist-4',
    type: 'ADD_PHOTO',
    userName: 'Dimas',
    photoTitle: 'Hangatnya Api Unggun & Percikan Bintang',
    photoImage: '/src/assets/images/hero_friends_summit_1792387566312.jpg',
    category: 'Kegiatan',
    location: 'Ranu Kumbolo, Semeru',
    timestamp: '19 Agu 2024, 21:40 WIB',
  },
];
