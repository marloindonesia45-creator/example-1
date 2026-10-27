import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'together_access';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export function jsonResponse(
  statusCode: number,
  data: Record<string, unknown>,
  headers: HeadersInit = {},
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { status: statusCode, headers: responseHeaders });
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 1_000_000) {
    throw new Error('Request body is too large.');
  }

  const parsed: unknown = await request.json();
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Request body must be a JSON object.');
  }
  return parsed as Record<string, unknown>;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function passwordMatches(candidate: unknown): boolean {
  const expected = process.env.APP_ACCESS_PASSWORD;
  if (!expected || typeof candidate !== 'string') return false;

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function hasValidSession(request: Request): boolean {
  const token = getCookie(request, SESSION_COOKIE);
  const secret = process.env.APP_SESSION_SECRET;
  if (!token || !secret) return false;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expectedSignature = sign(payload, secret);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return false;
  }

  const expiresAt = Number(payload.split('.')[0]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function createSessionCookie(): string {
  const secret = process.env.APP_SESSION_SECRET;
  if (!secret) throw new Error('APP_SESSION_SECRET is not configured.');

  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const payload = `${expiresAt}.${randomBytes(16).toString('hex')}`;
  const token = `${payload}.${sign(payload, secret)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}${secure}`;
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get('cookie')?.split(';') ?? [];
  const entry = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}
