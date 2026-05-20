import React, { useState, useEffect } from 'react';
import { adminAPI } from '../config/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Order status options with colors
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending_delivery', label: 'Not Delivered' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminAPI.getAllOrders();
        if (response.success) {
          setOrders(response.data);
          setFilteredOrders(response.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeFilter, orders]);

  const filterOrders = () => {
    let filtered = [...orders];
    
    switch(activeFilter) {
      case 'pending_delivery':
        filtered = orders.filter(o => 
          o.orderStatus !== 'delivered' && 
          o.orderStatus !== 'cancelled'
        );
        break;
      case 'action_taken':
        filtered = orders.filter(o => 
          o.orderStatus === 'confirmed' || 
          o.orderStatus === 'processing' || 
          o.orderStatus === 'shipped'
        );
        break;
      case 'delivered':
        filtered = orders.filter(o => o.orderStatus === 'delivered');
        break;
      case 'cancelled':
        filtered = orders.filter(o => o.orderStatus === 'cancelled');
        break;
      default:
        filtered = orders;
    }
    
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        const updatedOrders = orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        );
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8">
      <div className='h-20'></div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 text-sm mt-1">Manage customer orders and update their status</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
          <button 
            onClick={() => setError('')} 
            className="ml-4 text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Chips - Horizontal Scroll on Mobile */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {filterOptions.map(filter => {
            const count = filter.value === 'all' 
              ? orders.length 
              : filter.value === 'pending_delivery'
              ? orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length
              : filter.value === 'action_taken'
              ? orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.orderStatus)).length
              : orders.filter(o => o.orderStatus === filter.value).length;
            
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === filter.value
                    ? 'bg-[#5C3A21] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Cards - Mobile Friendly */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <div 
              className="p-4 cursor-pointer active:bg-gray-50"
              onClick={() => toggleExpand(order._id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-[#5C3A21] text-sm">#{order.orderNumber}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{order.user?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  <p className="text-xs text-gray-500">{order.paymentMethod === 'online' ? 'Online' : 'COD'}</p>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order._id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                {/* Customer Details */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer Details</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-600">Name:</span> {order.user?.name || 'N/A'}</p>
                    <p><span className="text-gray-600">Email:</span> {order.user?.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {order.address?.phone}</p>
                    {order.address && (
                      <p><span className="text-gray-600">Address:</span> {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-2 text-sm">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600 text-xs">
                          {item.selectedWeight} × {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Details</h4>
                  <div className="text-sm space-y-1">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatPrice(order.totalAmount - (order.deliveryCharge || 0))}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Delivery Charge:</span>
                      <span>{formatPrice(order.deliveryCharge || 0)}</span>
                    </p>
                    <p className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span className="text-gray-600">Total:</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span>{order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                    </p>
                    {order.paymentMethod === 'cod' && (
                      <>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${
                            order.paymentStatus === 'paid' ? 'text-green-600' : 
                            order.paymentStatus === 'partial_paid' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {order.paymentStatus === 'partial_paid' ? 'Advance Paid' : order.paymentStatus}
                          </span>
                        </p>
                        {order.paidAmount > 0 && (
                          <p className="flex justify-between">
                            <span className="text-gray-600">Paid Amount:</span>
                            <span>{formatPrice(order.paidAmount)}</span>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none bg-white"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {updatingId === order._id && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5C3A21]"></div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>

      {/* Status Statistics Cards - Horizontal Scroll on Mobile */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {statusOptions.map(status => {
            const count = orders.filter(o => o.orderStatus === status.value).length;
            return (
              <div key={status.value} className="bg-white rounded-lg px-4 py-3 shadow-sm min-w-[100px]">
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600">{status.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;