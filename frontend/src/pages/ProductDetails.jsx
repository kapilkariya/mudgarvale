import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../config/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 👈 State for image carousel

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productAPI.getById(id);

        if (response.success) {
          setProduct(response.data);
          // Auto-select first weight if available
          if (response.data.weights && response.data.weights.length > 0) {
            setSelectedWeight(response.data.weights[0]);
          }
          // Reset image index when product changes
          setCurrentImageIndex(0);
        } else {
          throw new Error(response.message || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Get all available images
  const getProductImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image) {
      images.push(product.image);
    }
    if (product.image2) {
      images.push(product.image2);
    }
    return images;
  };

  // Get current image
  const getCurrentImage = () => {
    const images = getProductImages();
    return images[currentImageIndex] || product?.image || '';
  };

  // Navigate to next image
  const nextImage = () => {
    const images = getProductImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    const images = getProductImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Check if multiple images exist
  const hasMultipleImages = () => {
    return getProductImages().length > 1;
  };

  // Get price for selected weight
  const getPrice = () => {
    if (!product || !selectedWeight) return 0;
    return product.pricePerWeight[selectedWeight] || 0;
  };

  // Calculate total price
  const getTotalPrice = () => {
    return getPrice() * quantity;
  };

  // Format price
  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedWeight) return;

    setAddingToCart(true);

    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.image,
      selectedWeight: selectedWeight,
      price: getPrice(),
      quantity: quantity,
      category: product.category,
    };

    addToCart(cartItem);

    // ✅ Google Ads Conversion Tracking
    const totalValue = getPrice() * quantity;
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18205627094/ltUXCI6-7rgcENalj-lD',
        'value': totalValue,
        'currency': 'INR'
      });
      console.log('✅ Google Ads conversion tracked:', totalValue);
    }

    // Show success feedback
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center">
            <p className="text-lg font-medium mb-2">{error || 'Product not found'}</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      {/* Header Spacer */}
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-[#5C3A21]" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-[#5C3A21]" onClick={() => navigate('/products')}>Products</span>
          <span className="mx-2">/</span>
          <span className="text-[#5C3A21]">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm group">
            <img
              src={`/products/${getCurrentImage()}.jpeg`}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover min-h-[400px]"
            />

            {/* Navigation Arrows - Only show if multiple images exist */}
            {hasMultipleImages() && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#5C3A21] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#5C3A21] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter/Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {getProductImages().map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        currentImageIndex === index
                          ? 'bg-[#5C3A21] w-6'
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Image Counter Text */}
                <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentImageIndex + 1} / {getProductImages().length}
                </div>
              </>
            )}

            {/* If only one image, show a small indicator */}
            {!hasMultipleImages() && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  1 / 1
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category Tag */}
            <span className="inline-block self-start px-3 py-1 bg-[#fdf6ec] text-[#5C3A21] text-sm rounded-full capitalize mb-3">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#5C3A21]">
                {formatPrice(getTotalPrice())}
              </span>
              {quantity > 1 && (
                <span className="text-gray-500 ml-2">
                  ({formatPrice(getPrice())} × {quantity})
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Weight Selection */}
            {product.category !== 'senaboard' && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Select Weight *</label>
                <div className="flex flex-wrap gap-2">
                  {product.weights.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedWeight === weight
                          ? 'border-[#5C3A21] bg-[#5C3A21] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-[#5C3A21]'
                      }`}
                    >
                      {weight} {product.category === 'decor' ? 'in' : 'kg'}
                      <span className="block text-xs opacity-80">
                        {formatPrice(product.pricePerWeight[weight] || 0)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#5C3A21] transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#5C3A21] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedWeight}
                className="flex-1 py-3 px-6 border-2 border-[#5C3A21] text-[#5C3A21] font-semibold rounded-lg hover:bg-[#5C3A21] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedWeight}
                className="flex-1 py-3 px-6 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;