import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../config/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

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
    };

    addToCart(cartItem);

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
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover aspect-square"
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />
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
                    {weight}
                    <span className="block text-xs opacity-80">
                      {formatPrice(product.pricePerWeight[weight] || 0)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
