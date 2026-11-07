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

  const { DATABASE_WEBSITE } = event.context.cloudflare.env;
  
  if (!DATABASE_WEBSITE) {
    return;
  }

  // Ambil data string JSON dari KV berdasarkan nama subdomain kustom (misal: "romance")
  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Website dengan subdomain '${namaWeb}' belum didaftarkan di database KV.` 
    });
  }

  const siteConfig = JSON.parse(rawData);
  
  // Suntikkan .env rahasia milik domain "romance" ke runtime context Nitro
  event.context.siteEnv = siteConfig.env;
});
