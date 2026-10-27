import React from 'react';

interface OurMomentsSectionProps {
  backgroundImage?: string;
}

export const OurMomentsSection: React.FC<OurMomentsSectionProps> = ({
  backgroundImage = '/src/assets/images/banner_ocean_sunset_1792387568878.jpg',
}) => {
  return (
    <section id="moments" className="relative min-h-[520px] sm:min-h-[580px] flex items-center overflow-hidden">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Senja hangat di atas laut dan tebing perbukitan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
        {/* Gradients to match screenshot mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121517] via-transparent to-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Emotional Copy */}
          <div className="lg:col-span-7 max-w-xl">
            <p className="text-xs tracking-[0.25em] text-white/70 uppercase font-medium mb-3 select-none">
              OUR MOMENTS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.2] tracking-tight mb-6">
              Hal-hal kecil,<br />yang jadi besar
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-light max-w-md">
              Karena setiap tawa, cerita, dan perjuangan bersama adalah bagian dari perjalanan hidup yang ingin selalu kita kenang.
            </p>
          </div>

          {/* Right Column: Handwritten Note */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <div className="font-handwriting text-2xl sm:text-3xl text-amber-100/90 leading-snug transform -rotate-6 select-none max-w-xs">
              <p>Terima kasih</p>
              <p>sudah menjadi</p>
              <p>bagian dari cerita ini.</p>
              
              {/* Hand-drawn double dash underline */}
              <div className="flex gap-1.5 mt-2 ml-1 text-white/50">
                <span className="w-8 h-[1.5px] bg-white/70 inline-block transform rotate-[-4deg]" />
                <span className="w-8 h-[1.5px] bg-white/70 inline-block transform rotate-[-4deg]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
