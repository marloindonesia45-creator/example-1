import React from 'react';
import { ArrowUp } from 'lucide-react';

interface OutroSectionProps {
  backgroundImage?: string;
}

export const OutroSection: React.FC<OutroSectionProps> = ({
  backgroundImage = '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative min-h-[500px] sm:min-h-[580px] flex flex-col justify-between overflow-hidden text-white">
      {/* Background Ocean Sunset */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Matahari terbenam di atas laut dan ombak pantai"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Warm Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />
      </div>

      {/* Center Outro Message & Mountain Line Icon */}
      <div className="relative z-10 my-auto py-24 px-6 text-center flex flex-col items-center justify-center">
        {/* Handwritten Outro */}
        <div className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-white/95 tracking-wide transform -rotate-2 select-none mb-4">
          <p>Sampai jumpa</p>
          <p>di cerita selanjutnya</p>
          
          {/* Hand-drawn curved underline */}
          <div className="flex justify-center mt-2">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 8 C 25 12, 45 4, 65 9 C 80 13, 90 7, 95 8"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Minimalist Mountain Line-Art Icon (as in the bottom of screenshot) */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="w-10 sm:w-16 h-[1px] bg-white/40" />
            
            {/* Mountain Twin Peaks SVG Line */}
            <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left Peak */}
              <polyline points="2,22 14,4 23,17" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right Peak */}
              <polyline points="19,13 29,2 40,22" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span className="w-10 sm:w-16 h-[1px] bg-white/40" />
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs text-white/60">
        <div className="flex items-center gap-3">
          <span className="font-handwriting text-xl text-amber-200">Together</span>
          <span>·</span>
          <span>Kenangan Sahabat & Petualangan Abadi</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
