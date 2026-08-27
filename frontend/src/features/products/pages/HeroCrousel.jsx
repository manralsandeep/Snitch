import React, { useState, useEffect } from 'react';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Snitch Vibe Dummy Data (Edgy, Streetwear)
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1920&auto=format&fit=crop",
      title: "THE DARK DROP",
      subtitle: "MIN 40% OFF ON STREETWEAR",
      btnText: "SHOP COLLECTION"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1920&auto=format&fit=crop",
      title: "OVERSIZED FITS",
      subtitle: "REDEFINE YOUR PROPORTIONS",
      btnText: "EXPLORE NOW"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1920&auto=format&fit=crop",
      title: "SUMMER ESSENTIALS",
      subtitle: "BREATHABLE. STYLISH. MINIMAL.",
      btnText: "GRAB YOURS"
    }
  ];

  // Agli aur pichli slide par jane ke functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  // Timer Wala Scene: Har 3 second mein image badlegi
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    // Jab component hatega ya slide manually change hogi, toh purana timer clear kar denge
    return () => clearInterval(timer);
  }, [currentIndex]); // currentIndex add kiya taaki manual click par timer reset ho jaye

  return (
    <div className="relative mb-[30px]  w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black group">
      
      {/* 1. Images and Text Overlay */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with Black Gradient Overlay for Snitch vibe */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-24">
            <p className="text-white/80 tracking-[0.3em] text-sm md:text-base font-medium mb-3 uppercase">
              {slide.subtitle}
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-8">
              {slide.title}
            </h1>
            <div>
              <button className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
                {slide.btnText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 2. Left and Right Arrow Buttons (Hover par dikhenge) */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
      >
        {/* Simple Left Arrow SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
      >
        {/* Simple Right Arrow SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* 3. Bottom Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 h-1 ${
              index === currentIndex ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;