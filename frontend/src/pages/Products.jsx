import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productAPI } from '../config/api';

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'mudgar', 'gada', 'samtola', 'senaboard'];

  // Category metadata configuration
  const categoryMeta = {
    all: {
      title: 'All Products - Traditional Fitness Equipment | Mudgarvale',
      description: 'Explore our complete range of traditional Indian fitness equipment including Mudgar, Gada, Samtola, and SenaBoard. Premium quality workout tools for strength training.',
      keywords: 'traditional fitness equipment, mudgar, gada, samtola, senaboard, Indian workout tools',
    },
    mudgar: {
      title: 'Wooden Mudgar for Strength Training | Mudgarvale',
      description: 'Explore handcrafted wooden Mudgars designed for traditional strength training and fitness. Durable, well-balanced, and available in multiple sizes.',
      keywords: 'wooden mudgar, mudgar for strength training, traditional fitness, handcrafted mudgar, mudgar workout',
    },
    gada: {
      title: 'Indian Gada for Traditional Workout | Mudgarvale',
      description: 'Shop handcrafted Indian Gada for strength, endurance, and traditional fitness training. Available in different weights with pan-India delivery.',
      keywords: 'indian gada, traditional gada, gada workout, strength training mace, handcrafted gada',
    },
    samtola: {
      title: 'Traditional Samtola for Fitness Training | Mudgarvale',
      description: 'Discover high-quality Samtola for traditional fitness and strength training. Crafted for balance, durability, and long-lasting performance.',
      keywords: 'samtola, traditional samtola, fitness training, strength training equipment, Indian workout tools',
    },
    senaboard: {
      title: 'Sena Push-Up Board for Upper Body Training | Mudgarvale',
      description: 'Improve your upper body strength with a durable Sena Push-Up Board. Ideal for home workouts, gyms, and professional fitness training.',
      keywords: 'sena push-up board, upper body training, home workout, push-up board, fitness equipment',
    }
  };

  // Get category from URL - runs on every render
  const getCategoryFromURL = () => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return categories.includes(lastSegment) ? lastSegment : 'all';
  };

  // Fetch products function
  const fetchProducts = async (category) => {
    try {
      setLoading(true);
      setError(null);

      const params = category !== 'all' ? { category: category } : {};
      const response = await productAPI.getAll(params);

      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Main effect - runs on mount and when URL changes
  useEffect(() => {
    const category = getCategoryFromURL();
    setSelectedCategory(category);
    fetchProducts(category);
  }, [location.pathname]); // Re-run when URL changes

  // Update meta tags when category changes
  useEffect(() => {
    const meta = categoryMeta[selectedCategory] || categoryMeta.all;
    document.title = meta.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = meta.description;
      document.head.appendChild(newMeta);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', meta.keywords);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'keywords';
      newMeta.content = meta.keywords;
      document.head.appendChild(newMeta);
    }
  }, [selectedCategory]);

  const getMinPrice = (product) => {
    if (product.minPrice) return product.minPrice;
    if (product.pricePerWeight) {
      const prices = Object.values(product.pricePerWeight);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return product.price || 0;
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  // Handle category click - navigate to sub-route
  const handleCategoryClick = (category) => {
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${category}`);
    }
  };

  // Sort products by category order: mudgar -> gada -> samtola -> senaboard
  const categoryOrder = {
    mudgar: 1,
    gada: 2,
    samtola: 3,
    senaboard: 4,
  };

  const sortedProducts = [...products].sort((a, b) => {
    const orderA = categoryOrder[a.category] || 999;
    const orderB = categoryOrder[b.category] || 999;
    return orderA - orderB;
  });

  // Get display title
  const getDisplayTitle = () => {
    if (selectedCategory === 'all') return 'All Products';
    return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div>
      {/* Header Spacer */}
      <div className="w-full" style={{ height: '70px', backgroundColor: '#5C3A21' }}></div>

      {/* Hero Section */}
      <div
        className="w-full min-h-[200px] xs:min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] rounded-b-2xl overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg4.png')" }}
      >
        <div className="absolute inset-0 flex items-start justify-center pt-3 xs:pt-4 sm:pt-6 md:pt-8 lg:pt-12 xl:pt-16">
          <h2
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-wide sm:tracking-wider md:tracking-widest text-center px-3 sm:px-4 text-[#6b3a10]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            MEET OUR COMPLETE LINEUP
          </h2>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-[#fdf6ec] px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {getDisplayTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>

        {/* Category Filter - Buttons at the top */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mb-8 sm:mb-10 md:mb-12 border-b border-[#D4A373]/30 pb-3 sm:pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`
                px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7 
                py-1.5 xs:py-2 sm:py-2 md:py-2.5 
                text-xs xs:text-sm sm:text-base md:text-lg
                font-medium transition-all duration-200
                whitespace-nowrap
                ${selectedCategory === cat
                  ? 'text-[#5C3A21] border-b-2 border-[#5C3A21] -mb-[0.688rem] xs:-mb-[0.75rem] sm:-mb-[0.875rem] md:-mb-[1rem] lg:-mb-[1.125rem]'
                  : 'text-gray-500 hover:text-[#5C3A21] border-b-2 border-transparent hover:border-[#D4A373]/50'
                }
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#5C3A21]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10 sm:py-12 md:py-16">
            <div className="bg-red-100 text-red-800 p-3 sm:p-4 rounded-lg inline-block max-w-[90%] sm:max-w-full">
              <p className="font-medium text-sm sm:text-base">Error</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchProducts(selectedCategory)}
                className="mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12 sm:py-16 md:py-20">
                <p className="text-gray-500 text-base sm:text-lg">No products found</p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition text-sm sm:text-base"
                  >
                    View All Products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-7">
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
                  >
                    {/* Product Image */}
                    <div className="rounded-xl overflow-hidden h-70 md:h-120 sm: aspect-square bg-gray-100">
                      <img
                        src={`/products/${product.image}.jpeg`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mt-2 xs:mt-3 px-2 xs:px-3 pb-2 xs:pb-3">
                      <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium text-gray-800 text-center line-clamp-2 min-h-[2rem] xs:min-h-[2.5rem] sm:min-h-[3rem]">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-1 mt-1 flex-wrap text-center">
                        <span className="text-[10px] xs:text-xs text-gray-500">From</span>
                        <span className="text-xs xs:text-sm sm:text-base font-semibold text-[#5C3A21]">
                          {formatPrice(getMinPrice(product))}
                        </span>
                      </div>

                      {/* Available Weights */}
                      {product.category !== 'senaboard' && product.weights && product.weights.length > 0 && (
                        <p className="text-[10px] xs:text-xs text-gray-500 text-center mt-1 truncate">
                          {product.weights.slice(0, 3).map(weight => `${weight} kg`).join(', ')}
                          {product.weights.length > 3 && '...'}
                        </p>
                      )}

                      {/* Category Tag */}
                      <div className="flex justify-center mt-2">
                        <span className="inline-block px-1.5 xs:px-2 py-0.5 bg-[#fdf6ec] text-[#5C3A21] text-[9px] xs:text-xs rounded-full border border-[#D4A373]/30">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;