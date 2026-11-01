export type HistoryActionType = 'ADD_PHOTO' | 'DELETE_PHOTO';

export interface PhotoHistoryEntry {
  id: string;
  type: HistoryActionType;
  userName: string;
  photoTitle: string;
  photoImage?: string;
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

export const initialHistoryEntries: PhotoHistoryEntry[] = [];
