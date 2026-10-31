const GOOGLE_DRIVE_HOSTS = new Set([
  'drive.google.com',
  'lh3.googleusercontent.com',
]);

export function getGoogleDriveThumbnailUrl(
  imageUrl: string,
  width = 800,
): string | undefined {
  try {
    const url = new URL(imageUrl);
    if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) return undefined;

    const fileId =
      url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] ??
      url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ??
      url.searchParams.get('id');
    if (!fileId) return undefined;

    const thumbnailUrl = new URL('https://drive.google.com/thumbnail');
    thumbnailUrl.searchParams.set('id', fileId);
    thumbnailUrl.searchParams.set('sz', `w${width}`);
    return thumbnailUrl.toString();
  } catch {
    return undefined;
  }
}
