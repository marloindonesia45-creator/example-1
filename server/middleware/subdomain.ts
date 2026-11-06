import { defineEventHandler, getRequestHost, createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const hostname = getRequestHost(event); // Hasil: ramen-ku.web.madebymarlo.my.id
  const parts = hostname.split('.');
  
  // Mengambil elemen pertama dari array parts (string subdomain unik paling depan)
  const namaWeb = parts[0]; 

  // Sekarang perbandingan aman karena tipe data 'namaWeb' sudah murni 'string'
  if (
    namaWeb === 'web' || 
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

  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Website dengan subdomain '${namaWeb}' belum didaftarkan.` 
    });
  }

  const siteConfig = JSON.parse(rawData);
  event.context.siteEnv = siteConfig.env;
});
