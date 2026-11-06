import { defineEventHandler, getRequestHost, createError } from 'h3';

export default defineEventHandler(async (event: any) => {
  const hostname = getRequestHost(event); // Hasil: "namaweb.memory.madebymarlo.my.id"
  const parts = hostname.split('.');
  
  // Karena formatnya: [namaweb] . [memory] . [madebymarlo] . [my] . [id]
  // Maka parts[0] adalah "namaweb"
  const namaWeb = parts[0]; 

  // Abaikan jika diakses lewat domain induk tingkat dua atau localhost development
  if (
    namaWeb === 'memory' || 
    namaWeb === 'localhost' || 
    namaWeb === 'www' || 
    event.path.includes('.') || 
    event.path.startsWith('/assets')
  ) {
    return; 
  }

  const { DATABASE_WEBSITE } = event.context.cloudflare.env;
  
  if (!DATABASE_WEBSITE) {
    return "<h1>Database KV tidak terhubung. Periksa binding di Cloudflare!</h1>";
  }

  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Website atau konfigurasi tidak ditemukan' 
    });
  }

  const siteConfig = JSON.parse(rawData);
  const currentEnv = siteConfig.env;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${currentEnv.NAMA_WEBSITE || 'Website'}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>body { background-color: ${currentEnv.WARNA_TEMA || '#ffffff'}; font-family: sans-serif; }</style>
      </head>
      <body>
        ${siteConfig.htmlContent}
      </body>
    </html>
  `;
});
