/**
 * Helper to download any image directly to the user's computer in .jpg format
 */
export async function downloadImageAsJpg(imageUrl: string, title: string): Promise<boolean> {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'foto-kenangan';
  const fileName = `${cleanTitle}.jpg`;

  const triggerBlobDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  };

  // 1. If it's a local asset or data URL, fetch and save as JPEG
  if (imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const originalBlob = await response.blob();
        // Convert blob to JPEG if needed via Canvas
        const convertedBlob = await convertBlobToJpg(originalBlob);
        triggerBlobDownload(convertedBlob || originalBlob, fileName);
        return true;
      }
    } catch {
      // Continue to canvas fallback
    }
  }

  // 2. If it's a Google Drive link, extract File ID
  const gdriveMatch = imageUrl.match(/(?:lh3\.googleusercontent\.com\/d\/|\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]+)/);
  const fileId = gdriveMatch ? gdriveMatch[1] : null;

  // 3. Try to load image into Canvas and convert directly to image/jpeg
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image failed to load for canvas'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 1200;
    canvas.height = img.naturalHeight || img.height || 800;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // White background behind transparent pixels
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const jpgBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
      });

      if (jpgBlob) {
        triggerBlobDownload(jpgBlob, fileName);
        return true;
      }
    }
  } catch {
    // Canvas CORS restricted - continue to alternate download pathways
  }

  // 4. If it's Google Drive, direct export download triggers instant file saving
  if (fileId) {
    const directDriveDownload = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const link = document.createElement('a');
    link.href = directDriveDownload;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // 5. Final fallback: Fetch blob or direct anchor download
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
      triggerBlobDownload(jpgBlob, fileName);
      return true;
    }
  } catch {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  return false;
}

// Convert any image blob to image/jpeg
async function convertBlobToJpg(blob: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          resolve(b);
        }, 'image/jpeg', 0.95);
      } else {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
