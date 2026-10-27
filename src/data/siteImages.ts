export interface SiteImagesConfig {
  heroSlide1: string;
  heroSlide2: string;
  storyPhoto1: string; // Polaroid 1 (Atas - Pantai)
  storyPhoto2: string; // Polaroid 2 (Kiri - Gunung)
  storyPhoto3: string; // Polaroid 3 (Kanan - Peace)
  momentsBackground: string; // Section Our Moments (Hal-hal kecil)
  footerBackground: string; // Footer (Sampai jumpa di cerita selanjutnya)
}

export const defaultSiteImages: SiteImagesConfig = {
  heroSlide1: '/src/assets/images/hero_friends_summit_1792387566312.jpg',
  heroSlide2: '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
  storyPhoto1: '/src/assets/images/story_polaroid_sunset_1792387566720.jpg',
  storyPhoto2: '/src/assets/images/story_polaroid_mountain_1792387567297.jpg',
  storyPhoto3: '/src/assets/images/story_polaroid_peace_1792387567250.jpg',
  momentsBackground: '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
  footerBackground: '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
};
