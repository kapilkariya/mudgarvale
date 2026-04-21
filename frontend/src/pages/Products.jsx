import React, { useEffect, useState } from 'react';
import { productAPI } from '../config/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'mudgar', 'gada', 'samtola', 'senaboard'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
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

  // Get minimum price from pricePerWeight map
  const getMinPrice = (product) => {
    if (product.minPrice) return product.minPrice;
    if (product.pricePerWeight) {
      const prices = Object.values(product.pricePerWeight);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return product.price || 0;
  };

  // Format price for display
  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  return (
    <div>
      {/* Header Spacer */}
      <div className="w-full" style={{ height: '70px', backgroundColor: '#5C3A21' }}></div>

      {/* Hero Section */}
      <div
        className="w-full min-h-[250px] sm:min-h-[300px] md:min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg4.png')" }}
      >
        <div className="absolute inset-0 flex items-start justify-center pt-4 sm:pt-8 md:pt-12 lg:pt-16">
          <h2
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-wider md:tracking-widest text-center px-4 text-[#6b3a10]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            MEET OUR COMPLETE LINEUP
          </h2>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-[#fdf6ec] px-4 md:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl md:text-3xl font-semibold text-gray-800"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            All Products
          </h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#5C3A21] text-white'
                  : 'bg-white text-gray-700 hover:bg-[#5C3A21] hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-block">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
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
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-6 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition"
                  >
                    View All Products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="rounded-xl overflow-hidden aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mt-3 px-3 pb-3">
                      <h3 className="text-sm md:text-base font-medium text-gray-800 text-center line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-1 mt-1 flex-wrap text-center">
                        <span className="text-xs text-gray-500">From</span>
                        <span className="text-sm font-semibold text-[#5C3A21]">
                          {formatPrice(getMinPrice(product))}
                        </span>
                      </div>

                      {/* Available Weights */}
                      {product.weights && product.weights.length > 0 && (
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {product.weights.join(', ')}
                        </p>
                      )}

                      {/* Category Tag */}
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#fdf6ec] text-[#5C3A21] text-xs rounded-full">
                        {product.category}
                      </span>
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