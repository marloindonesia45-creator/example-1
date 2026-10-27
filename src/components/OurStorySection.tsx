import React from 'react';

interface OurStorySectionProps {
  onSelectPhoto?: (image: string, title: string, caption: string) => void;
  storyPhoto1?: string;
  storyPhoto2?: string;
  storyPhoto3?: string;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({
  onSelectPhoto,
  storyPhoto1 = '/src/assets/images/story_polaroid_sunset_1792387566720.jpg',
  storyPhoto2 = '/src/assets/images/story_polaroid_mountain_1792387567297.jpg',
  storyPhoto3 = '/src/assets/images/story_polaroid_peace_1792387567250.jpg',
}) => {
  return (
    <section id="story" className="relative bg-[#ECE7DF] text-[#24272B] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Story Editorial Content */}
          <div className="lg:col-span-5 max-w-lg">
            <p className="text-xs tracking-[0.25em] text-[#7A756D] uppercase font-medium mb-3 select-none">
              OUR STORY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#22252A] font-normal leading-[1.18] tracking-tight mb-6">
              Tentang<br className="hidden sm:inline" /> Kebersamaan
            </h2>
            <p className="text-[#55524D] text-sm sm:text-base leading-relaxed font-light">
              Dari tawa yang tak pernah cukup, perjalanan yang penuh cerita, hingga hal-hal sederhana yang jadi luar biasa, semua terasa lebih berarti saat dijalani bersama.
            </p>
          </div>

          {/* Right Column: Artistic Polaroid Collage */}
          <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center lg:justify-end">
            
            {/* Handwritten "Better Together :)" at top right */}
            <div className="absolute top-2 right-4 sm:right-16 z-20 font-handwriting text-3xl sm:text-4xl text-[#3A3632] transform rotate-12 select-none pointer-events-none">
              <p className="leading-tight">Better</p>
              <p className="flex items-center gap-1.5 leading-tight pl-2">
                <span>Together</span>
                <span className="text-2xl transform rotate-90 inline-block font-sans ml-1 text-[#5A554F]">:)</span>
              </p>
            </div>

            {/* Polaroid 1 (Top / Center): Beach Sunset Silhouette */}
            <div
              onClick={() => onSelectPhoto?.(
                storyPhoto1,
                'Tawa di Tepi Senja',
                'Lompatan sukacita di bawah langit jingga yang tak akan pernah kami lupakan.'
              )}
              className="absolute top-4 sm:top-2 right-12 sm:right-28 w-48 sm:w-64 bg-white p-2.5 pb-7 sm:p-3 sm:pb-9 rounded-sm polaroid-shadow transform rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer group"
            >
              {/* Washi Tape Strip */}
              <div className="washi-tape top-[-10px] left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 -rotate-2" />
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <img
                  src={storyPhoto1}
                  alt="Sahabat tertawa bersama di pantai saat senja"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Polaroid 2 (Bottom Left): Mountain Valley Overlook */}
            <div
              onClick={() => onSelectPhoto?.(
                storyPhoto2,
                'Menatap Lembah Hijau',
                'Merangkul pundak satu sama lain di hadapan indahnya bentang alam semesta.'
              )}
              className="relative sm:absolute top-24 sm:top-28 left-0 sm:left-4 lg:left-12 w-48 sm:w-60 bg-white p-2.5 pb-7 sm:p-3 sm:pb-9 rounded-sm polaroid-shadow transform -rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer group z-10"
            >
              {/* Washi Tape Strip */}
              <div className="washi-tape top-[-10px] left-1/2 transform -translate-x-1/2 w-14 sm:w-16 h-5 sm:h-6 rotate-1" />
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <img
                  src={storyPhoto2}
                  alt="Tiga sahabat merangkul di puncak bukit"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Polaroid 3 (Bottom Right): Peace Signs at Sunset */}
            <div
              onClick={() => onSelectPhoto?.(
                storyPhoto3,
                'Simbol Kedamaian',
                'Jari-jari membentuk tanda damai menyongsong masa depan yang cerah.'
              )}
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-6 w-44 sm:w-56 bg-white p-2.5 pb-6 sm:p-3 sm:pb-8 rounded-sm polaroid-shadow transform rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer group z-20"
            >
              {/* Washi Tape Strip */}
              <div className="washi-tape top-[-8px] right-6 w-12 sm:w-16 h-4 sm:h-5 -rotate-6" />
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <img
                  src={storyPhoto3}
                  alt="Tangan membentuk tanda peace saat twilight"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Delicate Botanical Pressed Flower Illustration */}
            <div className="absolute right-0 bottom-8 sm:bottom-12 z-25 pointer-events-none opacity-85 translate-x-2 sm:translate-x-4">
              <svg width="45" height="110" viewBox="0 0 50 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stem */}
                <path d="M25 115 C24 85 28 45 22 10" stroke="#7E725F" strokeWidth="1.2" strokeLinecap="round" />
                {/* Branch 1 & Leaf */}
                <path d="M26 80 C32 75 38 74 42 76" stroke="#7E725F" strokeWidth="1" strokeLinecap="round" />
                <path d="M42 76 C40 71 35 72 26 80" fill="#9C8F79" opacity="0.6" />
                {/* Branch 2 & Leaf */}
                <path d="M24 55 C16 52 10 54 8 58" stroke="#7E725F" strokeWidth="1" strokeLinecap="round" />
                <path d="M8 58 C12 62 18 60 24 55" fill="#9C8F79" opacity="0.6" />
                {/* Flower Head Top */}
                <ellipse cx="22" cy="12" rx="4" ry="5" fill="#9C8F79" opacity="0.8" />
                <circle cx="20" cy="8" r="3" fill="#B4A68E" opacity="0.9" />
                <circle cx="25" cy="9" r="3.2" fill="#B4A68E" opacity="0.9" />
                <circle cx="23" cy="15" r="2.5" fill="#887C68" opacity="0.7" />
                {/* Small buds */}
                <circle cx="32" cy="30" r="2.5" fill="#A89A82" opacity="0.8" />
                <path d="M25 35 C28 32 30 31 32 30" stroke="#7E725F" strokeWidth="0.9" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
