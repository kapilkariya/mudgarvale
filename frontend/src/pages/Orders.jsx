import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../config/api';

const Orders = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Show success message if redirected from checkout
    if (location.state?.success) {
      setShowSuccess(true);
      // Clear the state after showing
      window.history.replaceState({}, document.title);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();

      if (response.success) {
        setOrders(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      {/* Header Spacer */}
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5C3A21] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          My Orders
        </h1>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold">🎉 Order placed successfully!</p>
              <p className="text-sm">Thank you for your purchase.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-800 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
            <button
              onClick={fetchOrders}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold text-[#5C3A21]">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 
                       order.paymentStatus === 'partial_paid' ? 'Advance Paid' : 
                       order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={`/products/${item.image}.jpeg`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Weight: {item.selectedWeight}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-[#5C3A21] font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-sm">
                      {order.address.name}, {order.address.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.address.address}, {order.address.pincode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-[#5C3A21]">
                      {formatPrice(order.totalAmount)}
                    </p>
                    {order.paymentMethod === 'cod' && order.remainingAmount > 0 && (
                      <p className="text-sm text-orange-600">
                        Pay {formatPrice(order.remainingAmount)} on delivery
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
