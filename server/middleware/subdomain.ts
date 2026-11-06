// server/middleware/subdomain.ts
export default defineEventHandler(async (event) => {
  const hostname = getRequestHost(event); // Contoh: web1.memory.marloindonesia45.workers.dev
  const parts = hostname.split('.');
  const namaWeb = parts[0]; // Mengambil subdomain pertama ("web1")

  // Abaikan jika diakses lewat domain utama, localhost development, atau jika mengakses file static/assets
  if (
    namaWeb === 'memory' || 
    namaWeb === 'localhost' || 
    namaWeb === 'www' || 
    event.path.includes('.') || 
    event.path.startsWith('/_nuxt') || 
    event.path.startsWith('/assets')
  ) {
    return; // Teruskan request ke aplikasi React utama Anda
  }

  // Ambil database KV dari environment Cloudflare Module
  const { DATABASE_WEBSITE } = event.context.cloudflare.env;
  
  if (!DATABASE_WEBSITE) {
    return "<h1>Database KV tidak terhubung. Periksa binding di dashboard Cloudflare!</h1>";
  }

  // Ambil data string JSON dari KV berdasarkan nama subdomain
  const rawData = await DATABASE_WEBSITE.get(namaWeb);

  if (!rawData) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Website atau konfigurasi tidak ditemukan' 
    });
  }

  // Parse data JSON yang berisi data konten dan env spesifik web tersebut
  const siteConfig = JSON.parse(rawData);
  const currentEnv = siteConfig.env;

  // Langsung kembalikan / render halaman kustom dengan Env berbeda ke browser pengunjung
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
