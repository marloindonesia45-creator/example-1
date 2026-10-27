import {
  defineHandler,
} from 'nitro/h3';
import {
  hasValidSession,
  getServerEnvironment,
  isSameOrigin,
  jsonResponse,
  readJsonBody,
} from '../../lib/serverAuth';

const allowedCollections = new Set([
  'galleryItems',
  'historyEntries',
  'siteImages',
  'musicConfig',
]);

export default defineHandler(async (event) => {
  const request = event.req;
  const environment = getServerEnvironment(request, event.context);
  const configuredScriptUrl = environment.GOOGLE_APPS_SCRIPT_URL?.trim();
  if (!configuredScriptUrl) {
    return jsonResponse(503, {
      error: 'GOOGLE_APPS_SCRIPT_URL tidak tersedia pada runtime Worker ini.',
      diagnostic: {
        urlPresent: false,
        tokenPresent: Boolean(environment.GOOGLE_APPS_SCRIPT_TOKEN),
      },
    });
  }
  if (!isValidScriptUrl(configuredScriptUrl)) {
    return jsonResponse(503, {
      error: 'GOOGLE_APPS_SCRIPT_URL tersedia, tetapi format URL-nya tidak valid.',
      diagnostic: { urlPresent: true, urlValid: false },
    });
  }

  if (request.method === 'GET') {
    return proxyRead(configuredScriptUrl);
  }
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST' });
  }
  if (!isSameOrigin(request)) {
    return jsonResponse(403, { error: 'Request origin is not allowed.' });
  }
  if (!hasValidSession(request, environment)) {
    return jsonResponse(401, { error: 'Silakan masukkan password sebelum menyimpan perubahan.' });
  }

  const apiToken = environment.GOOGLE_APPS_SCRIPT_TOKEN?.trim();
  if (!apiToken) {
    return jsonResponse(503, { error: 'Google Apps Script token is not configured.' });
  }

  try {
    const body = await readJsonBody(request);
    if (!isValidSaveRequest(body)) {
      return jsonResponse(400, { error: 'Format permintaan penyimpanan tidak valid.' });
    }

    const payload = new URLSearchParams({
      payload: JSON.stringify(body),
      apiToken,
    });
    const upstream = await fetch(configuredScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload,
      redirect: 'follow',
      cache: 'no-store',
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      return jsonResponse(502, { error: 'Google Apps Script gagal menyimpan data.' });
    }

    let result: unknown;
    try {
      result = JSON.parse(text);
    } catch {
      return jsonResponse(502, { error: 'Respons Google Apps Script tidak valid.' });
    }
    if (!result || typeof result !== 'object' || (result as { ok?: unknown }).ok !== true) {
      const error = result && typeof result === 'object' &&
        typeof (result as { error?: unknown }).error === 'string'
        ? (result as { error: string }).error
        : 'Google Apps Script menolak penyimpanan.';
      return jsonResponse(502, { error });
    }
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('Google Sheets save proxy failed:', error);
    const message = error instanceof Error ? error.message : 'Permintaan penyimpanan gagal.';
    const statusCode = message.includes('Request body') ? 400 : 502;
    return jsonResponse(statusCode, { error: message });
  }
});

async function proxyRead(scriptUrl: string): Promise<Response> {
  try {
    const url = new URL(scriptUrl);
    url.searchParams.set('_', String(Date.now()));
    const upstream = await fetch(url, { cache: 'no-store', redirect: 'follow' });
    const text = await upstream.text();
    if (!upstream.ok) {
      return jsonResponse(502, { error: 'Google Apps Script gagal memuat data.' });
    }

    const database: unknown = JSON.parse(text);
    if (!database || typeof database !== 'object' || 'error' in database) {
      const error = database && typeof database === 'object' &&
        typeof (database as { error?: unknown }).error === 'string'
        ? (database as { error: string }).error
        : 'Respons database tidak valid.';
      return jsonResponse(502, { error });
    }
    return jsonResponse(200, database as Record<string, unknown>);
  } catch (error) {
    console.error('Google Sheets read proxy failed:', error);
    return jsonResponse(502, { error: 'Gagal membaca database Google Sheets.' });
  }
}

function isValidScriptUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'script.google.com' && url.pathname.endsWith('/exec');
  } catch {
    return false;
  }
}

function isValidSaveRequest(body: Record<string, unknown>): boolean {
  if (body.action === 'saveAll') {
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) return false;
    const data = body.data as Record<string, unknown>;
    return [...allowedCollections].every((collection) => {
      const value = data[collection];
      return collection === 'galleryItems' || collection === 'historyEntries'
        ? Array.isArray(value)
        : !!value && typeof value === 'object' && !Array.isArray(value);
    });
  }
  if (body.action !== 'saveCollection' || typeof body.collection !== 'string') return false;
  return allowedCollections.has(body.collection) && 'data' in body;
}
