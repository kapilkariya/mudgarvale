import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, configAPI, addressAPI } from '../config/api';
import { calculateDeliveryCharge } from '../utils/deliveryCharge';

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [configLoading, setConfigLoading] = useState(true);

  // Saved addresses from backend
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch config and saved addresses from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, addressesResponse] = await Promise.all([
          configAPI.get(),
          addressAPI.getAll(),
        ]);

        if (configResponse.success) {
          setRazorpayKeyId(configResponse.data.razorpayKeyId || '');
        }

        if (addressesResponse.success) {
          setSavedAddresses(addressesResponse.data);
          // Auto-select default address if exists
          const defaultAddr = addressesResponse.data.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (addressesResponse.data.length > 0) {
            setSelectedAddressId(addressesResponse.data[0]._id);
          } else {
            setUseNewAddress(true); // No saved addresses, use new
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setConfigLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  const subtotal = getCartTotal();
  const deliveryCharge = calculateDeliveryCharge(cart);
  const codAdvance = paymentMethod === 'cod' ? deliveryCharge : 0;
  const total = subtotal + deliveryCharge;
  const amountToPayNow = paymentMethod === 'cod' ? codAdvance : total;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // If using saved address, no need to validate form
    if (!useNewAddress && selectedAddressId) {
      return null;
    }
    // Validate new address form
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.state.trim()) return 'Please enter your state';
    if (!formData.pincode.trim()) return 'Please enter your pincode';
    if (formData.phone.length < 10) return 'Please enter a valid phone number';
    return null;
  };

  // Get address data for order (either from saved address or form)
  const getOrderAddress = () => {
    if (!useNewAddress && selectedAddressId) {
      const selectedAddress = savedAddresses.find(a => a._id === selectedAddressId);
      if (selectedAddress) {
        return {
          name: selectedAddress.name,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        };
      }
    }
    return formData;
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
      const address = getOrderAddress();
      const orderData = {
        items: cart,
        totalAmount: total,
        paymentMethod: paymentMethod,
        address: address,
      };

      // Save address if checkbox is checked (and user is using new address)
      if (saveAddress && useNewAddress) {
        try {
          await addressAPI.add({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: true,
          });
        } catch (addrErr) {
          console.error('Failed to save address:', addrErr);
          // Don't block order if address save fails
        }
      }

      // Create Razorpay order (not DB order yet)
      const response = await orderAPI.create(orderData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create Razorpay order');
      }

      const { razorpayOrder, orderData: savedOrderData } = response.data;

      if (razorpayOrder) {
        // Initialize Razorpay payment for both online and COD
        const options = {
          key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Mudgarvale',
          description: paymentMethod === 'cod' ? 'COD Advance Payment' : 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            // Verify payment and create DB order
            try {
              const verifyResponse = await orderAPI.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: savedOrderData,
              });

              if (verifyResponse.success) {
                clearCart();
                navigate('/my-orders', { state: { success: true } });
              } else {
                setError('Payment verification failed. Please contact support.');
              }
            } catch {
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

        razorpay.on('payment.failed', function () {
          setError('Payment failed. Please try again.');
          setLoading(false);
        });

        // Handle modal close/cancel
        razorpay.on('modal.close', function () {
          setError('Payment cancelled. No order was created.');
          setLoading(false);
        });
      } else {
        // No Razorpay order - should not happen now
        setError('Payment initialization failed. Please try again.');
        setLoading(false);
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
                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-gray-700 font-medium">Select Saved Address</label>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setUseNewAddress(false);
                        }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddressId === addr._id && !useNewAddress
                            ? 'border-[#5C3A21] bg-[#fdf6ec]'
                            : 'border-gray-200 hover:border-[#D4A373]'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{addr.name}</p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                          {addr.isDefault && (
                            <span className="text-xs bg-[#5C3A21] text-white px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Use New Address Option */}
                    <div
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId(null);
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${useNewAddress
                          ? 'border-[#5C3A21] bg-[#fdf6ec]'
                          : 'border-gray-200 hover:border-[#D4A373]'
                        }`}
                    >
                      <p className="font-medium text-gray-800">+ Use New Address</p>
                    </div>
                  </div>
                )}

                {/* New Address Form */}
                {useNewAddress && (
                  <div className="space-y-4 pt-4 border-t">
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
                      <label className="block text-gray-700 font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                        placeholder="Enter your email"
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
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none resize-none"
                        placeholder="Enter your complete address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                          placeholder="State"
                        />
                      </div>
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

                    {/* Save this address checkbox - only if no saved address exists */}
                    {savedAddresses.length === 0 && (
                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 text-[#5C3A21] border-gray-300 rounded focus:ring-[#5C3A21]"
                        />
                        <label htmlFor="saveAddress" className="ml-2 text-gray-700 text-sm cursor-pointer">
                          Save this address for future orders
                        </label>
                      </div>
                    )}
                  </div>
                )}

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
                        <p className="text-sm text-gray-500">Pay {formatPrice(deliveryCharge)} now, rest on delivery</p>
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

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border-2 border-amber-400 shadow-md">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-2xl">📞</span>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">For any queries, contact us at</p>
                <a
                  href="tel:7016243133"
                  className="text-xl md:text-2xl font-bold text-[#5C3A21] hover:text-[#4a2e1a] transition-colors block"
                >
                  +91 7016243133
                </a>
              </div>
              <span className="text-2xl">💬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
