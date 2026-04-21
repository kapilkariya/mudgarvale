import React, { useState, useEffect } from 'react'

const reviews = [
  {
    image: '/cust1.jpg',
    name: 'Anjana Brijesh',
    location: 'Mumbai',
    stars: 5,
    text: 'A great way to learn from our ancient practices. Mudgar– a hand held club for upper body fitness and great for shoulder swings. Recently purchased from Mudgar club, this Mudgar can be used for men as well as women. The quality of the wood is exemplary and sturdy. Totally satisfied with Mudgar club. Eagerly waiting for the classes . Keep swinging',
  },
  {
    image: '/cust2.jpg',
    name: 'Rahul Sharma',
    location: 'Delhi',
    stars: 5,
    text: 'Absolutely love the craftsmanship. The wood quality is top notch and the weight feels perfect for training. This is a product rooted in tradition and it shows in every detail. Highly recommend Mudgar Club to anyone serious about fitness.',
  },
  {
    image: '/cust3.jpg',
    name: 'Priya Menon',
    location: 'Bangalore',
    stars: 5,
    text: 'I was skeptical at first but after using the Mudgar for a month I can feel a huge difference in my shoulder and core strength. Beautiful product, great packaging, and fast delivery. Will definitely buy again.',
  },
]

const HomePage = () => {
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

  return (
    <div style={{ backgroundColor: '#F5EDE0' }}>
      {/* Section 1 - Video Hero */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
        <video style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted playsInline>
          <source src="/homevid.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.15)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, padding: '0 1rem', maxWidth: '90%', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', fontWeight: 'bold', color: 'white', lineHeight: 1.3, marginBottom: '1.5rem', padding: '0 0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            ELEVATE YOUR FITNESS JOURNEY<br />WITH MUDGAR CLUB
          </h1>
          <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'white', fontWeight: 'bold', padding: '0.8rem 2rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.6)', cursor: 'pointer', fontSize: 'clamp(0.9rem, 4vw, 1.125rem)', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' }}>
            SHOP NOW →
          </button>
        </div>
      </div>

      {/* Section 2 - Welcome */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ backgroundColor: '#F5EDE0' }}>
        <img src="/bg1.svg" alt="" className="absolute inset-10 w-full h-full object-contain pointer-events-none" style={{ opacity: 1 }} />
        <div className="absolute inset-0 bg-gray-400/15 pointer-events-none"></div>

        <div className="relative z-10 max-w-[1000px] mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Welcome to Mudgar Club
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl font-medium tracking-wide mb-8" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            From Tradition To Transformation
          </p>
          <p className="text-base md:text-xl lg:text-2xl leading-relaxed mb-10 max-w-4xl mx-auto px-4" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Mudgar Club is about real strength and raw movement—no gimmicks, just solid wooden tools made to challenge you. Wonder where it all began?
          </p>
          <button className="px-12 py-4 rounded-full text-white text-lg md:text-xl tracking-widest uppercase transition-all duration-300 hover:opacity-90" style={{ backgroundColor: '#3B1408' }}>
            Step Into Our Story
          </button>
        </div>
      </div>

      {/* Section 3 - Bestseller Products */}
      <div className="shadow-[0_20px_30px_rgba(0,0,0,0.2)] w-full py-12 px-4" style={{ backgroundColor: '#F5EDE0' }}>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center mb-10 md:mb-15" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
          Bestseller Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full max-w-7xl mx-auto px-4">
          {/* Product 1 */}
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <img src="/prod1.png" alt="Sena Push-up Board" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-4 md:mt-8 text-xl md:text-3xl lg:text-4xl font-medium" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
              Sena Push-up Board
            </p>
          </div>

          {/* Product 2 */}
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <img src="/prod2.png" alt="Traditional Mudgar" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-4 md:mt-8 text-xl md:text-3xl lg:text-4xl font-medium" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
              Traditional Mudgar
            </p>
          </div>

          {/* Product 3 */}
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <img src="/prod3.png" alt="Indian Hanuman Gada" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-4 md:mt-8 text-xl md:text-3xl lg:text-4xl font-medium" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
              Indian Hanuman Gada
            </p>
          </div>

          {/* Product 4 */}
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] lg:h-[70vh]">
              <img src="/prod3.png" alt="Samtola" className="w-full h-full object-cover" />
            </div>
            <p className="text-center mt-4 md:mt-8 text-xl md:text-3xl lg:text-4xl font-medium" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
              Samtola
            </p>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className='h-[1px] bg-gray-800'></div>
      <div className="relative w-full h-[30vh] md:h-[45vh] overflow-hidden flex items-end justify-center pb-4 md:pb-8" style={{ backgroundColor: '#F5EDE0' }}>
        <img
          src="/bg2.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-80 pointer-events-none"
        />
        <div className="relative z-10 flex items-center justify-center w-full px-4 md:px-8 gap-2 md:gap-4">
          <div className="flex-1 h-[1.5px]" style={{ backgroundColor: '#3B1408' }} />
          <p className="text-lg md:text-3xl lg:text-4xl font-semibold text-center whitespace-normal md:whitespace-nowrap px-2" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
            Built by Hand. Backed by Tradition
          </p>
          <div className="flex-1 h-[1.5px]" style={{ backgroundColor: '#3B1408' }} />
        </div>
      </div>

      {/* Section 5 */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam1.webp" alt="Wood logs" className="w-full h-auto object-contain" />
        </div>
        <div className="relative flex items-center justify-center md:ml-8 lg:ml-16 w-[350px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
          <div className="relative z-10 px-6 md:px-10 lg:px-14 py-8 md:py-12 max-w-[420px]">
            <div className="flex items-start gap-1 mb-3">
              <span className="text-5xl md:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>1</span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug mt-2 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                It Starts with Premium Wood
              </h2>
            </div>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
              We handpick kiln-dried African Mahogany wood—dense, seasoned, and perfect for strength training. No shortcuts, just the best wood we can find.
            </p>
          </div>
        </div>
      </div>

      {/* Section 6 */}
      <div className="relative w-full min-h-[60vh] flex flex-col-reverse md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="relative flex items-center justify-center md:mr-8 lg:mr-16 w-[350px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
          <div className="relative z-10 px-6 md:px-10 lg:px-14 py-8 md:py-12 max-w-[420px]">
            <div className="flex items-start gap-1 mb-3">
              <span className="text-5xl md:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>2</span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug mt-2 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                Shaped with Precision
              </h2>
            </div>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
              Each piece is turned on a lathe by skilled hands to achieve the perfect shape, balance, and proportions—no CNC, just craftsmanship.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam2.webp" alt="Craftsman at lathe" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Section 7 */}
      <div className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam3.webp" alt="Wood logs" className="w-full h-auto object-contain" />
        </div>
        <div className="relative flex items-center justify-center md:ml-8 lg:ml-16 w-[350px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
          <div className="relative z-10 px-6 md:px-10 lg:px-14 py-8 md:py-12 max-w-[420px]">
            <div className="flex items-start gap-1 mb-3">
              <span className="text-5xl md:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>3</span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug mt-2 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                Finished by Hand
              </h2>
            </div>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
              After shaping, every product is hand-sanded, oiled, and polished to bring out the natural grain and ensure a smooth, durable finish
            </p>
          </div>
        </div>
      </div>

      {/* Section 8 */}
      <div className="relative w-full min-h-[60vh] flex flex-col-reverse md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="relative flex items-center justify-center md:mr-8 lg:mr-16 w-[350px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] lg:h-[500px]">
          <img src="/bg3.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
          <div className="relative z-10 px-6 md:px-10 lg:px-14 py-8 md:py-12 max-w-[420px]">
            <div className="flex items-start gap-1 mb-3">
              <span className="text-5xl md:text-7xl font-bold leading-none" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>4</span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug mt-2 md:mt-3" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                Packed with Care
              </h2>
            </div>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
              Before dispatch, every item is quality-checked, hand-oiled once more, and securely packed to travel safely to your home or gym.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[260px] mb-6 md:mb-0">
          <img src="/sam4.webp" alt="Craftsman at lathe" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Section 9 - Reviews */}
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 md:px-8" style={{ backgroundColor: '#F5EDE0' }}>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
          We've Got Some Compliments
        </h2>

        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateX(30px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .review-animate {
            animation: fadeSlide 0.5s ease forwards;
          }
        `}</style>

        <div
          key={current}
          className="review-animate flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden mx-4"
          style={{ backgroundColor: '#EDD9C0' }}
        >
          <div className="w-full md:w-[300px] lg:w-[420px] flex-shrink-0">
            <img
              src={review.image}
              alt={review.name}
              className="w-full h-full object-cover"
              style={{ minHeight: '300px', maxHeight: '520px' }}
            />
          </div>
          <div className="flex flex-col justify-center px-6 md:px-8 lg:px-10 py-8 md:py-12 flex-1">
            <h3 className="text-lg md:text-xl font-semibold mb-1" style={{ color: '#3B1408', fontFamily: 'Georgia, serif' }}>
              {review.name}
            </h3>
            <p className="text-xs md:text-sm mb-2" style={{ color: '#A0522D' }}>{review.location}</p>
            <div className="flex gap-1 mb-4 md:mb-6">
              {Array.from({ length: review.stars }).map((_, i) => (
                <span key={i} className="text-yellow-500 text-base md:text-xl">★</span>
              ))}
            </div>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed mb-6 md:mb-10" style={{ color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
              {review.text}
            </p>
            <div className="flex gap-4">
              <button
                onClick={prev}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border text-base md:text-lg transition hover:bg-white/40"
                style={{ borderColor: '#3B1408', color: '#3B1408' }}
              >
                ‹
              </button>
              <button
                onClick={next}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border text-base md:text-lg transition hover:bg-white/40"
                style={{ borderColor: '#3B1408', color: '#3B1408' }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 10 - Founder's Note */}
      <div className='h-[1px] bg-gray-800'></div>
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-16" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
          <div className="flex-shrink-0 w-[280px] md:w-[340px] lg:w-[420px]">
            <img
              src="/owner.webp"
              alt="Founder - Mudgarvale"
              className="w-full h-auto object-cover rounded-sm shadow-xl"
              style={{ border: '4px solid #3B1408' }}
            />
          </div>
          <div className="flex flex-col max-w-xl text-center md:text-left px-4" style={{ fontFamily: 'Georgia, serif', color: '#3B1408' }}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Founder's Note
            </h2>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-3 md:mb-4">
              When I started <span className="font-semibold" style={{ color: '#B8621A' }}>MudgarVale</span>, I wasn't sure how many people would care about ancient Indian training tools in today's world of quick-fix fitness. But I knew one thing — the strength built by tradition lasts a lifetime.
            </p>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-3 md:mb-4">
              What began as a simple attempt to teach Mudgar movements online has now grown into a community of modern-day warriors, rediscovering timeless strength practices. Every product we craft — from the premium mahogany <span className="font-semibold" style={{ color: '#B8621A' }}>Mudgars</span> to the legendary <span className="font-semibold" style={{ color: '#B8621A' }}>Hanuman Gada</span> — carries not just weight, but legacy.
            </p>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-3 md:mb-4">
              I'm grateful for every message, every order, every video you tag us in. You've helped turn this dream into something real — grounded in heritage and powered by passion. <span className="font-semibold" style={{ color: '#B8621A' }}>MudgarVale</span> is more than a brand; it's a movement.
            </p>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-8">
              Let's swing forward — together.
            </p>
            <p className="text-base md:text-lg lg:text-xl font-bold">
              – Anjit Suhag
            </p>
            <p className="text-xs md:text-sm lg:text-base mt-1" style={{ color: '#B8621A' }}>
              Founder, MudgarVale
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage