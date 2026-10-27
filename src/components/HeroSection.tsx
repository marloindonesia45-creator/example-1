import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  heroSlide1?: string;
  heroSlide2?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroSlide1 = '/src/assets/images/hero_friends_summit_1792387566312.jpg',
  heroSlide2 = '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      kicker: 'MEMORIES',
      headline: (
        <>
          Good Friends<br />
          Make Great<br />
          Journeys
        </>
      ),
      subtext: 'Bukan hanya tentang tempat yang kita kunjungi, tapi tentang orang-orang yang selalu ada di setiap langkah.',
      handwrittenLines: ['Same people', 'Different places', 'Still us.'],
      bgImage: heroSlide1,
      bgAlt: 'Sahabat duduk di puncak gunung saat matahari terbit keemasan'
    },
    {
      kicker: 'JOURNEYS',
      headline: (
        <>
          Every Sunset<br />
          Brings Us<br />
          Closer
        </>
      ),
      subtext: 'Menyimpan tawa, jejak cerita, dan hangatnya kebersamaan yang takkan pernah pudar oleh jarak dan waktu.',
      handwrittenLines: ['Time flies', 'Memories stay', 'Forever us.'],
      bgImage: heroSlide2,
      bgAlt: 'Pemandangan senja keemasan di atas pantai dan perbukitan'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section id="home" className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-between overflow-hidden">
      {/* Background Images with Crossfade */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.bgImage}
            alt={slide.bgAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Subtle gradient overlays for cinematic mood and reading legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:via-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121517] via-transparent to-black/40 sm:to-black/30" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-20 sm:py-36 flex flex-col justify-between min-h-[85vh]">
        {/* Top & Middle: Typography */}
        <div className="max-w-xl">
          {/* Small uppercase kicker */}
          <p className="text-xs tracking-[0.25em] text-white/70 uppercase font-medium mb-4 select-none">
            {current.kicker}
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white font-normal leading-[1.12] tracking-tight mb-6 transition-all duration-700">
            {current.headline}
          </h1>

          {/* Paragraph description */}
          <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md mb-8 font-light">
            {current.subtext}
          </p>

          {/* Clean divider line */}
          <div className="w-8 h-[1px] bg-white/60 mb-6" />

          {/* Handwritten Slanted Script */}
          <div className="font-handwriting text-2xl sm:text-3xl text-white/90 leading-snug transform -rotate-3 select-none">
            {current.handwrittenLines.map((line, i) => (
              <p key={i} className="hover:text-amber-200 transition-colors">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Pagination & Slide Nav Controls */}
        <div className="flex items-center justify-end w-full pt-8">
          <div className="flex items-center gap-4 text-white/90">
            <span className="text-xs sm:text-sm tracking-widest font-mono select-none">
              <span className="font-semibold text-white">0{currentSlide + 1}</span>
              <span className="text-white/40 mx-2">/</span>
              <span className="text-white/50">0{slides.length}</span>
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Slide selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
