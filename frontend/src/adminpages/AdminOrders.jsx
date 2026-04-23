import React, { useState, useEffect } from 'react';
import { adminAPI } from '../config/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Order status options with colors
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
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

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div>
            <div className='h-20'></div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and update their status</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
          <button 
            onClick={() => setError('')} 
            className="ml-4 text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  {/* Order Number */}
                  <td className="px-4 py-4">
                    <span className="font-medium text-[#5C3A21]">{order.orderNumber}</span>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                      <p className="text-gray-500">{order.user?.email}</p>
                      <p className="text-gray-500">{order.address?.phone}</p>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-4">
                    <div className="text-sm max-w-xs">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-gray-700">
                          {item.name} ({item.selectedWeight}) × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-gray-500">
                        {order.paymentMethod === 'online' ? 'Online' : 'COD'}
                      </p>
                      {order.paymentMethod === 'cod' && (
                        <p className="text-xs text-gray-500">
                          Paid: {formatPrice(order.paidAmount || 0)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.paymentStatus === 'partial_paid'
                        ? 'bg-blue-100 text-blue-800'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus === 'partial_paid' ? 'Advance Paid' : order.paymentStatus}
                    </span>
                  </td>

                  {/* Order Status */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#5C3A21] focus:border-[#5C3A21] outline-none"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <span className="text-xs text-gray-500">Updating...</span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found yet.</p>
          </div>
        )}
      </div>

      {/* Order counts */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {statusOptions.map(status => {
          const count = orders.filter(o => o.orderStatus === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-600">{status.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
