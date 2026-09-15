import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, configAPI, addressAPI } from '../config/api';
import { calculateDeliveryCharge } from '../utils/deliveryCharge';

// ✅ Products that require a minimum order quantity of 2
const MIN_QTY_PRODUCTS = ['Tar Sort Danda'];

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [configLoading, setConfigLoading] = useState(true);
  const [freeGift, setFreeGift] = useState(0); // 0 = none, 1 = 1 KG Gada, 2 = Sena Board

  // Saved addresses from backend
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Address save state
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [addressError, setAddressError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone2: '',
    buildingFlatNo: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Minimum quantity helpers
  const getMinQty = (item) => {
    return MIN_QTY_PRODUCTS.includes(item.name) ? 2 : 1;
  };
  const hasMinQtyViolation = cart.some((item) => item.quantity < getMinQty(item));
  const violatedItems = cart.filter((item) => item.quantity < getMinQty(item));

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
          const defaultAddr = addressesResponse.data.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (addressesResponse.data.length > 0) {
            setSelectedAddressId(addressesResponse.data[0]._id);
          } else {
            setUseNewAddress(true);
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
  const isEligibleForFreeGift = subtotal >= 3000;
  const deliveryCharge = calculateDeliveryCharge(cart);
  const codAdvance = paymentMethod === 'cod' ? deliveryCharge : 0;
  const total = subtotal + deliveryCharge;
  const amountToPayNow = paymentMethod === 'cod' ? codAdvance : total;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (addressSaved) setAddressSaved(false);
  };

  const validateForm = () => {
    if (!useNewAddress && selectedAddressId) {
      return null;
    }
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.state.trim()) return 'Please enter your state';
    if (!formData.pincode.trim()) return 'Please enter your pincode';
    if (formData.phone.length !== 10) return 'Phone number must be exactly 10 digits';
    return null;
  };

  const validateAddressOnly = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.state.trim()) return 'Please enter your state';
    if (!formData.pincode.trim()) return 'Please enter your pincode';
    if (formData.phone.length !== 10) return 'Phone number must be exactly 10 digits';
    return null;
  };

  const getOrderAddress = () => {
    if (!useNewAddress && selectedAddressId) {
      const selectedAddress = savedAddresses.find(a => a._id === selectedAddressId);
      if (selectedAddress) {
        return {
          name: selectedAddress.name,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          phone2: selectedAddress.phone2 || '',
          buildingFlatNo: selectedAddress.buildingFlatNo || '',
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        };
      }
    }
    return formData;
  };

  const handleSaveAddress = async () => {
    setAddressError('');
    setAddressSaved(false);

    const validationError = validateAddressOnly();
    if (validationError) {
      setAddressError(validationError);
      return;
    }

    try {
      setSavingAddress(true);

      if (savedAddresses.length > 0) {
        await Promise.all(
          savedAddresses.map((addr) => addressAPI.delete(addr._id))
        );
      }

      await addressAPI.add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phone2: formData.phone2,
        buildingFlatNo: formData.buildingFlatNo,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: true,
      });

      try {
        const addressesResponse = await addressAPI.getAll();
        if (addressesResponse.success) {
          setSavedAddresses(addressesResponse.data);
          if (addressesResponse.data.length > 0) {
            setSelectedAddressId(addressesResponse.data[0]._id);
            setUseNewAddress(false);
          }
        }
      } catch (refreshErr) {
        console.error('Failed to refresh addresses:', refreshErr);
      }

      setAddressSaved(true);
      setAddressError('');
    } catch (err) {
      console.error('Failed to save address:', err);
      setAddressError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Block submit if any item violates its minimum quantity
    if (hasMinQtyViolation) {
      setError('Some items do not meet the minimum quantity. Please go back to the cart and fix them.');
      return;
    }

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
        freeGift: isEligibleForFreeGift ? freeGift : 0,
      };

      const response = await orderAPI.create(orderData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create Razorpay order');
      }

      const { razorpayOrder, orderData: savedOrderData } = response.data;

      if (razorpayOrder) {
        let paymentCompleted = false;
        let pendingOrderRemoved = false;

        const removePendingOrder = async () => {
          if (paymentCompleted || pendingOrderRemoved) {
            return;
          }

          pendingOrderRemoved = true;
          try {
            await orderAPI.cancelPending({ razorpayOrderId: razorpayOrder.id });
          } catch (error) {
            pendingOrderRemoved = false;
            throw error;
          }
        };

        const options = {
          key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Mudgarvale',
          description: paymentMethod === 'cod' ? 'COD Advance Payment' : 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            paymentCompleted = true;
            try {
              const verifyResponse = await orderAPI.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: savedOrderData,
              });

              if (verifyResponse.success) {
                clearCart();
                navigate('/thankyou', { state: { success: true } });
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

        razorpay.on('payment.failed', async function () {
          try {
            await removePendingOrder();
          } catch (removeError) {
            console.error('Failed to remove pending order after payment failure:', removeError);
          }

          setError('Payment failed. Please try again.');
          setLoading(false);
        });

        razorpay.on('modal.close', async function () {
          if (paymentCompleted) {
            return;
          }

          try {
            await removePendingOrder();
          } catch (removeError) {
            console.error('Failed to remove pending order:', removeError);
          }

          setError('Payment cancelled.');
          setLoading(false);
        });
      } else {
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
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5C3A21] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Checkout
        </h1>

        {/* ✅ Minimum quantity violation banner */}
        {hasMinQtyViolation && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 text-red-800 rounded-lg">
            <p className="font-semibold mb-1">⚠️ Minimum quantity not met</p>
            <ul className="text-sm list-disc list-inside">
              {violatedItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong>: requires at least {getMinQty(item)}, currently {item.quantity}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/cart')}
              className="mt-2 text-sm underline hover:no-underline font-medium"
            >
              Go to cart to fix
            </button>
          </div>
        )}

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
                            {addr.phone2 && (
                              <p className="text-sm text-gray-600">Alt: {addr.phone2}</p>
                            )}
                            {addr.buildingFlatNo && (
                              <p className="text-sm text-gray-600 mt-1">{addr.buildingFlatNo}</p>
                            )}
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
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: value });
                          if (addressSaved) setAddressSaved(false);
                        }}
                        required
                        maxLength="10"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none ${formData.phone && formData.phone.length !== 10 && formData.phone.length > 0
                          ? 'border-red-500'
                          : 'border-gray-300'
                          }`}
                        placeholder="Enter 10-digit phone number"
                      />
                      {formData.phone && formData.phone.length !== 10 && formData.phone.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">Phone number must be exactly 10 digits</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Alternate Phone Number (Optional)</label>
                      <input
                        type="tel"
                        name="phone2"
                        value={formData.phone2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone2: value });
                          if (addressSaved) setAddressSaved(false);
                        }}
                        maxLength="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                        placeholder="Enter alternate phone number (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Building / Flat No.</label>
                      <input
                        type="text"
                        name="buildingFlatNo"
                        value={formData.buildingFlatNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                        placeholder="Building no., flat no. (optional)"
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

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={savingAddress || addressSaved}
                        className={`w-full py-3 rounded-lg font-semibold transition border-2 ${addressSaved
                          ? 'bg-green-50 border-green-500 text-green-700 cursor-default'
                          : 'bg-white border-[#5C3A21] text-[#5C3A21] hover:bg-[#fdf6ec] disabled:opacity-50'
                          }`}
                      >
                        {savingAddress
                          ? 'Saving…'
                          : addressSaved
                            ? '✓ Address Saved'
                            : 'Save this address'}
                      </button>
                      {addressError && (
                        <p className="text-red-500 text-sm mt-2">{addressError}</p>
                      )}
                    </div>
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

                {/* Free Gift */}
                {isEligibleForFreeGift && (
                  <div className="pt-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-400">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🎁</span>
                        <h3 className="font-bold text-green-800">
                          Congratulations! You're eligible for a FREE gift
                        </h3>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Choose any <strong>one</strong> of the following:
                      </p>
                      <div className="space-y-2">
                        <label
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${freeGift === 1
                            ? 'border-green-600 bg-white'
                            : 'border-gray-200 bg-white hover:border-green-400'
                            }`}
                        >
                          <input
                            type="radio"
                            name="freeGift"
                            value={1}
                            checked={freeGift === 1}
                            onChange={() => setFreeGift(1)}
                            className="mr-3 w-4 h-4 text-green-600"
                          />
                          <span className="font-medium text-gray-800">1 KG Gada (Free)</span>
                        </label>

                        <label
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${freeGift === 2
                            ? 'border-green-600 bg-white'
                            : 'border-gray-200 bg-white hover:border-green-400'
                            }`}
                        >
                          <input
                            type="radio"
                            name="freeGift"
                            value={2}
                            checked={freeGift === 2}
                            onChange={() => setFreeGift(2)}
                            className="mr-3 w-4 h-4 text-green-600"
                          />
                          <span className="font-medium text-gray-800">Sena Board (Free)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || hasMinQtyViolation}
                  className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {hasMinQtyViolation
                    ? 'Fix quantities to continue'
                    : loading
                      ? 'Processing...'
                      : `Pay ${formatPrice(amountToPayNow)}`}
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

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item, index) => {
                  const belowMin = item.quantity < getMinQty(item);
                  return (
                    <div
                      key={index}
                      className={`flex justify-between text-sm ${belowMin ? 'text-red-600' : ''}`}
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500"> ({item.selectedWeight} × {item.quantity})</span>
                        {belowMin && (
                          <span className="block text-xs text-red-600">Min {getMinQty(item)} required</span>
                        )}
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  );
                })}

                {isEligibleForFreeGift && freeGift !== 0 && (
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">
                        🎁 {freeGift === 1 ? '1 KG Gada' : 'Sena Board'}
                      </span>
                      <span className="text-gray-500"> (Free Gift)</span>
                    </div>
                    <span>FREE</span>
                  </div>
                )}
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