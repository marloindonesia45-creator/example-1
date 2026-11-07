import { defineEventHandler, getRequestHost, createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const hostname = getRequestHost(event); // Hasil: romance.madebymarlo.my.id
  const parts = hostname.split('.');
  const namaWeb = parts[0]; // Mengambil subdomain paling depan ("romance")

  if (
    namaWeb === 'memory' || 
    namaWeb === 'localhost' || 
    namaWeb === 'www' || 
    event.path.includes('.') || 
    event.path.startsWith('/assets/')
  ) {
    return;
  }

  const envSource: Record<string, unknown> | undefined =
    event.context?.cloudflare?.env ??
    event.context?.env ??
    (globalThis as typeof globalThis & { __env__?: Record<string, unknown> }).__env__;
  const databaseWebsite = envSource?.DATABASE_WEBSITE;

  if (!isKVNamespace(databaseWebsite)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Binding Cloudflare KV DATABASE_WEBSITE tidak tersedia.',
    });
  }

  // Ambil data string JSON dari KV berdasarkan nama subdomain kustom (misal: "romance")
  const rawData = await databaseWebsite.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Website dengan subdomain '${namaWeb}' belum didaftarkan di database KV.` 
    });
  }

  let siteConfig: unknown;
  try {
    siteConfig = JSON.parse(rawData);
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: `Data KV untuk subdomain '${namaWeb}' bukan JSON yang valid.`,
    });
  }

  if (!siteConfig || typeof siteConfig !== 'object' || Array.isArray(siteConfig)) {
    throw createError({
      statusCode: 500,
      statusMessage: `Data KV untuk subdomain '${namaWeb}' memiliki format yang tidak valid.`,
    });
  }

  const siteEnv = (siteConfig as { env?: unknown }).env;
  if (!siteEnv || typeof siteEnv !== 'object' || Array.isArray(siteEnv)) {
    throw createError({
      statusCode: 500,
      statusMessage: `Konfigurasi env KV untuk subdomain '${namaWeb}' tidak valid.`,
    });
  }
  
  // Suntikkan .env rahasia milik domain "romance" ke runtime context Nitro
  event.context.siteEnv = siteEnv;
});

function isKVNamespace(value: unknown): value is { get(key: string): Promise<string | null> } {
  return typeof value === 'object' &&
    value !== null &&
    'get' in value &&
    typeof value.get === 'function';
}
