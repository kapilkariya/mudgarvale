import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateDeliveryCharge } from '../utils/deliveryCharge';

// ✅ Products that require a minimum order quantity of 2
const MIN_QTY_PRODUCTS = ['Tar Sort Danda'];

const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { cart, getCartTotal, updateQuantity, removeFromCart } = useCart();

  const deliveryCharge = calculateDeliveryCharge(cart);

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  // ✅ Minimum quantity per item (2 for Tar Sort Danda, else 1)
  const getMinQty = (item) => {
    return MIN_QTY_PRODUCTS.includes(item.name) ? 2 : 1;
  };

  // ✅ True if ANY item in the cart is below its minimum
  const hasMinQtyViolation = cart.some((item) => item.quantity < getMinQty(item));

  const subtotal = getCartTotal();
  const total = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf6ec]">
        <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5C3A21] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Shopping Cart ({cart.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const minQty = getMinQty(item);
              const belowMin = item.quantity < minQty;
              const isAtHardMin = item.quantity <= 1;

              return (
                <div
                  key={`${item.productId}-${item.selectedWeight}`}
                  className={`bg-white rounded-xl p-4 flex gap-4 shadow-sm transition ${belowMin ? 'border-2 border-red-400' : ''
                    }`}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={`/products/${item.image}.jpeg`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.category === 'sticks' || item.category === 'decor' ? 'Length' : 'Weight'}: {item.selectedWeight}{' '}
                      {item.category === 'sticks' || item.category === 'decor' ? 'in' : 'kg'}
                    </p>
                    <p className="text-[#5C3A21] font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>

                    {/* ✅ Warning if below minimum */}
                    {belowMin && (
                      <p className="text-xs text-red-600 font-semibold mt-1">
                        ⚠️ Minimum {minQty} required — please add {minQty - item.quantity} more
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕ Remove
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedWeight, item.quantity - 1)
                        }
                        disabled={isAtHardMin}
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-[#5C3A21] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedWeight, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-[#5C3A21]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-[#5C3A21]">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* ✅ Blocking message when a minimum is not met */}
              {hasMinQtyViolation && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
                  ⚠️ Some items don't meet the minimum quantity. Please fix them to continue.
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                disabled={hasMinQtyViolation}
                className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasMinQtyViolation ? 'Fix quantities to continue' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-2 text-[#5C3A21] font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;