import { GalleryItem } from '../data/galleryData';
import { PhotoHistoryEntry } from '../data/historyData';
import { SiteImagesConfig } from '../data/siteImages';
import { MusicConfig } from '../data/musicConfig';

export interface GoogleSheetsDatabase {
  initialized: boolean;
  galleryItems: GalleryItem[];
  historyEntries: PhotoHistoryEntry[];
  siteImages: Partial<SiteImagesConfig>;
  musicConfig: Partial<MusicConfig>;
  error?: string;
}

export type GoogleSheetsCollection =
  | 'galleryItems'
  | 'historyEntries'
  | 'siteImages'
  | 'musicConfig';

interface SaveRequest {
  action: 'saveAll' | 'saveCollection';
  requestId: string;
  collection?: GoogleSheetsCollection;
  data: GoogleSheetsDatabase | unknown;
}

const saveQueues = new Map<string, Promise<void>>();

export async function loadGoogleSheetsDatabase(): Promise<GoogleSheetsDatabase> {
  const response = await fetch('/api/database', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
  });
  const result = await readResponse<GoogleSheetsDatabase>(response);
  if (typeof result.initialized !== 'boolean' || !Array.isArray(result.galleryItems) ||
      !Array.isArray(result.historyEntries)) {
    throw new Error('Format database Google Sheets tidak valid.');
  }
  return result;
}

export function saveGoogleSheetsDatabase(
  data: GoogleSheetsDatabase,
): Promise<void> {
  return submitRequest({
    action: 'saveAll',
    requestId: createRequestId(),
    data,
  });
}

export function saveGoogleSheetsCollection(
  collection: GoogleSheetsCollection,
  data: unknown,
): Promise<void> {
  const previous = saveQueues.get(collection) ?? Promise.resolve();
  const request = previous.catch(() => undefined).then(() =>
    submitRequest({
      action: 'saveCollection',
      requestId: createRequestId(),
      collection,
      data,
    }),
  );
  saveQueues.set(collection, request);

  return request.finally(() => {
    if (saveQueues.get(collection) === request) {
      saveQueues.delete(collection);
    }
  });
}

async function submitRequest(request: SaveRequest): Promise<void> {
  const response = await fetch('/api/database', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  await readResponse<{ ok: boolean }>(response);
}

function createRequestId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function readResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text();
  let result: unknown;

  try {
    result = JSON.parse(responseText);
  } catch {
    const preview = responseText.trim().slice(0, 60).replace(/\s+/g, ' ');
    if (preview.startsWith('import ') || preview.startsWith('export ')) {
      throw new Error(
        'Endpoint /api/database mengembalikan kode, bukan JSON. Pastikan folder api ikut ter-deploy sebagai Vercel Functions dan buka URL Vercel, bukan server Vite lokal.',
      );
    }
    throw new Error(
      `Respons database bukan JSON (HTTP ${response.status}, ${response.headers.get('content-type') ?? 'tipe konten tidak diketahui'}).`,
    );
  }

  if (!response.ok) {
    const message = result && typeof result === 'object' &&
      typeof (result as { error?: unknown }).error === 'string'
      ? (result as { error: string }).error
      : 'Permintaan database gagal.';
    throw new Error(message);
  }
  if (result && typeof result === 'object' && 'error' in result) {
    throw new Error(String((result as { error: unknown }).error));
  }
  return result as T;
}
