import { defineEventHandler, getRequestHost, createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const hostname = getRequestHost(event); // Hasil: romance.madebymarlo.my.id
  const parts = hostname.split('.');
  const namaWeb = parts[0]; // Mengambil subdomain paling depan ("romance")

  // Daftar pengecualian domain induk atau lokal agar tidak ikut mencari ke database KV
  if (
    namaWeb === 'memory' || 
    namaWeb === 'localhost' || 
    namaWeb === 'www' || 
    event.path.includes('.') || 
    event.path.startsWith('/assets/')
  ) {
    return; 
  }

  // Ambil binding Cloudflare KV dari environment secara aman (mendukung beberapa struktur runtime Nitro)
  const envSource = event.context?.cloudflare?.env || event.context?.env || (globalThis as any).__env__;
  const DATABASE_WEBSITE = envSource?.DATABASE_WEBSITE;
  
  if (!DATABASE_WEBSITE) {
    console.error("❌ Eror: Bindings DATABASE_WEBSITE tidak ditemukan di context Cloudflare!");
    return;
  }

  // Ambil data string JSON dari KV berdasarkan nama subdomain kustom (misal: "romance")
  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Subdomain '${namaWeb}' belum terdaftar di database KV.` 
    });
  }

  // Parse data JSON yang dikirim dari uploader.js
  const siteConfig = JSON.parse(rawData);
  
  // Amankan penyuntikkan ke runtime context agar terbaca oleh getServerEnvironment
  event.context.siteEnv = siteConfig.env;
});
