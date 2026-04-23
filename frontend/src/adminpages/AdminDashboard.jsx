import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, orderAPI } from '../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get products count
      const productsRes = await adminAPI.getAllProducts();
      const totalProducts = productsRes.success ? productsRes.count || productsRes.data?.length || 0 : 0;

      // Get orders stats
      const ordersRes = await adminAPI.getOrderStats();
      const orderStats = ordersRes.success ? ordersRes.data : {};
      
      setStats({
        totalProducts,
        totalOrders: orderStats.totalOrders || 0,
        pendingOrders: orderStats.pendingOrders || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className='h-20'></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to your admin panel</p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className={`${card.color} text-white rounded-lg p-3 text-2xl mr-4`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">📦</span>
            <div>
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">View, edit, and delete products</p>
            </div>
          </Link>
          
          <Link
            to="/admin/products/add"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-500">Create a new product listing</p>
            </div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">🛒</span>
            <div>
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Manage customer orders</p>
            </div>
          </Link>
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">🏪</span>
            <div>
              <p className="font-medium text-gray-900">View Store</p>
              <p className="text-sm text-gray-500">Open store in new tab</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
