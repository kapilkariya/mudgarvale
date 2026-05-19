import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [likedReviews, setLikedReviews] = useState({});

  const handleLike = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      location: 'Pune, Maharashtra',
      product: 'Gada - 5kg',
      rating: 5,
      date: 'March 15, 2025',
      review: 'The gada is absolutely perfect! The weight distribution is balanced and the grip is comfortable. Been training with it for a month now and my shoulder mobility has improved significantly. Highly recommend for anyone serious about traditional Indian strength training.',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 2,
      name: 'Priya Deshmukh',
      location: 'Nagpur, Maharashtra',
      product: 'Mudgar - 3kg',
      rating: 5,
      date: 'March 10, 2025',
      review: 'Excellent craftsmanship! The mudgar feels authentic and the wood quality is superb. My forearms and grip strength have improved a lot.',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Deshmukh&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 3,
      name: 'Amit Patel',
      location: 'Ahmedabad, Gujarat',
      product: 'Samtola - 4kg',
      rating: 4,
      date: 'March 5, 2025',
      review: 'Great product for core strength and balance. The samtola is well-balanced and the weight is accurate.',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 4,
      name: 'Vikram Singh',
      location: 'Jaipur, Rajasthan',
      product: 'Gada - 7kg',
      rating: 5,
      date: 'February 28, 2025',
      review: 'This is the real deal! Reminds me of training in the akhara back home. The gada is perfectly weighted.',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 5,
      name: 'Neha Gupta',
      location: 'Delhi',
      product: 'Mudgar - 2kg',
      rating: 5,
      date: 'February 20, 2025',
      review: 'Perfect for beginners! The 2kg mudgar is ideal for learning the proper form.',
      avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 6,
      name: 'Suresh Kumar',
      location: 'Chennai, Tamil Nadu',
      product: 'Samtola - 6kg',
      rating: 5,
      date: 'February 15, 2025',
      review: 'Absolutely authentic product! The samtola has transformed my core training routine.',
      avatar: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 7,
      name: 'Anjali Mehta',
      location: 'Mumbai, Maharashtra',
      product: 'Gada - 3kg',
      rating: 5,
      date: 'February 10, 2025',
      review: 'Beautifully crafted gada! Perfect for my daily mobility routine.',
      avatar: 'https://ui-avatars.com/api/?name=Anjali+Mehta&background=5C3A21&color=fff&size=100',
      verified: true,
    },
    {
      id: 8,
      name: 'Karan Yadav',
      location: 'Lucknow, Uttar Pradesh',
      product: 'Mudgar - 4kg',
      rating: 4,
      date: 'February 5, 2025',
      review: 'Great quality mudgar. The weight is perfect and the balance is good.',
      avatar: 'https://ui-avatars.com/api/?name=Karan+Yadav&background=5C3A21&color=fff&size=100',
      verified: true,
    },
  ];

  const stats = {
    averageRating: 4.8,
    totalReviews: reviews.length,
  };

  const loadMore = () => {
    setVisibleReviews(prev => prev + 4);
  };

  // Instagram Reels data
  const instagramReels = [
    { id: 1, url: 'https://www.instagram.com/reel/DVGJLtgiiPQ/', thumbnail: 'https://img.youtube.com/vi/w-XUR-K8c1w/maxresdefault.jpg' },
    { id: 2, url: 'https://www.instagram.com/reel/DU5UoIOgcid/', thumbnail: 'https://img.youtube.com/vi/dwi0F7WE0yw/maxresdefault.jpg' },
    { id: 3, url: 'https://www.instagram.com/reel/DQvmqXPDpho/', thumbnail: 'https://img.youtube.com/vi/GLIPlntdOmU/maxresdefault.jpg' },
    { id: 4, url: 'https://www.instagram.com/reel/DQe4AU7j23j/', thumbnail: 'https://img.youtube.com/vi/l8uDtnCjCnM/maxresdefault.jpg' },
  ];

  // YouTube Shorts data
  const youtubeShorts = [
    { id: 1, thumbnail: 'https://img.youtube.com/vi/w-XUR-K8c1w/maxresdefault.jpg', url: 'https://www.youtube.com/shorts/w-XUR-K8c1w' },
    { id: 2, thumbnail: 'https://img.youtube.com/vi/dwi0F7WE0yw/maxresdefault.jpg', url: 'https://www.youtube.com/shorts/dwi0F7WE0yw' },
    { id: 3, thumbnail: 'https://img.youtube.com/vi/GLIPlntdOmU/maxresdefault.jpg', url: 'https://www.youtube.com/shorts/GLIPlntdOmU' },
    { id: 4, thumbnail: 'https://img.youtube.com/vi/l8uDtnCjCnM/maxresdefault.jpg', url: 'https://www.youtube.com/shorts/l8uDtnCjCnM' },
  ];

  return (
    <div className="bg-[#f3eadf] text-[#3a1f0f]">
      {/* Top spacer */}
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      {/* Hero Section - with decorative elements */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full border-4 border-[#5C3A21]"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-4 border-[#5C3A21]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-[#5C3A21]"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#5C3A21]/40 to-[#3a1f0f]/60"></div>

        <div className="relative text-center max-w-3xl mx-auto px-6 z-10">
          <div className="flex justify-center mb-8 animate-bounce">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-[#d4a96a] flex items-center justify-center text-4xl shadow-2xl">
              ⭐
            </div>
          </div>
          <h1 className="text-white font-serif text-5xl md:text-7xl leading-tight mb-6 drop-shadow-2xl">
            What Our <br />
            <span className="text-[#d4a96a]">Pehelwans</span> Say
          </h1>
          <p className="text-white/90 text-xl mt-4 font-light max-w-2xl mx-auto">
            Real reviews from athletes who train the traditional Indian way
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
              ⭐ 4.8 Average Rating
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
              👥 500+ Happy Customers
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#f3eadf" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Breadcrumb - Styled */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-6">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-[#6b4b3a] hover:text-[#5C3A21] transition-colors">Home</Link>
          <span className="text-[#6b4b3a]">→</span>
          <span className="text-[#5C3A21] font-semibold">Customer Reviews</span>
        </div>
      </div>

      {/* Stats Section - Enhanced */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5C3A21] to-[#8B5E3C] flex items-center justify-center text-3xl shadow-lg">
                📊
              </div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#3a1f0f]">Our Customer Satisfaction</h2>
            <div className="w-24 h-1 bg-[#d4a96a] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl font-serif text-[#5C3A21] mb-2">{stats.averageRating}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-[#f59e0b] text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-[#6b4b3a] font-medium">Average Rating</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl font-serif text-[#5C3A21] mb-2">{stats.totalReviews}+</div>
              <p className="text-sm text-[#6b4b3a] font-medium mt-2">Verified Reviews</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl font-serif text-[#5C3A21] mb-2">95%</div>
              <p className="text-sm text-[#6b4b3a] font-medium mt-2">Would Recommend</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl font-serif text-[#5C3A21] mb-2">500+</div>
              <p className="text-sm text-[#6b4b3a] font-medium mt-2">Happy Athletes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Reels Section - Enhanced */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#ede2d3] to-[#f3eadf]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-2xl shadow-lg">
              📸
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#3a1f0f]">Instagram Reels</h2>
              <p className="text-[#6b4b3a] text-base">Watch real customers in action • Authentic training videos</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instagramReels.map((reel, index) => (
              <a
                key={reel.id}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ background: '#fff' }}
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={reel.thumbnail}
                    alt="Instagram Reel"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* SOLID STRIP AT TOP TO COVER LOGO */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border-b border-amber-500/30 z-10"></div>

                  {/* Optional: Add your own brand text on the strip */}
                  <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center">
                        <span className="text-white text-[10px]">▶</span>
                      </div>
                      <span className="text-white text-xs font-semibold tracking-wide">MUDGARVALE</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#f58529] to-[#dd2a7b] text-white shadow-md z-30">
                    Reel
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm">Watch full video →</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    {/* YouTube Shorts Section - Enhanced */}
<section className="py-20 px-6 md:px-20">
  <div className="max-w-6xl mx-auto">
    <div className="flex items-center gap-4 mb-12">
      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-2xl shadow-lg">
        📺
      </div>
      <div>
        <h2 className="font-serif text-3xl md:text-4xl text-[#3a1f0f]">YouTube Shorts</h2>
        <p className="text-[#6b4b3a] text-base">Quick tutorials • Form guides • Expert tips</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {youtubeShorts.map((video, index) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          style={{ background: '#fff' }}
        >
          <div className="relative aspect-[9/16] overflow-hidden">
            <img
              src={video.thumbnail}
              alt="YouTube Short"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* SOLID STRIP AT TOP TO COVER LOGO */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border-b border-red-500/30 z-10"></div>
            
            {/* Optional: Add your own brand text on the strip */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center z-20">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-[10px]">▶</span>
                </div>
                <span className="text-white text-xs font-semibold tracking-wide">MUDGARVALE</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-md z-30">
              #Shorts
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm">Watch on YouTube →</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>
      {/* Written Reviews Section - Enhanced Cards */}
      <section className="py-20 px-6 md:px-20 bg-[#ede2d3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5C3A21] to-[#8B5E3C] flex items-center justify-center text-3xl shadow-lg">
                💬
              </div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#3a1f0f]">Written Reviews</h2>
            <div className="w-24 h-1 bg-[#d4a96a] mx-auto rounded-full"></div>
            <p className="text-[#6b4b3a] mt-4 text-lg">What our amazing customers have to say</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reviews.slice(0, visibleReviews).map((review, index) => (
              <div
                key={review.id}
                className="group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                style={{ background: '#fff', borderLeft: '4px solid #d4a96a' }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full border-2 border-[#d4a96a] shadow-md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-lg text-[#3a1f0f]">{review.name}</h3>
                      {review.verified && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B7355]">{review.location}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-base ${star <= review.rating ? 'text-[#f59e0b]' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#f3eadf] text-[#5C3A21] font-medium">
                        {review.product}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#b8a080]">{review.date}</p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <span className="text-5xl text-[#d4a96a] opacity-30 absolute -top-2 -left-2">"</span>
                  <p className="text-[#5c3d2e] leading-relaxed pl-6 pr-4 py-2">{review.review}</p>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-[#f3eadf]">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: likedReviews[review.id] ? '#5C3A21' : '#f3eadf',
                      color: likedReviews[review.id] ? '#fff' : '#5C3A21'
                    }}
                  >
                    👍 {likedReviews[review.id] ? 'Liked' : 'Helpful'}
                    {likedReviews[review.id] && <span className="ml-1">✓</span>}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleReviews < reviews.length && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="group px-10 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: '#5C3A21', color: '#f3eadf' }}
              >
                Load More Reviews
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-24 px-6 md:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-4 border-[#5C3A21]"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full border-4 border-[#5C3A21]"></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5C3A21] to-[#8B5E3C] flex items-center justify-center text-3xl shadow-lg mx-auto mb-6">
            📝
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#3a1f0f]">Share Your Experience</h2>
          <div className="w-24 h-1 bg-[#d4a96a] mx-auto rounded-full mb-6"></div>
          <p className="text-[#5c3d2e] text-lg mb-10 max-w-2xl mx-auto">
            Have you trained with our equipment? We'd love to hear your story.
            Tag us on Instagram or leave a review below.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <a
              href="https://instagram.com/mudgarvale"
              target="_blank"
              className="group px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)', color: '#fff' }}
            >
              📸 Follow on Instagram
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="mailto:reviews@mudgarvale.com"
              className="group px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              style={{ background: '#fff', color: '#5C3A21', border: '2px solid #5C3A21' }}
            >
              ✍️ Write a Review
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;