import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const reviews = [
  {
    image: '/cust1.jpeg',
    name: 'Amit Brijesh',
    location: 'Mumbai',
    stars: 5,
    text: 'A great way to learn from our ancient practices. Mudgar– a hand held club for upper body fitness and great for shoulder swings. Recently purchased from Mudgar club, this Mudgar can be used for men as well as women. The quality of the wood is exemplary and sturdy. Totally satisfied with Mudgar club. Eagerly waiting for the classes. Keep swinging',
  },
  {
    image: '/cust2.jpeg',
    name: 'Rahul Sharma',
    location: 'Delhi',
    stars: 5,
    text: 'Absolutely love the craftsmanship. The wood quality is top notch and the weight feels perfect for training. This is a product rooted in tradition and it shows in every detail. Highly recommend Mudgarvale to anyone serious about fitness.',
  },
  {
    image: '/cust3.jpeg',
    name: 'Arjun Menon',
    location: 'Bangalore',
    stars: 5,
    text: 'I was skeptical at first but after using the Mudgar for a month I can feel a huge difference in my shoulder and core strength. Beautiful product, great packaging, and fast delivery. Will definitely buy again.',
  },
]
const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent((c) => (c + 1) % reviews.length)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const review = reviews[current]

  const handleProductClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (

    <div style={{ backgroundColor: '#F5EDE0' }}>
      {/* Section 1 - Video Hero */}
      <div className="lg:w-[85vw]" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
        <video
          ref={(videoRef) => {
            if (videoRef) {
              videoRef.addEventListener('timeupdate', () => {
                if (videoRef.currentTime >= 29) {
                  videoRef.currentTime = 0;
                  videoRef.play();
                }
              });
            }
          }}
          className="sm:object-[50%_20%] md:object-[50%_20%] lg:object-[50%_10%]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          preload="metadata"
          autoPlay
          loop={false}
          muted
          playsInline
        >
          <source src="/homevid2.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, padding: '0 1rem', maxWidth: '90%', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', fontWeight: 'bold', color: 'white', lineHeight: 1.3, marginBottom: '1.5rem', padding: '0 0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            ELEVATE YOUR FITNESS JOURNEY<br />WITH Mudgarvale
          </h1>
          <button
            onClick={() => navigate('/products')}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'white', fontWeight: 'bold', padding: '0.8rem 2rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.6)', cursor: 'pointer', fontSize: 'clamp(0.9rem, 4vw, 1.125rem)', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' }}
          >
            SHOP NOW →
          </button>
        </div>
      </div>

      {/* Section 2 - Welcome */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: '#F5EDE0' }}>
        <img src="/bg1.svg" alt="" className="absolute inset-10 w-full h-full object-contain pointer-events-none" style={{ opacity: 1 }} />
        <div className="absolute inset-0 bg-gray-400/15 pointer-events-none"></div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Welcome to Mudgarvale
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide mb-6 sm:mb-10 md:mb-15" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            From Tradition To Transformation
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 sm:mb-10 max-w-4xl mx-auto" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Mudgarvale is about real strength and raw movement—no gimmicks, just solid wooden tools made to challenge you. Wonder where it all began?
          </p>
          <button
            onClick={() => navigate('/about')}
            className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-white text-base sm:text-lg md:text-xl tracking-widest uppercase transition-all duration-300 hover:opacity-90" style={{ backgroundColor: '#3B1408' }}
          >
            Step Into Our Story
          </button>
        </div>
      </div>

      {/* Section 3 - Bestseller Products */}
      <div className="shadow-[0_20px_30px_rgba(0,0,0,0.2)] w-full py-12 sm:py-16 px-4 overflow-hidden" style={{ backgroundColor: '#F5EDE0' }}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center mb-8 sm:mb-12 md:mb-15" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
          Bestseller Products
        </h2>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 animate-infinite-scroll"
            style={{
              width: 'max-content',
              animation: 'scroll 25s linear infinite'
            }}
          >
            {/* First set of products */}
            <div
              onClick={() => handleProductClick('senaboard')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod3.jpeg" alt="Sena Push-up Board" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Sena Push-up Board
              </p>
            </div>

            <div
              onClick={() => handleProductClick('mudgar')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod1.png" alt="Traditional Mudgar" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Traditional Mudgar
              </p>
            </div>

            <div
              onClick={() => handleProductClick('gada')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod2.png" alt="Indian Hanuman Gada" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Indian Hanuman Gada
              </p>
            </div>

            <div
              onClick={() => handleProductClick('samtola')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod4.png" alt="Indian Samtola" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Indian Samtola
              </p>
            </div>

            {/* Duplicate set for seamless loop */}
            <div
              onClick={() => handleProductClick('senaboard')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod3.jpeg" alt="Sena Push-up Board" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Sena Push-up Board
              </p>
            </div>

            <div
              onClick={() => handleProductClick('mudgar')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod1.png" alt="Traditional Mudgar" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Traditional Mudgar
              </p>
            </div>

            <div
              onClick={() => handleProductClick('gada')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod2.png" alt="Indian Hanuman Gada" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Indian Hanuman Gada
              </p>
            </div>

            <div
              onClick={() => handleProductClick('samtola')}
              className="flex flex-col w-[280px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 cursor-pointer group"
            >
              <div className="rounded-2xl overflow-hidden h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]">
                <img src="/prod4.png" alt="Indian Samtola" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-center mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium group-hover:underline transition" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                Indian Samtola
              </p>
            </div>
          </div>
        </div>

        {/* Pause on hover */}
        <style>{`
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    .animate-infinite-scroll {
      animation: scroll 25s linear infinite;
    }
    
    .animate-infinite-scroll:hover {
      animation-play-state: paused;
    }
    
    /* Slower scroll on mobile for better readability */
    @media (max-width: 640px) {
      .animate-infinite-scroll {
        animation: scroll 35s linear infinite;
      }
    }
  `}</style>
      </div>

      {/* Section 4 */}
      <div className='h-[1px] bg-gray-800'></div>
      <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] overflow-hidden flex items-end justify-center pb-4 sm:pb-6 md:pb-8" style={{ backgroundColor: '#F5EDE0' }}>
        <img
          src="/bg2.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-80 pointer-events-none"
        />
        <div className="relative z-10 flex items-center justify-center w-full px-4 sm:px-6 md:px-8 gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1 h-[1.5px]" style={{ backgroundColor: '#3B1408' }} />
          <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-center whitespace-normal sm:whitespace-nowrap px-2" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Built by Hand. Backed by Tradition
          </p>
          <div className="flex-1 h-[1.5px]" style={{ backgroundColor: '#3B1408' }} />
        </div>
      </div>

{/* Section 5 - Left */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="flex-shrink-0 w-[200px] sm:w-[180px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam1.webp" alt="Wood logs" className="w-full h-auto object-contain" />
        </div>
        <div className="relative flex items-center justify-center md:ml-4 lg:ml-8 xl:ml-16 w-[350px] sm:w-[380px] md:w-[500px] lg:w-[600px] h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 md:py-10">
            <div className="max-w-[250px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px]">
              <div className="flex items-start gap-1 ml-15 md:ml-17 mb-1 sm:mb-2 md:mb-3">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>1</span>
                <h2 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-semibold leading-snug mt-1 sm:mt-1 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                  It Starts with Premium Wood
                </h2>
              </div>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed ml-15 md:ml-18" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                We handpick kiln-dried African Mahogany wood—dense, seasoned, and perfect for strength training. No shortcuts, just the best wood we can find.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6 - Right */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-end px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="relative flex items-center justify-center md:mr-4 lg:mr-8 xl:mr-16 w-[350px] sm:w-[380px] md:w-[500px] lg:w-[600px] h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px] order-2 md:order-1">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 md:py-10">
            <div className="max-w-[250px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px]">
              <div className="flex items-start gap-1 ml-15 md:ml-17 mb-1 sm:mb-2 md:mb-3">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>2</span>
                <h2 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-semibold leading-snug mt-1 sm:mt-1 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                  Shaped with Precision
                </h2>
              </div>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed ml-15 md:ml-18" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                Each piece is turned on a lathe by skilled hands to achieve the perfect shape, balance, and proportions—no CNC, just craftsmanship.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-[200px] sm:w-[180px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0 order-1 md:order-2">
          <img src="/sam2.webp" alt="Craftsman at lathe" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Section 7 - Left */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="flex-shrink-0 w-[200px] sm:w-[180px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam3.webp" alt="Wood logs" className="w-full h-auto object-contain" />
        </div>
        <div className="relative flex items-center justify-center md:ml-4 lg:ml-8 xl:ml-16 w-[350px] sm:w-[380px] md:w-[500px] lg:w-[600px] h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 md:py-10">
            <div className="max-w-[250px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px]">
              <div className="flex items-start gap-1 ml-15 md:ml-17 mb-1 sm:mb-2 md:mb-3">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>3</span>
                <h2 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-semibold leading-snug mt-1 sm:mt-1 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                  Finished by Hand
                </h2>
              </div>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed ml-15 md:ml-18" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                After shaping, every product is hand-sanded, oiled, and polished to bring out the natural grain and ensure a smooth, durable finish.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 8 - Right */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-end px-4 sm:px-6 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="relative flex items-center justify-center md:mr-4 lg:mr-8 xl:mr-16 w-[350px] sm:w-[380px] md:w-[500px] lg:w-[600px] h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px] order-2 md:order-1">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 md:py-10">
            <div className="max-w-[250px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px]">
              <div className="flex items-start gap-1 ml-15 md:ml-17 mb-1 sm:mb-2 md:mb-3">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>4</span>
                <h2 className="text-sm sm:text-base md:text-2xl lg:text-3xl font-semibold leading-snug mt-1 sm:mt-1 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                  Packed with Care
                </h2>
              </div>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed ml-15 md:ml-18" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                Before dispatch, every item is quality-checked, hand-oiled once more, and securely packed to travel safely to your home or gym.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-[200px] sm:w-[180px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0 order-1 md:order-2">
          <img src="/sam4.webp" alt="Craftsman at lathe" className="w-full h-auto object-contain" />
        </div>
      </div>



      {/* Section 9 - With Crossfade Animation */}
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 md:px-8 lg:px-16" style={{ backgroundColor: '#F5EDE0' }}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 text-center" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
          We've Got Some Compliments
        </h2>

        <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden mx-4 relative" style={{ backgroundColor: '#EDD9C0' }}>
          {/* Customer Image with crossfade */}
          <div className="w-full md:w-[300px] lg:w-[420px] flex-shrink-0 relative overflow-hidden">
            {reviews.map((r, idx) => (
              <img
                key={`img-${idx}`}
                src={r.image}
                alt={r.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                  }`}
                style={{ minHeight: '300px', maxHeight: '520px' }}
              />
            ))}
            {/* Placeholder to maintain height */}
            <img src={review.image} alt="" className="w-full h-full object-cover opacity-0" style={{ minHeight: '300px', maxHeight: '520px' }} />
          </div>

          {/* Review Content with crossfade */}
          <div className="flex flex-col justify-center px-6 sm:px-8 md:px-10 py-8 md:py-12 flex-1 relative min-h-[400px]">
            {reviews.map((r, idx) => (
              <div
                key={`content-${idx}`}
                className={`absolute inset-0 px-6 sm:px-8 md:px-10 py-8 md:py-12 transition-all duration-500 ease-in-out ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
                  }`}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-1" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
                  {r.name}
                </h3>
                <p className="text-xs md:text-sm mb-2" style={{ color: '#A0522D' }}>{r.location}</p>
                <div className="flex gap-1 mb-4 md:mb-6">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} className="text-yellow-500 text-base md:text-xl">★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-8 lg:mb-10" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                  {r.text}
                </p>
              </div>
            ))}

            {/* Navigation arrows - fixed position */}
            <div className="absolute bottom-8 left-6 sm:left-8 md:left-10 flex gap-4 z-10">
              <button
                onClick={prev}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border text-base md:text-lg transition hover:bg-white/40 hover:scale-110"
                style={{ borderColor: '#3B1408', color: '#3B1408' }}
              >
                ‹
              </button>
              <button
                onClick={next}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border text-base md:text-lg transition hover:bg-white/40 hover:scale-110"
                style={{ borderColor: '#3B1408', color: '#3B1408' }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
   
    </div>
  )
}

export default HomePage
