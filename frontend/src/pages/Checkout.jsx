import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, configAPI } from '../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const [deliveryCharge, setDeliveryCharge] = useState(400);
  const [codAdvanceAmount, setCodAdvanceAmount] = useState(200);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [configLoading, setConfigLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch config from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await configAPI.get();
        if (response.success) {
          setDeliveryCharge(response.data.deliveryCharge || 400);
          setCodAdvanceAmount(response.data.codAdvanceAmount || 200);
          setRazorpayKeyId(response.data.razorpayKeyId || '');
        }
      } catch (err) {
        console.error('Failed to fetch config:', err);
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  const subtotal = getCartTotal();
  const codAdvance = paymentMethod === 'cod' ? codAdvanceAmount : 0;
  const total = subtotal + deliveryCharge;
  const amountToPayNow = paymentMethod === 'cod' ? codAdvance : total;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your address';
    if (!formData.pincode.trim()) return 'Please enter your pincode';
    if (formData.phone.length < 10) return 'Please enter a valid phone number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart,
        totalAmount: total,
        paymentMethod: paymentMethod,
        address: formData,
      };

      // Create order
      const response = await orderAPI.create(orderData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create order');
      }

      const { order, razorpayOrder } = response.data;

      if (paymentMethod === 'online' && razorpayOrder) {
        // Initialize Razorpay payment
        const options = {
          key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Mudgarvale',
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            // Verify payment
            try {
              const verifyResponse = await orderAPI.verifyPayment({
                orderId: order._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                clearCart();
                navigate('/my-orders', { state: { success: true } });
              } else {
                setError('Payment verification failed. Please contact support.');
              }
            } catch (err) {
              setError('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
          },
          theme: {
            color: '#5C3A21',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', function (response) {
          setError('Payment failed. Please try again.');
        });
      } else {
        // COD order - no immediate payment needed
        clearCart();
        navigate('/my-orders', { state: { success: true } });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (configLoading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf6ec]">
        <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
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
      {/* Header Spacer */}
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5C3A21] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Checkout
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Delivery Address
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                    placeholder="Enter your pincode"
                  />
                </div>

                {/* Payment Method */}
                <div className="pt-4">
                  <label className="block text-gray-700 font-medium mb-3">Payment Method *</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5C3A21] transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mr-3 w-4 h-4 text-[#5C3A21]"
                      />
                      <div>
                        <span className="font-semibold">Online Payment</span>
                        <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5C3A21] transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mr-3 w-4 h-4 text-[#5C3A21]"
                      />
                      <div>
                        <span className="font-semibold">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay Rs. {codAdvanceAmount} now, rest on delivery</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? 'Processing...' : `Pay ${formatPrice(amountToPayNow)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500"> ({item.selectedWeight} × {item.quantity})</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-orange-600">
                    <span>COD Advance (to pay now)</span>
                    <span>{formatPrice(codAdvance)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold text-[#5C3A21]">
                    <span>Total Amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {paymentMethod === 'cod' && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg text-sm text-orange-800">
                  <p>You'll pay <strong>{formatPrice(codAdvance)}</strong> now as advance.</p>
                  <p>Remaining <strong>{formatPrice(total - codAdvance)}</strong> to be paid on delivery.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
