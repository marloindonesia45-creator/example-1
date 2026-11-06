import { defineEventHandler, getRequestHost, createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const hostname = getRequestHost(event); // Hasil: namaweb.memory.madebymarlo.my.id
  const parts = hostname.split('.');
  const namaWeb = parts[0]; // Mengambil kata paling depan (subdomain kustom)

  // Abaikan jika diakses lewat domain utama, localhost development, atau file aset statis (.css, .js, .png)
  if (
    namaWeb === 'memory' || 
    namaWeb === 'localhost' || 
    namaWeb === 'www' || 
    event.path.includes('.') || // Memastikan file gambar/ikon/aset statis tidak dicegat
    event.path.startsWith('/assets/')
  ) {
    return; 
  }

  // Ambil database KV dari environment Cloudflare Module
  const { DATABASE_WEBSITE } = event.context.cloudflare.env;
  
  if (!DATABASE_WEBSITE) {
    return;
  }

  // Ambil data string JSON dari KV berdasarkan nama subdomain
  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Website ${namaWeb} belum didaftarkan di database.` 
    });
  }

  // Parse data JSON yang dikirim dari uploader.js
  const siteConfig = JSON.parse(rawData);

  // SUNTIKKAN ENV KHUSUS INI KE CONTEXT RUNTIME NITRO
  // Baris ini krusial agar endpoint /api/* Anda dapat membaca data env unik ini!
  event.context.siteEnv = siteConfig.env;
});
