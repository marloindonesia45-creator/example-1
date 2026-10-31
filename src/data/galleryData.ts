export interface GalleryItem {
  id: string;
  title: string;
  category: 'Perjalanan' | 'Kegiatan' | 'Harian' | 'Lainnya';
  author: string;
  date: string;
  location: string;
  image: string;
  thumbnail?: string;
  aspectRatio?: string;
  story: string;
  likes: number;
  objectPosition?: string;
  zoom?: number;
}

// 12 curated photos matching the 4x3 grid in the screenshot
export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'Menyambut Senja Pantai',
    category: 'Perjalanan',
    author: 'Marlo',
    date: '14 Juli 2024',
    location: 'Pantai Kuta, Bali',
    image: '/src/assets/images/story_polaroid_sunset_1792387566720.jpg',
    story: 'Lompatan tawa saat matahari perlahan tenggelam di cakrawala. Tak ada yang memikirkan hari esok, hanya menikmati deburan ombak dan hangatnya jingga.',
    likes: 42
  },
  {
    id: 'photo-2',
    title: 'Puncak Bukit & Lembah Hijau',
    category: 'Perjalanan',
    author: 'Rian',
    date: '28 Mei 2024',
    location: 'Bukit Paralayang, Batu',
    image: '/src/assets/images/story_polaroid_mountain_1792387567297.jpg',
    story: 'Duduk berjejer di tepian tebing sambil memandangi hamparan desa di kejauhan. Angin sejuk dan obrolan tentang mimpi-mimpi masa depan.',
    likes: 38
  },
  {
    id: 'photo-3',
    title: 'Hangatnya Api Unggun & Percikan Bintang',
    category: 'Kegiatan',
    author: 'Dimas',
    date: '10 Agustus 2024',
    location: 'Ranu Kumbolo, Semeru',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    story: 'Percikan api unggun terbang menembus malam yang dingin. Gitar tua, secangkir kopi panas, dan cerita rahasia yang hanya diucapkan di malam itu.',
    likes: 56
  },
  {
    id: 'photo-4',
    title: 'Cahaya Masuk di Antara Pepohonan',
    category: 'Perjalanan',
    author: 'Sarah',
    date: '5 Juni 2024',
    location: 'Hutan Pinus Mangunan, Yogyakarta',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    story: 'Mentari pagi menembus celah pepohonan pinus yang tinggi menjulang. Kami berjalan tanpa tergesa, menikmati udara segar hutan.',
    likes: 29
  },
  {
    id: 'photo-5',
    title: 'Melangkah di Jalur Berkelok',
    category: 'Perjalanan',
    author: 'Bagas',
    date: '18 September 2024',
    location: 'Jalan Lingkar Bromo, Pasuruan',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    story: 'Berjalan beriringan menyusuri jalan aspal sunyi di antara perbukitan. Setiap langkah punya kisahnya sendiri.',
    likes: 34
  },
  {
    id: 'photo-6',
    title: 'Gemerlap Lampu Kota dari Ketinggian',
    category: 'Kegiatan',
    author: 'Nadia',
    date: '22 Oktober 2024',
    location: 'Bukit Moko, Bandung',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    story: 'Melihat ribuan cahaya lampu kota dari puncak bukit. Di antara gemerlap itu, kebersamaan inilah yang terasa paling terang.',
    likes: 47
  },
  {
    id: 'photo-7',
    title: 'Satu Lingkaran, Satu Janji',
    category: 'Harian',
    author: 'Dika',
    date: '12 November 2024',
    location: 'Basecamp Sahabat, Jakarta',
    image: '/src/assets/images/story_polaroid_peace_1792387567250.jpg',
    story: 'Tos kepalan tangan yang selalu jadi tanda sebelum memulai petualangan baru. Simbol kekompakan yang tak lekang waktu.',
    likes: 51
  },
  {
    id: 'photo-8',
    title: 'Berjalan Menuju Garis Senja',
    category: 'Perjalanan',
    author: 'Marlo',
    date: '3 Juli 2024',
    location: 'Pantai Parangtritis, Bantul',
    image: '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
    story: 'Langkah kaki di atas pasir basah yang memantulkan warna jingga emas. Rasanya waktu ingin kami hentikan sejenak.',
    likes: 62
  },
  {
    id: 'photo-9',
    title: 'Bintang-Bintang di Atas Langit Malam',
    category: 'Lainnya',
    author: 'Fajar',
    date: '15 Agustus 2024',
    location: 'Savana Bromo, Probolinggo',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    story: 'Menatap galaksi Bima Sakti yang membentang luas. Merasa kecil di bawah semesta, namun begitu berharga karena berdiri bersama.',
    likes: 65
  },
  {
    id: 'photo-10',
    title: 'Piknik Sederhana di Rumput Hijau',
    category: 'Harian',
    author: 'Alya',
    date: '21 September 2024',
    location: 'Kebun Raya Cibodas, Cianjur',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    story: 'Gelar tikar, masak mi instan bersama di kompor gas mini, dan bercanda tanpa henti sampai perut kram.',
    likes: 31
  },
  {
    id: 'photo-11',
    title: 'Berdiri Gagah di Puncak Batu',
    category: 'Perjalanan',
    author: 'Kevin',
    date: '29 Agustus 2024',
    location: 'Puncak Gunung Prau, Dieng',
    image: '/src/assets/images/hero_friends_summit_1792387566312.jpg',
    story: 'Setelah mendaki berjam-jam melewati medan curam, pemandangan awan samudera di puncak ini menghapus semua lelah.',
    likes: 70
  },
  {
    id: 'photo-12',
    title: 'Tawa Lepas di Sudut Kota Tua',
    category: 'Harian',
    author: 'Tiara',
    date: '5 Oktober 2024',
    location: 'Kota Tua Semarang',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    story: 'Menyusuri lorong-lorong bangunan antik peninggalan masa lampau, mengambil foto-foto spontan yang penuh senyum tulus.',
    likes: 44
  }
];
